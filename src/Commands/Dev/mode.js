module.exports = {
    name: 'mode',
    aliases: ['mode'],
    category: 'dev',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Change the mode of the bot (self, private, public)',
    async execute(client, arg, M) {
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
            return M.reply('Now only the host of this bot can use commands');
        } else if (requestedMode === 'private') {
            if (mode === 'private') {
                return M.reply('The mode is already private');
            }
            await client.DB.set(`mode`, 'private');
            return M.reply('Now only mods of this bot can use commands');
        } else if (requestedMode === 'public') {
            if (mode === 'public') {
                return M.reply('The mode is already public');
            }
            await client.DB.set(`mode`, 'public');
            return M.reply('Now everyone on this bot can use commands');
        }
    }
};
