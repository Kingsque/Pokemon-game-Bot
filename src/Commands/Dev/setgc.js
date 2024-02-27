module.exports = {
    name: 'set-gc',
    aliases: ['set-group'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Activate certain features on group-chats',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const toggleableGroupActions = ['auction','cshop','economy','game','mod','support','card-game']
        if (!arg)
            return M.reply(
                `Please provide a valid toggleable GroupActions\n\n*Available:* \n${toggleableGroupActions.join('\n')}`
            )
        if (!toggleableGroupActions.includes(arg.trim()))
            return M.reply(
                `Please provide a valid toggleable GroupActions\n\n*Available:* \n${toggleableGroupActions.join('\n')}`
            )
        const Actives = (await client.DB.get(arg)) || []
        if (Actives.includes(M.from))
            return M.reply(`${client.utils.capitalize(arg)} is already activate in your group`)
        await client.DB.push(arg, M.from)
        M.reply(`Success activating ${client.utils.capitalize(arg)} in your group`)
    }
}