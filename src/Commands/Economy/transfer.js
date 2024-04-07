module.exports = {
    name: 'give',
    aliases: ['pay', 'transfer'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :give <amount> @taguser',
    description: 'Transfer golds to your friend',
    async execute(client, arg, M) {
        if (!M.mentions.length) return M.reply('*You must mention someone to send the money*');
        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid and positive amount');
        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (senderCredits < amount) return M.reply('You don\'t have that much in your wallet');
        await client.credit.add(`${M.mentions[0]}.wallet`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);
        const senderName = M.sender.split('@')[0];
        const recipientName = M.mentions[0].split('@')[0];
        const messageToSender = `You gave *${amount}* to *@${recipientName}*`;
        const messageToAdmin = `@${senderName} gave ${amount} to @${recipientName}`;
        client.sendMessage(M.from, { text: messageToSender, mentions: [M.mentions[0]] }, { quoted: M });
        await client.sendMessage("120363236615391329@g.us", messageToAdmin);
    }
};
