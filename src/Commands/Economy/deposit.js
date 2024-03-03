module.exports = {
    name: 'deposit',
    aliases: ["dt", "depo"],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Deposits golds in your bank',
    async execute(client, arg, M) {
    
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount');
        const amount = parseInt(arg);
        if (amount <= 0) return M.reply('Please provide a positive amount');
        const wallet = (await client.cradit.get(`${M.sender}.wallet`)) || 0;
        if (wallet < amount) return M.reply('You don\'t have enough in your wallet');
        await client.cradit.add(`${M.sender}.bank`, amount);
        await client.cradit.sub(`${M.sender}.wallet`, amount);
        M.reply(`You have successfully deposited ${amount} in your bank`);
    }
};