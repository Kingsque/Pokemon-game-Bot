const ms = require('parse-ms');

module.exports = {
  name: 'lyrics',
  aliases: ['lyr'],
  category: 'media',
  exp: 5,
  cool: 4,
  react: "✅",
  description: 'Sends the lyrics of a given song',
  async execute(client, flag, arg, M) {
    const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.lyrics`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
    if (!arg) return M.reply('🟥 *Provide the name of the song to search the lyrics*');

    const term = arg.trim();
    
    try {
      // Fetching data from the API
      const data = await client.utils.fetch(`https://weeb-api.vercel.app/genius?query=${encodeURIComponent(term)}`);
      
      if (!data || !data.length) return M.reply(`🟨 *Couldn't find any lyrics* | "${term}"`);
      
      // Extracting necessary information
      const songData = data[0];
      const { title, fullTitle, artist, image, url } = songData;

      // Fetching lyrics
      const lyrics = await client.utils.fetch(`https://weeb-api.vercel.app/lyrics?url=${url}`);

      // Constructing the caption
      let caption = `🎊 *Title:* ${title} *(${fullTitle})*\n🖋️ *Artist:* ${artist}\n\n${lyrics}`;
      
      // Sending the lyrics with the image (if available)
      if (image) {
        const imageBuffer = await client.utils.getBuffer(image);
        await client.sendMessage(M.from, { image: imageBuffer, caption }, { quoted: M });
      } else {
        await client.sendMessage(M.from, caption, { quoted: M });
      }
      await client.DB.set(`${M.sender}.lyrics`, Date.now());
    } catch (error) {
      console.error(error);
      M.reply('🟥 *An error occurred while fetching lyrics.*');
    }
  }
};