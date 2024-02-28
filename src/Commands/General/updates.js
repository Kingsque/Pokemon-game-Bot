const ms = require('parse-ms');

module.exports = {
    name: 'update',
    aliases: ['updates'],
    category: 'general',
    exp: 15,
    cool: 4,
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
      const lastSlot = await client.DB.get(`${M.sender}.updates`);

      if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
          const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
          return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
      }

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
      await client.DB.set(`${M.sender}.support`, Date.now());
    }
  }  