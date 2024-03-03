const axios = require('axios');

module.exports = {
    name: 'haigusha',
    aliases: ['hg'],
    category: 'weeb',
    exp: 5,
    react: "✅",
    description: 'Summons a random anime character to marry',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        try {
            const result = await client.utils.fetch('https://reina-api.vercel.app/api/mwl/random');

            let text = '======== *HAIGUSHA* ========\n';
            // Remaining code remains unchanged
            
            await client.sendMessage(M.from, {
                image: {
                    url: result.data.image
                },
                caption: text
            });
        } catch (error) {
            console.error('Error fetching character information:', error);
            M.reply('An error occurred while fetching character information.');
        }
    }
};