const items = {
    buy: [
        { name: 'luckpotion', price: 1200, usage: 'Increases luck in slotting' },
        { name: 'pepperspray', price: 1000, usage: 'Self-defense against robbers' },
        { name: 'woodpickaxe', price: 10000, usage: 'Mining in forest' },
        { name: 'ironpickaxe', price: 30000, usage: 'Mining in iron mine' },
        { name: 'goldpickaxe', price: 50000, usage: 'Mining in deep forest' },
        { name: 'diamondpickaxe', price: 70000, usage: 'Mining in coal mine' },
        { name: 'emeraldpickaxe', price: 100000, usage: 'Mining in top secret mine' },
    ]
};

module.exports = {
    name: 'estore',
    aliases: ['eshop'],
    category: 'event',
    exp: 10,
    cool: 4,
    react: '✅',
    description: 'View items available for trade in the eshop',
    async execute(client, arg, M) {
    const mode = await client.event.get(`EVENTS`);

if (mode === 'OFF') {
    return M.reply('🟥Our estore is currently closed!');
}
        let text = '🧧 *EVENT SHOP* 🧧';
        text += '\n\n';
        items.buy.forEach((item, index) => {
            text += `${index + 1}) *Name:* ${item.name}\n💰 *price:* ${item.price}\n🎴 *Usage:* ${item.usage}\n`;
        });
        text += `\n🎴 Use ${client.prefix}eclaim <item_name> to use`;
        text += `\nFor vieweing the particular cards and backgrounds use :ebg or :ecards`;
        M.reply(text);
    },
};
