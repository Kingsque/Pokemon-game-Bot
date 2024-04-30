// Bonus Command
const ms = require('parse-ms');

module.exports = {
    name: 'bonus',
    aliases: ['bonus'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :bonus',
    description: 'Claims your bonus',
    async execute(client, arg, M) {
        const userId = M.sender;
        const economy = await client.econ.findOne({ userId });
        const bonusTimeout = 31536000000; 
        const bonusAmount = 100000;
        let text = '';

        if (economy && economy.lastBonus !== null && bonusTimeout - (Date.now() - economy.lastBonus) > 0) {
            const bonusTime = ms(bonusTimeout - (Date.now() - economy.lastBonus));
            text += `*You have already claimed your bonus reward. You cannot claim it again.*`;
        } else {
            text += `*Welcome to our Aurora family! We are really happy to have you as our member. You have claimed your bonus reward 🎉: ${bonusAmount}.*`;

            if (!economy) {
                const newEconomy = new client.econ({
                    userId,
                    gem: bonusAmount,
                    treasury: 0,
                    luckPotion: 0,
                    pepperSpray: 0,
                    pokeball: 0,
                    lastBonus: Date.now(),
                    lastDaily: null,
                    lastRob: null
                });
                await newEconomy.save();
            } else {
                economy.gem += bonusAmount;
                economy.lastBonus = Date.now();
                await economy.save();
            }
        }

        await client.sendMessage(
            M.from,
            {
                image: { url: "https://i.ibb.co/tPhb428/Aurora.jpg" },
                caption: text
            },
            {
                quoted: M
            }
        );
    }
};
