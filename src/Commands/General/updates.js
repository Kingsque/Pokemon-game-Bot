module.exports = {
    name: 'update',
    aliases: ['updates'],
    category: 'general',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'This is noteboard, guide and rules board. You can check here about updates, about guide or about rules.',
    async execute(client, arg, M) {

      const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

      const update1 = await client.DB.get('up');
      const update2 = await client.DB.get('upd');
      const update3 = await client.DB.get('upda');
      
      let text = ''
      text += `⭐ *LATEST UPDATES* ⭐\n\n`;
      text += `${update1}\n`;
      text += `${update2}\n`;
      text += `${update3}\n`;

      await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
    }
  }  