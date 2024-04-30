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
        const userId = M.sender; // Fixed missing semicolon
        const economy = await client.econ.findOne({ userId });
        const bonusTimeout = 31536000000; 
        const bonusAmount = 100000;
        let text = '';

        if (economy && economy.bonus !== null && bonusTimeout - (Date.now() - economy.bonus) > 0) { // Added check if economy exists
            const bonusTime = ms(bonusTimeout - (Date.now() - economy.bonus));
            text += `*You have already claimed your bonus reward. You cannot claim it again.*`;
        } else {
            text += `*Welcome to our Aurora family! We are really happy to have you as our member. You have claimed your bonus reward 🎉: ${bonusAmount}.*`;

            economy.gem += bonusAmount; // Fixed missing semicolon
            economy.bonus = Date.now(); // Fixed incorrect capitalization of 'Date'
            await economy.save();
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
