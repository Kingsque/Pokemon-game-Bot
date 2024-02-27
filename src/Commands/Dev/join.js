module.exports = {
    name: 'join',
    aliases: ['j'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Join a group using the link. eg group join (gclink)',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            const link = arg;

            if (!link || !link.includes('https://chat.whatsapp.com/')) {
                return M.reply('🚫 Oops! The provided link is not a valid group link.');
            }

            const joinCode = link.split('https://chat.whatsapp.com/')[1];

            client.groupAcceptInvite(joinCode)
                .then(() => M.reply('✅ Successfully joined the group!'))
                .catch(() => M.reply('🚫 Something went wrong while joining the group. Please check the link.'));
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    }
};
