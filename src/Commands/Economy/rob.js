module.exports = {
    name: 'rob',
    aliases: ['attack'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use rob @taguser',
    description: 'Attempt to rob the mentioned user',
    async execute(client, arg, M) {
        if (!M.mentions.length) return M.reply('*You must mention someone to attempt the robbery*');

        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        const mentionCredits = (await client.credit.get(`${M.mentions[0]}.wallet`)) || 0;

        // Minimum credits required to attempt a robbery
        const minimumCreditsRequired = 500;

        if (senderCredits < minimumCreditsRequired) return M.reply(`*You need to have ${minimumCreditsRequired} gold or more to attempt to rob someone*`);
        if (mentionCredits < minimumCreditsRequired) return M.reply('*The user doesn\'t have much money in their wallet*');

        // Check if the user has pepper spray
        const hasPepperSpray = await client.rpg.get(`${M.mentions[0]}.pepperspray`);

        // Adjust success probability based on whether the user has pepper spray
        const successProbability = hasPepperSpray ? 0.3 : 0.1;
        const result = Math.random() < successProbability ? 'success' : 'caught';

        // Calculate the amount to be robbed
        let targetAmount = Math.floor(Math.random() * (senderCredits - minimumCreditsRequired) + minimumCreditsRequired);
        if (senderCredits >= 10000) targetAmount = Math.floor(Math.random() * 10000);

        let userAmount = Math.floor(Math.random() * (mentionCredits - minimumCreditsRequired) + minimumCreditsRequired);
        if (userAmount >= 10000) userAmount = Math.floor(Math.random() * 10000);

        // Update wallet balances based on the result
        await client.credit.add(`${M.sender}.wallet`, result === 'success' ? targetAmount : -userAmount);
        await client.credit.add(`${M.mentions[0]}.wallet`, result === 'success' ? -targetAmount : userAmount);

        // Construct response text based on the result
        let text;
        if (result === 'caught') {
            if (hasPepperSpray) {
                text = `You got caught, but the user you attempted to rob had pepper spray and sprayed it on your eyes! You paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`;
            } else {
                text = `You got caught and paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`;
            }
        } else {
            text = `*@${M.sender.split('@')[0]}* successfully robbed *@${M.mentions[0].split('@')[0]}* and got away with *${targetAmount} credits!*`;
        }

        // Send the response
        client.sendMessage(M.from, { text, mentions: [M.sender, M.mentions[0]] }, { quoted: M });
    }
};
