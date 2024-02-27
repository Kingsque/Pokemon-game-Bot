const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'meme',
    aliases: ['gimeme'],
    category: 'fun',
    exp: 16,
    cool: 4,
    react: "✅",
    description: 'Sends an image of random meme',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.meme`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            const res = await axios.get('https://meme-api.com/gimme');
            await client.DB.set(`${M.sender}.meme`, Date.now());
            if (res.data.success === true) {
                client.sendMessage(M.from, {
                    image: {
                        url: res.data.url
                    },
                    caption: `${res.data.title}`
                });
            } else {
                throw new Error('Failed to fetch meme.');
            }
        } catch (err) {
            console.error(err);
            M.reply('Failed to fetch meme. Please try again later.');
        }
    }
};