module.exports = {
    name: 'toggle',
    aliases: ['toggle'],
    category: 'dev',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'toggle the condition of command in the bot',
    async execute(client, arg, M, action) {
      const splitArgs = arg.split("|");
      if (splitArgs.length !== 2) {
        return M.reply("Please provide both the command name and action (enable/disable).eg toggle commandname | reason | disable or toggle commandname | reason | disabale or toggle commandname |");
      }
      const [commandName, reason] = splitArgs.map((arg) => arg.trim());
      
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) {
        return M.reply(`There is no command with name or alias '${commandName}'`);
      } 
      
      const disabledCommands = await client.DB.get(`disabledCommands`);
      const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
  
      if (action === "disable" && !isDisabled) {
        await client.DB.push(`disabledCommands`, { name: commandName, reason: reason });
        return M.reply(`Command '${commandName}' is disabled for '${reason}'.`);
      } else if (action === "enable" && isDisabled) {
        await client.DB.pull(`disabledCommands`, { name: commandName });
        return M.reply(`Command '${commandName}' is enabled now.`);
      } else {
        return M.reply(`Command '${commandName}' is already ${isDisabled ? 'disabled' : 'enabled'}.`);
      }
    }
  };