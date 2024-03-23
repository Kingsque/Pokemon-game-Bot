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
