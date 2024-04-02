const axios = require('axios');
const Apikey = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
const cx = 'f07c35702a6a1499c';
const cooldowns = new Map();

module.exports = {
    name: 'generate',
    aliases: ['gene'],
    category: 'Ai',
    exp: 7,
    react: "✅",
    usage: 'Use :generate <prompt>',
    description: 'Let you generate images of your choice by an Ai',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        arg = Array.isArray(arg) ? arg : [arg];
        const query = arg.join(' ');

        // Get the user ID
        const userId = M.author.id;

        // Check if the user has a cooldown timestamp stored
        if (!cooldowns.has(userId)) {
            // If not, set initial timestamp
            cooldowns.set(userId, []);
        }

        const timestamps = cooldowns.get(userId);
        const now = Date.now();
        const cooldownAmount = 60 * 60 * 1000; // 1 hour cooldown
        const limitPerHour = 3;

        // Remove timestamps older than 1 hour
        while (timestamps.length > 0 && timestamps[0] < now - cooldownAmount) {
            timestamps.shift();
        }

        // Check if the user has exceeded the limit
        if (timestamps.length >= limitPerHour) {
            const timeLeft = Math.ceil((timestamps[0] - (now - cooldownAmount)) / 1000);
            return M.reply(`You have reached the usage limit. Please wait ${timeLeft} seconds before using this command again.`);
        }

        // Add the current timestamp to the user's cooldown timestamps
        timestamps.push(now);

        try {
            if (!query) return M.reply('Sorry, you did not provide any search term!');
            
            // Perform a Google Image search
            const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=${Apikey}&cx=${cx}`);
            
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
