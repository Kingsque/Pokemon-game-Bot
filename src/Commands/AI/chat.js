const axios = require('axios');

module.exports = {
    name: 'chat',
    aliases: ['chatbot'],
    category: 'Ai',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :chat <text>',
    description: 'Lets you chat with your assistant chatbot',
    async execute(client, arg, M) {
        try {
            // Check if arg is an array, if not, convert it to an array
            arg = Array.isArray(arg) ? arg : [arg];

            const uid = encodeURIComponent(M.sender.jid); // Encode user's JID
            const msg = encodeURIComponent(arg.join('')); // Encode user's message

            // Send GET request to BrainShop API
            const response = await axios.get(`http://api.brainshop.ai/get?bid=170305&key=8OpWeiccHtCb1dFj&uid=${uid}&msg=${msg}`);

            if (response.status === 200 && response.data.cnt) {
                // If successful response, send chatbot's reply to the user
                M.reply(response.data.cnt);
            } else {
                // If response is not successful or no content, send an error message
                M.reply(`Error: Unable to process your request.`);
            }
        } catch (error) {
            // If an error occurs during the request, send an error message
            console.error('Error:', error.message);
            M.reply(`Error: Unable to process your request.`);
        }
    }
};
