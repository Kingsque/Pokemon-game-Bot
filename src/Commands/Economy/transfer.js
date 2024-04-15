module.exports = {
    name: 'give',
    aliases: ['pay', 'transfer'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :give <amount> @taguser',
    description: 'Transfer credits to your friend',
    async execute(client, arg, M) {
        if (!M.mentions.length) return M.reply('You must mention someone to transfer credits to.');

        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid positive amount.');

        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (senderCredits < amount) return M.reply('You don\'t have enough credits in your wallet.');

        const recipientWallet = await client.credit.get(`${M.mentions[0]}.wallet`);
        const recipientCredits = recipientWallet ? recipientWallet : 0;

        await client.credit.add(`${M.mentions[0]}.wallet`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);

        const senderName = M.sender.split('@')[0];
        const recipientName = M.mentions[0].split('@')[0];

        const messageToSender = `You gave *${amount}* credits to *@${recipientName}*`;
        const messageToRecipient = `You received *${amount}* credits from *@${senderName}*`;
        const messageToAdmin = `@${senderName} gave ${amount} credits to @${recipientName}`;

        await client.sendMessage(M.from, { text: messageToSender, mentions: [M.mentions[0]] });
        await client.sendMessage(M.mentions[0], { text: messageToRecipient, mentions: [M.sender] });
        await client.sendMessage("120363236615391329@g.us", { text: messageToAdmin });
    }
};
