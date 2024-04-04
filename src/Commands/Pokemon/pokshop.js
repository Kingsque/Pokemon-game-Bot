const items = {
    buy: [
        { name: 'Pokeball', price: 1200, usage: 'Used for catching wild spawned pokemons.' }
    ]
};

module.exports = {
    name: 'pokestore',
    aliases: ['pokeshop'],
    category: 'pokemon',
    exp: 10,
    cool: 4,
    react: '✅',
    usage: 'Use :pokestore',
    description: 'View items available for purchase in the pokeshop',
    async execute(client, arg, M) {
        let text = '*❯─『 SHOP 』─❮*';
        text += '\n\n';
        items.buy.forEach((item, index) => {
            text += `${index + 1}) *Name:* ${item.name}\n💰 *price:* ${item.price}\n🎴 *Usage:* ${item.usage}\n`;
        });
        text += `\n🎴 Use ${client.prefix}purchase <item_name>`;
        text += `\n📗 Example: ${client.prefix}buy pokeballs`;
        M.reply(text);
    },
};
