const items = {
    buy: [
        { name: 'luckpotion', price: 1200, usage: 'Increases luck in slotting' },
        { name: 'pepperspray', price: 1000, usage: 'Self-defense against robbers' },
    ]
};

module.exports = {
    name: 'shop',
    aliases: ['store'],
    category: 'economy',
    exp: 10,
    cool: 4,
    react: '✅',
    usage: 'Use :shop',
    description: 'View items available for purchase',
    async execute(client, arg, M) {
        let text = '*❯─『 SHOP 』─❮*';
        text += '\n\n';
        items.buy.forEach((item, index) => {
            text += `${index + 1}) *Name:* ${item.name}\n💰 *price:* ${item.price}\n🎴 *Usage:* ${item.usage}\n`;
        });
        text += `\n🎴 Use ${client.prefix}buy <item_name> <item_quantity>`;
        text += `\n📗 Example: ${client.prefix}buy luckpotion 2`;
        M.reply(text);
    },
};
