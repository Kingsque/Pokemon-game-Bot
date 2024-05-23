const axios = require('axios');

module.exports = {
    name: 'nude',
    aliases: ['nudewaifu'],
    category: 'NSFW',
    exp: 7,
    react: "🤭",
    usage: 'Use :waifu',
    description: 'Sends an image of a random waifu',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) { 

        try {
            const response = await axios.get('https://fantox-apis.vercel.app/nude');
            
            if (!response.data || !response.data.images || response.data.images.length === 0) {
                throw new Error('No waifu images found.');
            }
            
            const waifuImage = response.data.images[0];
            const caption = `ʚ ғᴏʀ ʏᴏᴜ ғʀᴏᴍ ᴡᴇʙ ɞ`;

            await client.sendMessage(M.from, {
                image: {
                    url: waifuImage.url
                },
                caption: caption
            });
        } catch (error) {
            console.error('Error fetching waifu image:', error);
            M.reply('Failed to fetch waifu image.');
            client.log(error, 'red');
        }
    }
};
