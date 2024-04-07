const ms = require('parse-ms');

module.exports = {
    name: 'daily',
    aliases: ['daily'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'daily',
    description: 'Claims your daily rewards',
    async execute(client, arg, M) {
        const dailyTimeout = 86400000; 
        const dailyAmount = 3000; 

        const lastClaimed = await client.credit.get(`${M.sender}.daily`);

        let text = '';

        if (lastClaimed !== null && dailyTimeout - (Date.now() - lastClaimed) > 0) {
            const timeRemaining = ms(dailyTimeout - (Date.now() - lastClaimed));
            text += `*You have already claimed your daily reward. You have to wait ${timeRemaining.hours} hour(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} second(s)*`;
        } else {
            await client.credit.add(`${M.sender}.wallet`, dailyAmount);

            await client.credit.set(`${M.sender}.daily`, Date.now());

            text += `*You have claimed your daily reward 🎉: ${dailyAmount}*`;
        }

        M.reply(text);
    }
};
