const axios = require('axios');
const cooldowns = new Map();

module.exports = {
    name: 'ai',
    aliases: ['learn'],
    category: 'Ai',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :ai <prompt>',
    description: 'Let you get interacted with the 3.5 turbo version GPT in whatsapp and each user can use it for 3 times per hour',
    async execute(client, arg, M) {
        arg = Array.isArray(arg) ? arg : [arg];
        const query = arg.join(' ');

        // Get the user ID
        const userId = M.sender;

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
            // Fetch information from Wikipedia API
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);

            if (response.data.extract) {
                // If information is available, send it as a reply
                M.reply(response.data.extract);
            } else {
                // If no information is found, send a message indicating it
                M.reply(`Sorry, I couldn't find information about "${query}"`);
            }
        } catch (error) {
            // If an error occurs during the request, send an error message
            console.error('Error:', error.message);
            M.reply(`Error: Unable to fetch information about "${query}"`);
        }
    }
};
