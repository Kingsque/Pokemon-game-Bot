const ms = require('parse-ms');
const path = require('path');

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

        const bonusTimeout = 604800000; 
        const bonusAmount = 50000;
        const bonus = await client.credit.get(`${M.sender}.bonus`);
        let text = '';

        if (bonus !== null && bonusTimeout - (Date.now() - bonus) > 0) {
            const bonusTime = ms(bonusTimeout - (Date.now() - bonus));
            text += `*You have already claimed your bonus reward. You cannot claim it again. Time left: ${bonusTime.days}d ${bonusTime.hours}h ${bonusTime.minutes}m ${bonusTime.seconds}s.*`;
        } else {
            text += `*Welcome to our Aurora family! We are really happy to have you as our member. You have claimed your bonus reward 🎉: ${bonusAmount}.*`;

            await client.credit.add(`${M.sender}.wallet`, bonusAmount);
            await client.credit.set(`${M.sender}.bonus`, Date.now());
        }

        M.reply(text);
    }
};
