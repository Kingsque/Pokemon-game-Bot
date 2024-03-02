const ms = require('parse-ms');

module.exports = {
    name: 'revoke',
    aliases: ['reset'],
    exp: 10,
    react: "✅",
    category: 'moderation',
    description: 'Resets the group link',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.revoke`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        await client.groupRevokeInvite(M.from).then((res) => {
            M.reply(`Done! Group link has been reset`)
        })
        await client.DB.set(`${M.sender}.revoke`, Date.now());
    }
}
