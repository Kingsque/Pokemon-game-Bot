module.exports = {
    name: 'noticeboard',
    aliases: ['notice', 'nb'],
    category: 'general',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'This is notice board here norices of the bot is pasted.',
    async execute(client, arg, M) {
          const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

      const notice = await client.DB.get('notice');
      const notic = await client.DB.get('notic');
      const noti = await client.DB.get('noti');
      const not = await client.DB.get('not');
      const no = await client.DB.get('no');
      const n = await client.DB.get('n');
  
      let text = `📛NOTICEBOARD📛\n\n1) ${notice}\n\n2) ${notic}\n\n3) ${noti}\n\n4) ${not}\n\n5) ${no}\n\n6) ${n}.\n\n`;
  
      await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
        }
  }