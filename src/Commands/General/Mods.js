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
        mo += `\n#${i + 1}\n*Contact:* ${hmm}\n`; // Displaying the number directly
    }

    M.reply(mo);
  }
}
