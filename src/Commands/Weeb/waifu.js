const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'waifu',
    aliases: ['animegirl'],
    category: 'weeb',
    exp: 7,
    react: "✅",
    description: 'Sends an image of a random waifu',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) { 
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.waifu`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            const response = await axios.get('https://api.waifu.im/search/?included_tags=waifu');
            
            if (!response.data || !response.data.images || response.data.images.length === 0) {
                throw new Error('No waifu images found.');
            }
            
            const waifuImage = response.data.images[0];
            const caption = `Waifu from ${waifuImage.source}`;

            await client.sendMessage(M.from, {
                image: {
                    url: waifuImage.url
                },
                caption: caption
            });

            await client.DB.set(`${M.sender}.waifu`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error fetching waifu image:', error);
            M.reply('Failed to fetch waifu image.');
            client.log(error, 'red');
        }
    }
};