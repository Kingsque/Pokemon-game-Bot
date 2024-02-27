module.exports = {
    name: 'ban',
    aliases: ['ban'],
    exp: 0,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Manage bans for users. eg ban --true @user or ban --false @user',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            if (!arg || arg.length < 2) {
                return M.reply('You must specify an action (--true or --false) and mention the user.');
            }
            
            const action = arg.shift().toLowerCase();
            const user = M.mentions[0] || M.quoted?.participant;
            
            if (!user) {
                return M.reply('You must tag the user before using!');
            }
            
            const bannedUsers = await client.DB.get('banned') || [];
            
            if (action === '--true') {
                if (!bannedUsers.includes(user)) {
                    await client.DB.push('banned', user);
                    await client.sendMessage(
                        M.from,
                        { text: `*@${user.split('@')[0]}* is now banned from using commands`, mentions: [user] },
                        { quoted: M }
                    );
                } else {
                    await client.sendMessage(
                        M.from,
                        { text: `*@${user.split('@')[0]}* is already banned`, mentions: [user] },
                        { quoted: M }
                    );
                }
            } else if (action === '--false') {
                if (bannedUsers.includes(user)) {
                    await client.DB.pull('banned', user);
                    await client.sendMessage(
                        M.from,
                        { text: `*@${user.split('@')[0]}* is now unbanned`, mentions: [user] },
                        { quoted: M }
                    );
                } else {
                    await client.sendMessage(
                        M.from,
                        { text: `*@${user.split('@')[0]}* is not banned`, mentions: [user] },
                        { quoted: M }
                    );
                }
            } else {
                return M.reply('Invalid action. Please specify either "--true" or "--false".');
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(
                M.from,
                { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` }
            );
        }
    }
};