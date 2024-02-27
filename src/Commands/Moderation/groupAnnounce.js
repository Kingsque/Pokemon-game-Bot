const ms = require('parse-ms');

module.exports = {
    name: 'group',
    aliases: ['gc'],
    exp: 5,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Closes or opens the group',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.gc`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        const group = ['open', 'close']
        await client.DB.set(`${M.sender}.gc`, Date.now());
        if (!arg) return M.reply('Sorry, you did not specify any term!')
        if (!group.includes(arg)) return M.reply('Sorry, you did not specify a valid term!')
        const groupMetadata = await client.groupMetadata(M.from)
        switch (arg) {
            case 'open':
                if (!groupMetadata.announce) return M.reply('The group is already open!')
                await client.groupSettingUpdate(M.from, 'not_announcement')
                return M.reply('Group opened')
            case 'close':
                if (groupMetadata.announce) return M.reply('The group is already closed!')
                await client.groupSettingUpdate(M.from, 'announcement')
                return M.reply('Group closed')
        }
    }
}
