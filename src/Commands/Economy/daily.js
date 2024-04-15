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
        const dailyTimeout = 86400000; // 24 hours in milliseconds
        const dailyAmount = 3000; // Daily reward amount
        const streakGoal = 7; // Goal for a perfect streak

        const lastClaimed = await client.credit.get(`${M.sender}.daily`);
        let streak = await client.credit.get(`${M.sender}.streak`) || 0;
        let missedDays = await client.credit.get(`${M.sender}.missedDays`) || 0;

        let text = '';

        if (lastClaimed !== null && dailyTimeout - (Date.now() - lastClaimed) > 0) {
            const timeRemaining = ms(dailyTimeout - (Date.now() - lastClaimed));
            text += `*You have already claimed your daily reward. You have to wait ${timeRemaining.hours} hour(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} second(s)*`;
        } else {
            // Check if the streak has been reset due to missed days
            if (missedDays > 0 && streak < streakGoal) {
                await client.credit.set(`${M.sender}.streak`, 0); // Reset streak if not a perfect streak
            }

            // Increment streak if claimed within 24 hours
            if (streak === streakGoal - 1) {
                await client.credit.add(`${M.sender}.streak`, 1);
                await client.credit.set(`${M.sender}.daily`, Date.now());
                await client.credit.set(`${M.sender}.missedDays`, 0);

                text += `*Congratulations! You've completed a perfect streak!*`;
            } else if (streak >= streakGoal) {
                await client.credit.set(`${M.sender}.streak`, 1);
                await client.credit.set(`${M.sender}.daily`, Date.now());
                await client.credit.set(`${M.sender}.missedDays`, 0);

                text += `*You've started a new streak!*`;
            } else {
                await client.credit.add(`${M.sender}.streak`, 1);
                await client.credit.set(`${M.sender}.daily`, Date.now());

                text += `*You have claimed your daily reward 🎉: ${dailyAmount}*`;
            }
        }

        // Construct the daily streak representation
        let streakText = 'Your daily streak:\n';
        for (let i = 0; i < streakGoal; i++) {
            if (i < streak) {
                streakText += '🟩'; // Green box for streaked days
            } else if (i < streak + missedDays) {
                streakText += '🟥'; // Red box for missed days
            } else {
                streakText += '⬜'; // White box for remaining days
            }
        }

        // Send the response
        M.reply(`${text}\n${streakText}`);
    }
};
