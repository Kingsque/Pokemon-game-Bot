// Withdraw Command
module.exports = {
    name: 'withdraw',
    aliases: ["wt", "with"],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :withdraw <amount>',
    description: 'Withdraws credits from your bank to your wallet',
    async execute(client, arg, M) {
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount.');
        
        const amount = parseInt(arg);
        if (amount <= 0) return M.reply('Please provide a positive amount.');

        const bank = (await client.gem.get(`${M.sender}.bank`)) || 0;
        if (bank < amount) return M.reply('You don\'t have enough credits in your bank.');

        await client.gem.add(`${M.sender}.wallet`, amount);
        await client.gem.sub(`${M.sender}.bank`, amount);

        M.reply(`You have successfully withdrawn ${amount} credits from your bank.`);
    }
};
