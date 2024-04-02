module.exports = {
  name: 'mods',
  aliases: ['mod'],
  category: 'general',
  exp: 0,
  cool: 5,
  react: "✅",
  usage: 'Use :mods',
  description: 'Get information about moderators',
  async execute(client, arg, M) {
    let mods = client.mods;
    let mo = "*Aurora MODS*\n";
    
    for (let i = 0; i < mods.length; i++) {
      const contact = await client.contact.getContact(mods[i], client);
      const username = contact && contact.username ? contact.username : 'MOD';
    
      mo += `\n#${i + 1}) *Name:* ${username}\n*Contact:* http://wa.me/+${mods[i]}\n*Tag: @${mods[i].split('@')[0]}\n`;
    }
    await client.sendMessage(
      M.from,
      {
        image: { url: "https://i.ibb.co/tPhb428/Aurora.jpg" },
        caption: mo // Use mo as the caption
      },
      {
        quoted: M
      }
    );
  }
};
