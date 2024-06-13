const axios = require('axios');

module.exports = {
    name: 'foxgirl',
    aliases: ['animegirl','foxg','fg'],
    category: 'weeb',
    exp: 7,
    react: "⚡",
    usage: 'Use: Foxgirl',
    description: 'Sends an image of a random waifu',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) { 

        try {
            const response = await axios.get('https://nekos.life/api/v2/img/fox_girl');
            
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
