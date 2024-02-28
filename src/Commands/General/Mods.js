const ms = require('parse-ms');

module.exports = {
  name: 'mods',
  aliases: ['mod'],
  category: 'general',
  exp: 0,
  cool: 4,
  react: "✅",
  description: 'Get information about bot moderators',
  async execute(client, arg, M) {
    try {
      const commandName = this.name || this.aliases[0];
      const disabledCommands = await client.DB.get(`disabledCommands`);
      const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
      
      if (isDisabled) {
        const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
        return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
      }

      let mods = client.mods;
      let mo = "*Aurora MODS*\n";

      for (let i = 0; i < mods.length; i++) {
        let contact = await client.getContact(mods[i]);
        if (contact) {
          const um = contact.username;
          mo += `\n#${i + 1}\n*Contact:* @${um}\n`;
        }
      }

      M.reply(mo);
    } catch (error) {
      console.error('Error executing mods command:', error);
      M.reply('An error occurred while executing the command. Please try again later.');
    }
  }
}