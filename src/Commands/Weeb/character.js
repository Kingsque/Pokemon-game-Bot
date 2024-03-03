const axios = require('axios');

module.exports = {
    name: 'character',
    aliases: ['char'],
    category: 'weeb',
    react: "✅",
    exp: 5,
    cool: 4, // Adding cooldown time in seconds
    description: 'Provides information about a character from anime',
    async execute(client, arg, M) {
        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');
            
            const response = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(arg)}`);
            
            if (response.data.data.length === 0) return M.reply('404 Error: Could not find any characters matching the given term.');
            
            const character = response.data.data[0];
            const text = `==== *CHARACTER INFO* ====\n\n*Name:* ${character.name}\n*Japanese:* ${character.name_kanji}\n*Favorites:* ${character.favorites}\n*Mal_ID:* ${character.mal_id}\n*Description:* ${character.about || 'Not available'}\n\n========================\n`;
            
            await client.sendMessage(M.from, {
                image: {
                    url: character.image.jpg.image_url
                },
                caption: text
            });
        } catch (error) {
            console.error('Error fetching character information:', error);
            M.reply('An error occurred while fetching character information.');
        }
    }
};