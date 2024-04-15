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
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants || [];
        const groupAdmins = groupMembers.filter((v) => v.isAdmin).map((v) => v.id);
        
        const give = M.mentions[0] || (M.quoted && M.quoted.participant);

        if (!give) return M.reply('You must mention someone to transfer credits to.');

        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount) || amount <= 0) return M.reply('Please provide a valid positive amount.');

        const senderCredits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (senderCredits < amount) return M.reply('You don\'t have enough credits in your wallet.');

        const recipientWallet = await client.credit.get(`${give}.wallet`);
        const recipientCredits = recipientWallet ? recipientWallet : 0;

        await client.credit.add(`${give}.wallet`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);

        const senderName = M.sender.split('@')[0];
        const recipientName = give.split('@')[0];

        const messageToAdmin = `@${senderName} gave ${amount} credits to @${recipientName}`;
        const message = `You gave *${amount}* credits to *@${recipientName}*`;

        await client.sendMessage(M.from, { text: message, mentions: [give] });
        await client.sendMessage("120363236615391329@g.us", { text: messageToAdmin });
    }
};
