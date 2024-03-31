module.exports = {
    name: 'deposit',
    aliases: ["dt", "depo"],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :deposit <amount>',
    description: 'Deposits credits from your credits to your treasury',
    async execute(client, arg, M) {
    
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount');
        const amount = parseInt(arg);
        if (amount <= 0) return M.reply('Please provide a positive amount');
        const wallet = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (wallet < amount) return M.reply('You don\'t have enough in your wallet');
        await client.credit.add(`${M.sender}.bank`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);
        M.reply(`You have successfully deposited ${amount} in your bank`);
    }
};
