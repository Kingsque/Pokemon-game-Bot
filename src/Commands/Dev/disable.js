module.exports = {
    name: 'disable',
    aliases: ['d'],
    exp: 0,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Disables a certain command.',
    async execute(client, arg, M) {
        try {
            if (!arg) {
                return M.reply('You need to provide the name of the command to disable.');
            }

            const commandName = arg.shift().toLowerCase(); // Extract the command name and ensure case insensitivity
            const disabledCommands = await client.DB.get('disable-commands') || [];

            if (disabledCommands.some(disabledCmd => disabledCmd.command === commandName)) {
                return M.reply('This command is already disabled.');
            }

            // Check if the command to disable exists
            if (!client.cmd.has(commandName)) {
                return M.reply('That command does not exist.');
            }

            // Store the reason, time, and user who disabled the command
            const reason = arg.join(" "); // Join the remaining arguments as reason
            const disabledCommandInfo = {
                command: commandName,
                reason: reason,
                disabledAt: new Date().toISOString(),
                disabledBy: M.sender
            };

            await client.DB.push('disable-commands', disabledCommandInfo);
            M.reply(`Command "${commandName}" has been disabled successfully by ${M.pushName}.`);
        } catch (error) {
            console.error('Error in disabling command:', error);
            M.reply('An error occurred while disabling the command.');
        }
    }
}
