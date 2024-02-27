module.exports = {
    name: 'groups',
    aliases: ['g'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Join or leave a group using the link.eg group join (gclink) or group leave',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            if (!arg) {
                return M.reply('🚫 Oops! It seems like you forgot to provide a query. Please provide either "join" or "leave" and a group link to proceed.');
            }

            const [action, link] = arg.split(' ');

            if (!action || !link) {
                return M.reply('🚫 Oops! It seems like you provided an incomplete query. Please provide both "join" or "leave" and a group link to proceed.');
            }

            if (action === 'join') {
                if (!link.includes('https://chat.whatsapp.com/')) {
                    return M.reply('🚫 Oops! The provided link is not a valid group link.');
                }

                const joinCode = link.split('https://chat.whatsapp.com/')[1];

                client.groupAcceptInvite(joinCode)
                    .then(() => M.reply('✅ Successfully joined the group!'))
                    .catch(() => M.reply('🚫 Something went wrong while joining the group. Please check the link.'));
            } else if (action === 'leave') {
                client.groupLeave(M.from)
                    .then(() => M.reply('✅ Successfully left the group!'))
                    .catch(() => M.reply('🚫 Something went wrong while leaving the group.'));
            } else {
                return M.reply('🚫 Invalid action. Please provide either "join" or "leave".');
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    }
};