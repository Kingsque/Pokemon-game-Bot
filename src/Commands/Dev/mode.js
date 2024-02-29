module.exports = {
    name: 'mode',
    aliases: ['mode'],
    category: 'dev',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Change the mode of the bot (self, private, public)',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const validModes = ['self', 'private', 'public'];
        const requestedMode = arg.toLowerCase().trim();
        
        if (!validModes.includes(requestedMode)) {
            return M.reply("Invalid mode! Please choose either 'self', 'private', or 'public'.");
        }

        const mode = await client.DB.get(`mode`);

        if (requestedMode === 'self') {
            if (mode === 'self') {
                return M.reply('The mode is already self');
            }
            await client.DB.set(`mode`, 'self');
            return M.reply('Now only host of this bot can use command');
        } else if (requestedMode === 'private') {
            if (mode === 'private') {
                return M.reply('The mode is already private');
            }
            await client.DB.set(`mode`, 'private');
            return M.reply('Now only mods of this bot can use command');
        } else if (requestedMode === 'public') {
            if (mode === 'public') {
                return M.reply('The mode is already public');
            }
            await client.DB.set(`mode`, 'public');
            return M.reply('Now everyone on this this bot can use command');
        }
    }
};
