const axios = require('axios');

module.exports = {
    name: 'ai',
    aliases: ['learn'],
    category: 'Ai',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Let you get interacted with the 3.5 version GPT in whatsapp',
    async execute(client, arg, M) {
        arg = Array.isArray(arg) ? arg : [arg];
        const query = arg.join(' ');

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
