module.exports = {
    name: 'activate',
    aliases: ['act'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Activate certain features on group-chats',
    async execute(client, arg, M) {
        
        const toggleableGroupActions = ['mod', 'events', 'invitelink', 'chatbot', 'nsfw'];
        if (!arg || !toggleableGroupActions.includes(arg.trim())) {
            return M.reply(
                `Please provide a valid toggleable GroupAction.\n\n*Available:* \n${toggleableGroupActions.join('\n')}`
            );
        }

        const Actives = (await client.DB.get(arg)) || [];
        if (Actives.includes(M.from)) {
            return M.reply(`${client.utils.capitalize(arg)} is already activated in your group`);
        }

        await client.DB.push(arg, M.from);
        M.reply(`Successfully activated ${client.utils.capitalize(arg)} in your group`);
    }
};
