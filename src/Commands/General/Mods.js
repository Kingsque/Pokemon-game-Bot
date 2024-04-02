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
      let hmm = mods[i];
      const um = (await client.contact.getContact(hmm, client)).username;
      mo += `\n#${i + 1})*Name: ${um}\nContact:* http://wa.me/+${mods[i]}\n`;
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
