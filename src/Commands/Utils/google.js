const axios = require('axios');
const Apikey = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5';
const cx = 'f07c35702a6a1499c';
const ms = require('parse-ms');

module.exports = {
    name: 'google',
    aliases: ['search'],
    category: 'utils',
    exp: 5,
    react: "✅",
    description: 'Search topics from google.com',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.google`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');

            const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${arg}&key=${Apikey}&cx=${cx}`);

            if (!response.data || !response.data.items || response.data.items.length === 0) {
                return M.reply('❌ Unable to find any results.');
            }

            const results = response.data.items;

            let text = `==== GOOGLE SEARCH ====\n\n`;
            for (const result of results) {
                text += `*Title:* ${result.title}\n`;
                text += `*Description:* ${result.snippet}\n`;
                text += `🌐 *Link:* ${result.link}\n\n========================\n`;
            }

            M.reply(text);

            await client.DB.set(`${M.sender}.google`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error fetching Google search results:', error);
            M.reply('An error occurred while fetching the search results.');
        }
    }
};