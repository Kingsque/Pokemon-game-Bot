const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'neko',
    aliases: ['catgirl'],
    category: 'weeb',
    exp: 10,
    cool: 4,
    react: "✅",
    description: 'Sends an image of a random neko',
    async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.neko`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        try {
        await client.DB.set(`${M.sender}.neko`, Date.now());
            const res = await axios.get(`https://api.waifu.pics/sfw/neko`);
            if (!res.data || !res.data.url) {
                throw new Error('Failed to fetch neko image.');
            }
            await client.sendMessage(M.from, {
                image: {
                    url: res.data.url
                },
                caption: '_Neko Neko Ni~_'
            });
        } catch (err) {
            console.error('Error fetching neko image:', err);
            M.reply('Failed to fetch neko image.');
            client.log(err, 'red');
        }
    }
};