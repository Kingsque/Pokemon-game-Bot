const ms = require('parse-ms');

module.exports = {
    name: 'script',
    aliases: ['repo'],
    category: 'general',
    exp: 15,
    react: "✅",
    description: 'This is noteboard, guide and rules board. You can check here about updates, about guide or about rules.',
    async execute(client, arg, M) {
    
      const commandName = this.name.toLowerCase();
      const now = Date.now(); // Get current timestamp
      const cooldownSeconds = this.cool;
      const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
    
      if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
          const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
          return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
      }
      const result = await client.utils.fetch('https://api.github.com/repos/Kingshisui00/AURORA-private');
      const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

      let caption = ''
      caption += `✨ *${result.name}* ✨\n\n`;
      caption += `🌐 *Visibility: ${result.visibility}*\n`;
      caption += `💠 *Language: ${result.language}*\n`;
      caption += `✍🏻 *Author: ${result.owner.login}*\n`;
      caption += `⭐ *Star's: ${result.stargazers_count}*\n`;
      caption += `🍴 *Forks: ${result.forks_count}*\n`;
      caption += `⚠️ *Issues: ${result.open_issues_count}*\n`;
      caption += `*🛡️License: ${result.license.name}*\n`; // Fix typo here
      caption += `⚙️ *Repo Link: comming soon[aurora public]*\n\n`; // Fix typo here
      caption += `Contacts`
      caption += `website= https://kingshisui00.github.io/web-aurora/`  
      caption += `ʏᴏᴜᴛᴜʙᴇ =`  
      caption += `ɢᴍᴀɪʟ = `

      
      await client.sendMessage(M.from, { image: { url: image }, caption: caption }, { quoted: M });
      await client.DB.set(`${M.sender}.script`, Date.now());
    }
}
