const ms = require('parse-ms');

module.exports = {
    name: 'delete',
    aliases: ['del'],
    category: 'moderation',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Deletes the quoted message',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.delete`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        if (!M.quoted) return M.reply('Quote the message that you want me to delete, Baka!')
        try {
            await client.deleteMessage(M.from, M.quoted.id)
            M.reply('Message deleted successfully!')
            await client.DB.set(`${M.sender}.delete`, Date.now());
        } catch (error) {
            console.error('Error deleting message:', error)
            M.reply('Failed to delete message.')
        }
    }
}
