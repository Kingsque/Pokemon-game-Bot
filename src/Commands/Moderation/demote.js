const ms = require('parse-ms');

module.exports = {
    name: 'demote',
    aliases: ['demo'],
    exp: 5,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Demotes the tagged user',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.demote`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        let nonAdminUsers = M.mentions.filter((user) => !groupAdmins.includes(user))
        await client.groupParticipantsUpdate(M.from, nonAdminUsers, 'demote').then((res) => {
            M.reply(`Done! Demoting ${nonAdminUsers.length} users`)
        })
        await client.DB.set(`${M.sender}.demote`, Date.now());
    }
}
