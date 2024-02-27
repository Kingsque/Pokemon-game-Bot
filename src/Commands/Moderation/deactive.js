const ms = require('parse-ms');

module.exports = {
    name: 'deactivate',
    aliases: ['deact'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Deactivate certain features on group-chats',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.deact`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        const toggleableGroupActions = ['mod', 'events', 'cardgame', 'invitelink', 'economy', 'chatbot', 'nsfw', 'card-game', 'auction', 'cshop', 'game', 'support'];
        if (!arg || !toggleableGroupActions.includes(arg.trim())) {
            return M.reply(
                `Please provide a valid toggleable GroupAction.\n\n*Available:* \n${toggleableGroupActions.join('\n')}`
            );
        }

        const Actives = (await client.DB.get(arg)) || [];
        if (!Actives.includes(M.from)) {
            return M.reply(`${client.utils.capitalize(arg)} is already deactivated in your group`);
        }

        await client.DB.pull(arg, M.from);
        M.reply(`Successfully deactivated ${client.utils.capitalize(arg)} in your group`);
        await client.DB.set(`${M.sender}.deact`, Date.now());
    }
};
