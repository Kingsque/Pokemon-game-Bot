const ms = require('parse-ms');

module.exports = {
    name: 'noticeboard',
    aliases: ['notice', 'nb'],
    category: 'general',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'This is notice board here norices of the bot is pasted.',
    async execute(client, arg, M) {
      const commandName = this.name || this.aliases[0];
          const disabledCommands = await client.DB.get(`disabledCommands`);
          const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
          
          if (isDisabled) {
              const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
              return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
          } 
          const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.nb`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

          const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

      const notice = await client.DB.get('notice');
      const notic = await client.DB.get('notic');
      const noti = await client.DB.get('noti');
      const not = await client.DB.get('not');
      const no = await client.DB.get('no');
      const n = await client.DB.get('n');
  
      let text = `📛NOTICEBOARD📛\n\n1) ${notice}\n\n2) ${notic}\n\n3) ${noti}\n\n4) ${not}\n\n5) ${no}\n\n6) ${n}.\n\n`;
  
      await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
      await client.DB.set(`${M.sender}.nb`, Date.now());
        }
  }