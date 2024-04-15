const { bots } = require('../Handlers/Mods');

module.exports = {
    name: 'switch',
    aliases: ['switch'],
    category: 'dev',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Switches the bot',
    async execute(client, arg, M) {
        const requestedMode = arg ? arg.toLowerCase().trim() : 'none';
        
        if (requestedMode === 'none') {
            await client.DB.set(`activeBot`, 'none');
            return M.reply('🟥 All bots are turned off');
        } else if (requestedMode === 'all') {
            await client.DB.set(`activeBot`, 'all');
            return M.reply('⬜ All bots have been activated.');
        } else {
            const botNames = bots().map(bot => bot.name.toLowerCase());
            if (!botNames.includes(requestedMode)) {
                return M.reply(`No bot named '${requestedMode}' found.`);
            }
            await client.DB.set(`activeBot`, requestedMode);
            return M.reply(`🟩 '${requestedMode}' has been activated.`);
        }
    }
};
