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
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants || [];
        const groupAdmins = groupMembers.filter((v) => v.isAdmin).map((v) => v.id);
        
        const recipient = M.mentions[0] || (M.quoted && M.quoted.participant);

        if (!recipient) return M.reply('You must mention someone to transfer credits to.');

        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid positive amount.');

        const senderWallet = (await client.gem.get(`${M.sender}.wallet`)) || 0;
        if (senderWallet < amount) return M.reply('You don\'t have enough credits in your wallet.');

        const recipientWallet = await client.gem.get(`${recipient}.wallet`);
        const recipientCredits = recipientWallet ? recipientWallet : 0;

        await client.gem.add(`${recipient}.wallet`, amount);
        await client.gem.sub(`${M.sender}.wallet`, amount);

        const senderName = M.sender.split('@')[0];
        const recipientName = recipient.split('@')[0];

        const messageToAdmin = `@${senderName} transferred ${amount} credits to @${recipientName}`;
        const message = `You transferred *${amount}* credits to *@${recipientName}*`;

        await client.sendMessage(M.from, { text: message, mentions: [recipient] });
        await client.sendMessage("120363236615391329@g.us", { text: messageToAdmin });
    }
};
