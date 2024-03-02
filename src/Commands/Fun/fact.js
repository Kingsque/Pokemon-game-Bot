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
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
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