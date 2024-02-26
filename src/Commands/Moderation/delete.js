module.exports = {
    name: 'delete',
    aliases: ['del'],
    category: 'moderation',
    exp: 5,
    react: "✅",
    description: 'Deletes the quoted message',
    async execute(client, arg, M) {
        if (!M.quoted) return M.reply('Quote the message that you want me to delete, Baka!')
        await client.sendMessage(M.from, {
            delete: M.quoted.key
        })
    }
}
