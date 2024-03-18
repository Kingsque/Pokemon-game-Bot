const items = {
  buy: [
    { iron: 1000 },
    { gold: 3750 },
    { wood: 300 },
    { diamond: 6150 },
    { luckption: 12000 },
    { woodpickaxe: 10000 },
    { ironpickaxe: 30000 },
    { goldpickaxe: 50000 },
    { diamondpickaxe: 70000 },
    { emeraldpickaxe: 100000 },
  ],
  sell: [
    { iron: 800 },
    { gold: 1750 },
    { wood: 300 },
    { diamond: 3150 },
    { emerald: 4050 },
  ],
};

module.exports = {
  name: 'shop',
  aliases: ['sell', 'buy'],
  category: 'rpg',
  exp: 10,
  cool: 4,
  react: '✅',
  description: 'Buy or Sell any thing here',
  async execute(client, arg, M) {
    const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim();
    if (command === 'shop') {
      const typeEmoji = ['💰', '⚖️'];
      const moneyEmoji = ['🪙', '💵'];
      const types = Object.keys(items);
      let text = '======👔*SHOP*👔======';
      for (const type of types) {
        text += `\n\n*${typeEmoji[types.indexOf(type)]} ${client.utils.capitalize(type)}*\n`;
        items[type].forEach((item) => {
          const [itemName, price] = Object.entries(item)[0];
          text += `\n> *${client.utils.capitalize(itemName)}:* ${price} ${moneyEmoji[types.indexOf(type)]}`;
        });
      }
      text += `\n\n🎴 Use ${client.prefix}buy <item_name> / ${client.prefix}sell <item_name>\n📗 Example: ${client.prefix}buy potion/ ${client.prefix}sell potion`;
      M.reply(text);
    } else if (command === 'buy' || command === 'sell') {
      if (!arg) return M.reply('Please give an item name');
      const term = arg.split(' ');
      const actionItems = Object.keys(Object.assign({}, ...items[command]));
      const itemName = term[0].toLowerCase();
      if (!actionItems.includes(itemName)) return M.reply('Please give a valid item name');
      const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
      const price = parseInt(Object.values(items[command][actionItems.indexOf(itemName)]));
      const quantity = parseInt(term[1]) || 1;
      
      if (command === 'buy') {
        if ((credits - price * quantity) < 0) return M.reply(`You don't have enough in your wallet to buy ${itemName}`);
        await client.rpg.add(`${M.sender}.${itemName}`, quantity);
        await client.credit.sub(`${M.sender}.wallet`, price * quantity);
        M.reply(`*Thank you 🎉 for your purchase*\n*Now you have _${client.utils.capitalize(itemName)}: ${(await client.rpg.get(`${M.sender}.${itemName}`)) || 0}_*`);
      } else {
        const itemQuantity = await client.rpg.get(`${M.sender}.${itemName}`);
        if (!itemQuantity || itemQuantity < quantity) return M.reply('You do not have enough quantity to sell');
        await client.rpg.sub(`${M.sender}.${itemName}`, quantity);
        await client.credits.add(`${M.sender}.wallet`, price * quantity);
        M.reply(`*Congratulations 🎉 you have gained ${price * quantity} by selling ${quantity} ${client.utils.capitalize(itemName)}*\n*Now you have _${await client.credits.get(`${M.sender}.wallet`)}_ in your wallet*`);
      }
    }
  },
};