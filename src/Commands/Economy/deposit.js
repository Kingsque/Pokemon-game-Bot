// Deposit Command
module.exports = {
    name: 'deposit',
    aliases: ["dt", "depo"],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :deposit <amount>',
    description: 'Deposits credits from your wallet to your bank',
    async execute(client, arg, M) {
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount.');

        const amount = parseInt(arg);
        if (amount <= 0) return M.reply('Please provide a positive amount.');

        const wallet = (await client.gem.get(`${M.sender}.wallet`)) || 0;
        if (wallet < amount) return M.reply('You don\'t have enough credits in your wallet.');

        await client.gem.add(`${M.sender}.bank`, amount);
        await client.gem.sub(`${M.sender}.wallet`, amount);

        M.reply(`You have successfully deposited ${amount} credits into your bank.`);
    }
};
