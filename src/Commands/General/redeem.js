const path = require('path');

module.exports = {
  name: 'redeem',
  aliases: ['redeem'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'general',
  description: 'Redeem voucher or discount codes from bot',
  async execute(client, arg, M) {
    const filePath = path.join(__dirname, '../../Helpers/Codes.json');
    const data = require(filePath);
    
    const used = await client.DB.get(`codes`) || [];
    if (used.includes(arg)) return M.reply('This code was a single-use code and it is already used');

    const uses =  await client.DB.push(`${M.sender}.codes`) || [];
     if (uses.includes(arg)) return M.reply('You can only use a code once where its single or multi use and it is already used');

    const codeData = data.find((code) => code.code === arg);
    if (!codeData) return M.reply('This is not a valid code.');

    const name = codeData.name;
    const type = codeData.type;
    const item = codeData.item;
    const use = codeData.save;

    if (type === 'credit') {
      await client.credit.add(`${M.sender}.wallet`, item);
      await client.DB.push(`${M.sender}.codes`, arg);
    } else if (type === 'card') {
      await client.DB.push(`${M.sender}_Deck`, item);
       await client.DB.push(`${M.sender}.codes`, arg)
    } else if (type === 'bg') {
      await client.bg.push(`${M.sender}_BG`, item);
       await client.DB.push(`${M.sender}.codes`, arg)
    } else if (type === 'event') {
      await client.event.add(`${M.sender}.ewallet`, item);
       await client.DB.push(`${M.sender}.codes`, arg)
    }

    if (use === 'Yes') {
      await client.DB.push(`codes`, arg);
    }

    M.reply(`🎊*Congratulations! You have successfully claimed the code*\n♦️*Name:* ${name}\n🧧 *Type:* ${type}\n🎴 *Item:* ${item}\n📛 *Single Use:* ${use}\nTry to work hard to achieve more`);
  }
};
