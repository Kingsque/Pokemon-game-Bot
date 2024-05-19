// Transfer Command
module.exports = {
    name: 'transfer',
    aliases: ['give', 'pay'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :transfer <amount> @taguser',
    description: 'Transfer credits to your friend',
    async execute(client, arg, M){
        const recipient = M.mentions[0] || (M.quoted && M.quoted.participant);

        if (!recipient) return M.reply('You must mention someone to transfer credits to.');

        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid positive amount.');

        const userId = M.sender;
        const senderEconomy = await client.econ.findOne({ userId });

        const senderWallet = senderEconomy.gem || 0;
        if (senderWallet < amount) return M.reply('You don\'t have enough credits in your wallet.');

        const recipientEconomy = await client.econ.findOne({ userId: recipient });

        senderEconomy.gem -= amount;
        await senderEconomy.save();

        recipientEconomy.gem += amount;
        await recipientEconomy.save();

        const senderName = M.sender.split('@')[0];
        const recipientName = recipient.split('@')[0];

        const messageToAdmin = `@${senderName} transferred ${amount} credits to @${recipientName}`;
        const message = `You transferred *${amount}* credits to *@${recipientName}*`;

        await client.sendMessage(M.from, { text: message, mentions: [recipient] });
        await client.sendMessage("120363236615391329@g.us", { text: messageToAdmin });
    }
};
