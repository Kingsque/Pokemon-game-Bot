const ms = require('parse-ms');

module.exports = {
    name: 'script',
    aliases: ['repo'],
    category: 'general',
    exp: 15,
    react: "✅",
    description: 'This is noteboard, guide and rules board. You can check here about updates, about guide or about rules.',
    async execute(client, arg, M) {
      const commandName = this.name || this.aliases[0];
      const disabledCommands = await client.DB.get(`disabledCommands`);
      const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
  
      if (isDisabled) {
        const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
        return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
      }
      const cooldownMs = this.cool * 1000;
      const lastSlot = await client.DB.get(`${M.sender}.script`);

      if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
          const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
          return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
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
      caption += `ᴛᴇʟᴇɢʀᴀᴍ = `
      caption += `discord = `
      caption += `whatsapp = `
      caption += `website= `  
      caption += `ʏᴏᴜᴛᴜʙᴇ =`  
      caption += `ᴍᴀɪɴ ᴡᴇʙ = `
      caption += `ɢᴍᴀɪʟ = `
      caption += `instagram = `

      
      await client.sendMessage(M.from, { image: { url: image }, caption: caption }, { quoted: M });
      await client.DB.set(`${M.sender}.script`, Date.now());
    }
}