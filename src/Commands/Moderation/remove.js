const ms = require('parse-ms');

module.exports = {
    name: 'remove',
    aliases: ['rem'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Removes the tagged user',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.remove`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        if (!M.mentions.length) return M.reply('You must tag the user before using!')

        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.isAdmin).map((v) => v.id)

        const usersToRemove = M.mentions.filter((user) => !groupAdmins.includes(user))
        if (usersToRemove.length === 0) {
            return M.reply('Cannot remove admin(s).')
        }

        await client.groupParticipantsUpdate(M.from, usersToRemove, 'remove').then((res) => {
            M.reply(`Done! Removing ${usersToRemove.length} users`)
        })
        await client.DB.set(`${M.sender}.remove`, Date.now());
    }
}
