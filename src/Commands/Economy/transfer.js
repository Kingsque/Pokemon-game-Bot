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
        if (!M.mentions.length) return M.reply('*You must mention someone to attend the robbery*')
        const amount = parseInt(arg.split(' ')[0])
        if (!amount) return M.reply('Please provide the amount')
        if (arg.split(' ')[0].startsWith('-') || arg.split(' ')[0].startsWith('+'))
            return M.reply('Please provide the amount')
        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (senderCredits < amount) return M.reply('You don\'t have that much in your wallet');
        await client.credit.add(`${M.mentions[0]}.wallet`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);
        const senderName = M.sender.split('@')[0];
        const recipientName = M.mentions[0].split('@')[0];
        const messageToSender = `You gave *${amount}* to *@${recipientName}*`;
        const messageToAdmin = `@${senderName} gave ${amount} to @${recipientName}`;
        return M.reply(messageToSender);
        await client.sendMessage("120363236615391329@g.us", { text: messageToAdmin, mentions: [M.mentions[0]] });
    }
};
