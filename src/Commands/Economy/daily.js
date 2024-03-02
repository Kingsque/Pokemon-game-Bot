const ms = require('parse-ms');

module.exports = {
    name: 'daily',
    aliases: ['rewards'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Claims your daily rewards',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        const dailyTimeout = 86400000; // 24 hours in milliseconds
        const dailyAmount = 1000; // Amount of daily reward

        // Retrieve the last claimed daily timestamp from the database
        const lastClaimed = await client.cradit.get(`${M.sender}.daily`);

        let text = '';

        if (lastClaimed !== null && dailyTimeout - (Date.now() - lastClaimed) > 0) {
            // Calculate the time remaining until the next claim is available
            const timeRemaining = ms(dailyTimeout - (Date.now() - lastClaimed));
            text += `*You have already claimed your daily reward. You have to wait ${timeRemaining.hours} hour(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} second(s)*`;
        } else {
            // Add the daily reward amount to the user's wallet
            await client.cradit.add(`${M.sender}.wallet`, dailyAmount);

            // Update the last claimed timestamp in the database
            await client.cradit.set(`${M.sender}.daily`, Date.now());
            await client.DB.set(`${M.sender}.daily`, Date.now());

            text += `*You have claimed your daily reward 🎉: ${dailyAmount}*`;
        }

        // Reply to the user with the result
        M.reply(text);
    }
};