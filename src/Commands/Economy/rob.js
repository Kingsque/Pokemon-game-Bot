module.exports = {
    name: 'rob',
    aliases: ['attack'],
    category: 'economy',
    exp: 5,
    cool: 5, // Cooldown period in seconds (5 minutes)
    react: "✅",
    usage: 'Use rob @taguser',
    description: 'Attempt to rob the mentioned user',
    async execute(client, arg, M) {
        const robTarget = M.mentions[0] || (M.quoted && M.quoted.participant);

        if (!robTarget) return M.reply('*You must mention someone to attempt the robbery*');

        const currentTime = Date.now();
        const lastRobTime = await client.DB.get(`${M.sender}.rob`)
        const cooldown = 100;

        // Check if the user is on cooldown
        const cooldownRemaining = lastRobTime + (cooldown * 1000) - currentTime;
        if (cooldownRemaining > 0) {
            const remainingMinutes = Math.ceil(cooldownRemaining / (60 * 1000));
            return M.reply(`*You are on cooldown! You can attempt to rob again in ${remainingMinutes} minutes.*`);
        }

        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        const targetCredits = (await client.credit.get(`${robTarget}.wallet`)) || 0;

        // Minimum credits required to attempt a robbery
        const minimumCreditsRequired = 500;

        if (senderCredits < minimumCreditsRequired) return M.reply(`*You need to have ${minimumCreditsRequired} gold or more to attempt to rob someone*`);
        if (targetCredits < minimumCreditsRequired) return M.reply('*The user doesn\'t have much money in their wallet*');

        // Check if the user has pepper spray
        const hasPepperSpray = await client.rpg.get(`${robTarget}.pepperspray`);

        // Adjust success probability based on whether the user has pepper spray
        const successProbability = hasPepperSpray ? 0.3 : 0.1;
        const result = Math.random() < successProbability ? 'success' : 'caught';

        // Calculate the amount to be robbed
        let amountRobbed = Math.floor(Math.random() * (senderCredits - minimumCreditsRequired) + minimumCreditsRequired);
        if (senderCredits >= 10000) amountRobbed = Math.floor(Math.random() * 10000);

        let targetLost = Math.floor(Math.random() * (targetCredits - minimumCreditsRequired) + minimumCreditsRequired);
        if (targetCredits >= 10000) targetLost = Math.floor(Math.random() * 10000);

        // Update wallet balances based on the result
        await client.credit.add(`${M.sender}.wallet`, result === 'success' ? amountRobbed : -targetLost);
        await client.credit.add(`${robTarget}.wallet`, result === 'success' ? -amountRobbed : targetLost);

        // Update last robbery time for cooldown
        await client.DB.set(`${M.sender}.rob`, currentTime);

        // Construct response text based on the result
        let text;
        if (result === 'caught') {
            if (hasPepperSpray) {
                text = `You got caught, but the user you attempted to rob had pepper spray and sprayed it on your eyes! You paid *${targetLost} gold* to *@${robTarget.split('@')[0]}*`;
            } else {
                text = `You got caught and paid *${targetLost} gold* to *@${robTarget.split('@')[0]}*`;
            }
        } else {
            text = `*@${M.sender.split('@')[0]}* successfully robbed *@${robTarget.split('@')[0]}* and got away with *${amountRobbed} credits!*`;
        }

        // Send the response
        client.sendMessage(M.from, { text, mentions: [M.sender, robTarget] }, { quoted: M });
    }
};
                                    
