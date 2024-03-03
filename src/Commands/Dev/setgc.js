module.exports = {
    name: 'set-gc',
    aliases: ['set-group'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Activate certain features on group-chats',
    async execute(client, arg, M) {
        const toggleableGroupActions = ['auction','cshop','economy','game','card-game']
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