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
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
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