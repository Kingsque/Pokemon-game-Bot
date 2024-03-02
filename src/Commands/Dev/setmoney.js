module.exports = {
    name: "setmoney",
    aliases: ["sm"],
    category: "dev",
    exp: 5,
    cool: 4,
    react: "✅",
    description: "sets money to mentioned user's wallet",
    async execute(client, arg, M) {
        
        if (!M.mentions.length) return M.reply('*You must mention someone to attend the robbery*');

        const amount = parseInt(arg.split(' ')[0]);

        if (isNaN(amount)) return M.reply('Please provide a valid amount');

        if (amount < 0) return M.reply('Please provide a positive amount');

        let userWallet = await client.cradit.get(`${M.mentions[0]}.wallet`);
        userWallet = userWallet ? userWallet : 0;

        await client.cradit.set(`${M.mentions[0]}.wallet`, amount);

        client.sendMessage(
            M.from,
            { text: `You set *${amount}* to *@${M.mentions[0].split('@')[0]}* \nNew Balance: ${amount}`, mentions: [M.mentions[0]] },
            { quoted: M }
        );
    }
};