module.exports = {
    name: 'enable',
    aliases: ['e'],
    exp: 0,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Enables a previously disabled command.',
    async execute(client, arg, M) {
        try {
            if (!arg) {
                return M.reply('You need to provide the name of the command to enable.');
            }

            const commandName = arg.toLowerCase(); // Ensure case insensitivity
            const disabledCommands = await client.DB.get('disable-commands') || [];

            if (!disabledCommands.some(disabledCmd => disabledCmd.command === commandName)) {
                return M.reply('This command is not disabled.');
            }


            await client.DB.pull('disable-commands', disabledCommands.filter(disabledCmd => disabledCmd.command === commandName));
            M.reply(`Command "${commandName}" has been enabled successfully.`);
        } catch (error) {
            console.error('Error in enabling command:', error);
            M.reply('An error occurred while enabling the command.');
        }
    }
}
