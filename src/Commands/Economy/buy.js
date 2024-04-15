// buy command
const items = {
    luckpotion: 15000,
    pepperspray: 10000,
    pokeball: 12000
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
        const userWallet = (await client.credit.get(`${M.sender}.wallet`)) || 0;

        if (userWallet < totalPrice) {
            return M.reply(`You don't have enough credits to buy ${quantity} ${itemName}(s).`);
        }

        await client.credit.sub(`${M.sender}.wallet`, totalPrice);
        await client.rpg.add(`${M.sender}.${itemName}`, quantity);

        const newItemAmount = (await client.rpg.get(`${M.sender}.${itemName}`)) || 0;
        M.reply(`Thank you for your purchase! You now have ${newItemAmount} ${itemName}(s).`);
    },
};
