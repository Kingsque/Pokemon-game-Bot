module.exports = {
    name: 'rob',
    aliases: ['attack'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use rob @taguser'
    description: 'Attempt to rob the mentioned user',
    async execute(client, arg, M) {
        if (!M.mentions.length) return M.reply('*You must mention someone to attempt the robbery*');

        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        const mentionCredits = (await client.credit.get(`${M.mentions[0]}.wallet`)) || 0;

        if (senderCredits < 500) return M.reply('*You need to have 500 gold or more to attempt to rob someone*');
        if (mentionCredits < 500) return M.reply('*The user doesn\'t have much money in their wallet*');

        // Check if the user has pepper spray
        const hasPepperSpray = await client.rpg.get(`${M.mentions[0]}.pepperspray`);

        const successProbability = hasPepperSpray ? 0.3 : 0.1;
        const result = Math.random() < successProbability ? 'success' : 'caught';

        let targetAmount = Math.floor(Math.random() * (senderCredits - 250) + 250);
        if (senderCredits >= 10000) targetAmount = Math.floor(Math.random() * 10000);

        let userAmount = Math.floor(Math.random() * (mentionCredits - 250) + 250);
        if (userAmount >= 10000) userAmount = Math.floor(Math.random() * 10000);

        await client.credit.add(`${M.sender}.wallet`, result === 'success' ? targetAmount : -userAmount);
        await client.credit.add(`${M.mentions[0]}.wallet`, result === 'success' ? -targetAmount : userAmount);

        let text;
        if (result === 'caught') {
            if (hasPepperSpray) {
                text = `You got caught, but the user you attempted to rob had pepper spray and sprayed it on your eyes! You paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`;
            } else {
                text = `You got caught and paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`;
            }
        } else {
            text = `*@${M.sender.split('@')[0]}* robbed *@${M.mentions[0].split('@')[0]}* and got away with *${targetAmount} credits!*`;
        }

        client.sendMessage(M.from, { text, mentions: [M.sender, M.mentions[0]] }, { quoted: M });
    }
};
