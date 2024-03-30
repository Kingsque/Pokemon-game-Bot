const axios = require('axios');

module.exports = {
    name: 'meme',
    aliases: ['gimeme'],
    category: 'fun',
    exp: 16,
    cool: 4,
    react: "✅",
    description: 'Sends an image of random meme',
    async execute(client, arg, M) {
        try {
            const res = await axios.get('https://meme-api.com/gimme');
            if (res.data.success === true) {
                client.sendMessage(M.from, {
                    image: {
                        url: res.data.url
                    },
                    caption: `${res.data.title}`
                });
            } else {
                M.reply('Failed to fetch meme.');
            }
        } catch (err) {
            console.error(err);
            M.reply('Failed to fetch meme. Please try again later.');
        }
    }
};
