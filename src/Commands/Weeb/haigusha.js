const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'haigusha',
    aliases: ['hg'],
    category: 'weeb',
    exp: 5,
    react: "✅",
    description: 'Summons a random anime character to marry',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.haigusha`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            const result = await client.utils.fetch('https://reina-api.vercel.app/api/mwl/random');

            let text = '======== *HAIGUSHA* ========\n';
            // Remaining code remains unchanged
            
            await client.sendMessage(M.from, {
                image: {
                    url: result.data.image
                },
                caption: text
            });

            await client.DB.set(`${M.sender}.haigusha`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error fetching character information:', error);
            M.reply('An error occurred while fetching character information.');
        }
    }
};