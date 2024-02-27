module.exports = {
    name: 'restart',
    aliases: ['relife'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Restarts the bot',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            await M.reply('Restarting...');
            await client.utils.restart();
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`}, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`});
        }
    }
};