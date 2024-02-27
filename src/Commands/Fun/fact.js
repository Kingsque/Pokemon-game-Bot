const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'fact',
    aliases: ['ft'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Sends random facts',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.fact`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        try {
            const response = await axios.get('https://nekos.life/api/v2/fact');
            const text = `Fact for you: ${response.data.fact}`;
            M.reply(text);
            await client.DB.set(`${M.sender}.fact`, Date.now());
        } catch (err) {
            console.error('Error fetching fact:', err);
            M.reply('Error fetching fact. Please try again later.');
        }
    }
};