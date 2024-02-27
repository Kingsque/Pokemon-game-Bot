module.exports = {
    name: 'pm',
    aliases: ['promod'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Promotes the tagged user',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            if (!M.mentions || M.mentions.length === 0) {
                return M.reply('You must tag the user to promote them.');
            }

            const groupMetadata = await client.groupMetadata(M.from);
            const groupMembers = groupMetadata?.participants || [];
            const groupAdmins = groupMembers.filter((participant) => participant.isAdmin).map((participant) => participant.id);

            const usersToPromote = M.mentions.filter((user) => !groupAdmins.includes(user));

            if (usersToPromote.length === 0) {
                return M.reply('All mentioned users are already admins.');
            }

            await client.groupParticipantsUpdate(M.from, usersToPromote, 'promote');

            M.reply(`Successfully promoted ${usersToPromote.length} user(s) to admin.`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    }
};