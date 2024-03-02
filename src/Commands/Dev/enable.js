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
            const disabled = await client.DB.get('disable-commands') || [];

            if (!disabled.includes(commandName)) {
                return M.reply('This command is not disabled.');
            }

            // Check if the command to enable exists
            if (!client.cmd.has(commandName)) {
                return M.reply('That command does not exist.');
            }

            await client.DB.pull('disable-commands', commandName);
            M.reply(`Command "${commandName}" has been enabled successfully.`);
        } catch (error) {
            console.error('Error in enabling command:', error);
            M.reply('An error occurred while enabling the command.');
        }
    }
}
