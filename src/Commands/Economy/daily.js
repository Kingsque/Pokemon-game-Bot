// Daily Command
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
        const userId = M.sender;
        let economy = await client.econ.findOne({ userId });

        // Check if the user has an economy e
        const dailyTimeout = 86400000; // 24 hours in milliseconds
        const dailyAmount = 3000; // Daily reward amount
        const streakGoal = 7; // Goal for a perfect streak

        const lastClaimed = economy ? economy.daily : 0;
        let streak = economy ? economy.streak : 0;
        let missedDays = economy ? economy.missedDays : 0;

        let text = '';

        if (lastClaimed !== null && dailyTimeout - (Date.now() - lastClaimed) > 0) {
            const timeRemaining = ms(dailyTimeout - (Date.now() - lastClaimed));
            text += `*You have already claimed your daily reward. You have to wait ${timeRemaining.hours} hour(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} second(s)*`;
        } else {
            // Check if the streak has been reset due to missed days
            if (missedDays > 0 && streak < streakGoal) {
                economy.streak = 0; // Reset streak if not a perfect streak
            }

            // Increment streak if claimed within 24 hours
            if (streak === streakGoal - 1) {
                economy.streak += 1;
                economy.gem += dailyAmount; // Add daily amount to the wallet
                economy.daily = Date.now();
                economy.missedDays = 0;
                text += `*Congratulations! You've completed a perfect streak!*`;
            } else if (streak >= streakGoal) {
                economy.streak = 1;
                economy.gem += dailyAmount; // Add daily amount to the wallet
                economy.daily = Date.now();
                economy.missedDays = 0;
                text += `*You've started a new streak!*`;
            } else {
                economy.streak += 1;
                economy.gem += dailyAmount; // Add daily amount to the wallet
                economy.daily = Date.now();
                text += `*You have claimed your daily reward 🎉: ${dailyAmount}*`;
            }

            await economy.save(); // Save the updated economy object
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
        await M.reply(`${text}\n${streakText}`);
    }
};
