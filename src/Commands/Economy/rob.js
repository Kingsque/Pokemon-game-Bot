const ms = require('parse-ms');

module.exports = {
    name: 'rob',
    aliases: ['attack'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Attempt to rob the mentioned user',
    async execute(client, arg, M) {
        if (!M.mentions.length) return M.reply('*You must mention someone to attempt the robbery*');

        const cooldownTime = 90000; // 90 seconds cooldown
        const lastRob = await client.cradit.get(`${M.sender}.lastrob`) || 0;
        if (cooldownTime - (Date.now() - lastRob) > 0) {
            const timeLeft = ms(cooldownTime - (Date.now() - lastRob));
            return M.reply(`You robbed recently. Try again in ${timeLeft.minutes} minute(s), ${timeLeft.seconds} second(s).`);
        }

        const senderCredits = (await client.cradit.get(`${M.sender}.wallet`)) || 0;
        const mentionCredits = (await client.cradit.get(`${M.mentions[0]}.wallet`)) || 0;

        if (senderCredits < 500) return M.reply('*You need to have 500 gold or more to attempt to rob someone*');
        if (mentionCredits < 500) return M.reply('*The user doesn\'t have much money in their wallet*');

        const getResultByProbability = (n) => {
            if (Math.random() < n) return 'success';
            return 'caught';
        };

        await client.cradit.set(`${M.sender}.lastrob`, Date.now());
        const result = getResultByProbability(0.1);

        let targetAmount = Math.floor(Math.random() * (senderCredits - 250) + 250);
        if (senderCredits >= 10000) targetAmount = Math.floor(Math.random() * 10000);

        let userAmount = Math.floor(Math.random() * (mentionCredits - 250) + 250);
        if (userAmount >= 10000) userAmount = Math.floor(Math.random() * 10000);

        await client.cradit.add(`${M.sender}.wallet`, result === 'success' ? targetAmount : -userAmount);
        await client.cradit.add(`${M.mentions[0]}.wallet`, result === 'success' ? -targetAmount : userAmount);

        const text = result === 'caught'
            ? `You got caught and paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`
            : `*@${M.sender.split('@')[0]}* robbed *@${M.mentions[0].split('@')[0]}* and got away with *${targetAmount} gold!*`;

        client.sendMessage(M.from, { text, mentions: [M.sender, M.mentions[0]] }, { quoted: M });
    }
};