// Buy Command
const items = {
    luckpotion: 15000,
    pepperspray: 10000,
    pokeball: 12000,
    greatball: 20000,
    ultraball: 50000
};

module.exports = {
    name: 'buy',
    aliases: ['acquire'],
    category: 'economy',
    exp: 10,
    cool: 4,
    react: '✅',
    usage: 'Use :buy <item_name> <item_quantity>',
    description: 'Buy an item from the shop',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Please specify an item name and quantity.');
        const [itemName, quantityStr] = arg.split(' ');
        const quantity = parseInt(quantityStr) || 1;

        if (!items[itemName]) return M.reply('Please provide a valid item name.');

        const totalPrice = items[itemName] * quantity;
        const userWallet = (await client.econ.findOne({ userId: M.sender }))?.gem || 0;

        if (userWallet < totalPrice) {
            return M.reply(`You don't have enough credits to buy ${quantity} ${itemName}(s).`);
        }

        const economy = await client.econ.findOne({ userId: M.sender });
        economy.gem -= totalPrice;
        economy[itemName] += quantity;
        await economy.save();

        M.reply(`Thank you for your purchase! You now have ${quantity} ${itemName}(s).`);
    },
};
