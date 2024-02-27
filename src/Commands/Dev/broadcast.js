module.exports = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Will make a broadcast for groups where the bot is in. Can be used to make announcements',
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
                return M.reply('🚫 Oops! It seems like you forgot to provide a query for the broadcast. Please enter a message or query to proceed.');
            }

            const groups = await client.getChats();

            const groupPromises = groups.filter(chat => chat.isGroup).map(async chat => {
                try {
                    const groupMetadata = await client.groupMetadata(chat.id);
                    const groupMembers = groupMetadata.participants.map(participant => participant.id);
                    const text = `🔰*「 ${client.name.toUpperCase()} BROADCAST 」*🔰\n\n🏮 Message: ${arg}\n\n🌺 *Regards:* @${M.sender.split("@")[0]} by AURORA`;

                    await client.sendMessage(chat.id, {
                        image: {
                            url: 'https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg'
                        },
                        mentions: groupMembers,
                        caption: `${text}`,
                    });

                    return chat.id;
                } catch (error) {
                    console.error(`Error broadcasting to group ${chat.id}: ${error}`);
                    return null;
                }
            });

            const groupIds = (await Promise.all(groupPromises)).filter(id => id !== null);
            const successMessage = `✅ Broadcast Message sent to *${groupIds.length} groups*.`;

            M.reply(successMessage);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    }
};