module.exports = {
  name: 'mods',
  aliases: ['mods'],
  category: 'general',
  exp: 0,
  cool: 5,
  react: "✅",
  usage: 'Use :mods',
  description: 'Get information about moderators',
  async execute(client, arg, M) {
    let mods = client.mods || []; // Ensure mods array exists
    let mo = "*Aurora MODS*\n";
    
    for (let i = 0; i < mods.length; i++) {
      const contact = await client.contact.getContact(mods[i]); // Change contact.getContact to client.getContact
      const username = contact && contact.name ? contact.name : 'MOD'; // Use contact.name for username
      const tag = contact && contact.username ? `@${contact.username.split('@')[0]}` : `@MOD`; // Use contact.username for tag
    
      mo += `\n#${i + 1}) *Name:* ${username}\n*Contact:* http://wa.me/${mods[i]}\n*Tag:* ${tag}\n`; // Change the URL format
    }
    await client.sendMessage(
      M.from,
      {
        image: { url: "https://i.ibb.co/tPhb428/Aurora.jpg" },
        caption: mo
       },
      {
        quoted: M
      }
    );
  }
};
