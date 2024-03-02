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

            const commandName = arg.toLowerCase(); // Ensure case insensitivity
            const disabled = await client.DB.get('disable-commands') || [];

            if (disabled.includes(commandName)) {
                return M.reply('This command is already disabled.');
            }

            // Check if the command to disable exists
            if (!client.cmd.has(commandName)) {
                return M.reply('That command does not exist.');
            }

            await client.DB.push('disable-commands', commandName);
            M.reply(`Command "${commandName}" has been disabled successfully.`);
        } catch (error) {
            console.error('Error in disabling command:', error);
            M.reply('An error occurred while disabling the command.');
        }
    }
}
