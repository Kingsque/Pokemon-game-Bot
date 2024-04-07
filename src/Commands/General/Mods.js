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
    let taggedMods = [];
    
    for (let i = 0; i < mods.length; i++) {
      const contact = await client.contact.getContact(mods[i], client);
      const pushname = contact && contact.pushname ? contact.pushname : 'MOD';
      taggedMods.push(pushname);
      mo += `\n#${i + 1}) *Name:* ${pushname}\n*Contact:* http://wa.me/+${mods[i]}\n`;
    }
    
    await client.sendMessage(
      M.from,
      {
        image: { url: "https://i.ibb.co/tPhb428/Aurora.jpg" },
        caption: mo + "\n\n*Tagged Mods:* " + taggedMods.join(", ") // Use mo as the caption
      },
      {
        quoted: M,
        mentions: taggedMods.map(mod => ({ tag: mod, id: mods[taggedMods.indexOf(mod)] }))
      }
    );
  }
};
