const axios = require('axios');
const Apikey = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
const cx = 'f07c35702a6a1499c';

module.exports = {
    name: 'generate',
    aliases: ['gene'],
    category: 'Ai',
    exp: 7,
    react: "✅",
    description: 'Let you generate images by Ai',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {

        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');
            
            // Perform a Google Image search
            const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${arg}&searchType=image&key=${Apikey}&cx=${cx}`);
            
            // Check if the response is successful
            if (!response.data || !response.data.items || response.data.items.length === 0) {
                return M.reply('Could not find any images for the searched term.');
            }
            
            // Get the URL of the first image
            const imageUrl = response.data.items[0].link;
            
            // Send the image URL as a message
            client.sendMessage(M.from, {
                image: {
                    url: imageUrl
                },
                caption: 'Here you go'
            });
        } catch (error) {
            console.error('Error searching for images:', error);
            M.reply('An error occurred while searching for images.');
        }
    }
};