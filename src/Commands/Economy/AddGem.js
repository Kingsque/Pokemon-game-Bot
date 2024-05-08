// AddGem Command
module.exports = {
    name: 'addgem',
    aliases: ['addgems'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :addgem <amount> [@taguser]',
    description: 'Add gems to yourself or transfer gems to another user',
    async execute(client, arg, M) {
        const recipient = M.mentions[0] || (M.quoted && M.quoted.participant);

        let amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid positive amount.');

        const userId = M.sender;
        const senderEconomy = await client.econ.findOne({ userId });

        if (!recipient) {
            // If no one is tagged, add gems to sender's own account
            senderEconomy.gems += amount;
            await senderEconomy.save();
            return M.reply(`You added ${amount} gems to your account.`);
        }

        const senderWallet = senderEconomy.gems || 0;
        if (senderWallet < amount) return M.reply('You don\'t have enough gems in your wallet.');

        const recipientEconomy = await client.econ.findOne({ userId: recipient });

      
        await senderEconomy.save();

        recipientEconomy.gems += amount;
        await recipientEconomy.save();

        const senderName = M.sender.split('@')[0];
        const recipientName = recipient.split('@')[0];

        const messageToAdmin = `@${senderName} transferred ${amount} gems to @${recipientName}`;
        const message = `You transferred *${amount}* gems to *@${recipientName}*`;

        await client.sendMessage(M.from, { text: message, mentions: [recipient] });
    }
};