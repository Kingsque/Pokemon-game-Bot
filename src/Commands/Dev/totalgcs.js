module.exports = {
    name: 'totalgroup',
    aliases: ['tg'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Get information about all groups with their name, members, and gclink',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        
        const getGroups = await client.groupFetchAllParticipating();
        const groups = Object.values(getGroups);
        
        const groupInfo = groups.map(group => {
            return {
                name: group.name,
                members: group.members.length,
                gclink: group.gclink
            };
        });

        let response = `*List of Groups:*\n`;
        groupInfo.forEach((group, index) => {
            response += `\n*Group ${index + 1}:*\nName: ${group.name}\nMembers: ${group.members}\nGclink: ${group.gclink}\n`;
        });

        M.reply(response);
    }
};