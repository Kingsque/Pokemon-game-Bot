module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    category: 'rpg',
    exp: 7,
    cool: 4,
    react: "✅",
    description: 'Gives you details about your inventory',
    async execute(client, arg, M) {

        const inventory = await client.rpg.get(M.sender)
        if (!inventory) return M.reply('You have no inventory')

        let text = '===🗻 *INVENTORY* 🗻===\n\n'
        for (const [key, value] of Object.entries(inventory)) {
            text += `> *${key}:* ${typeof value === 'number' ? value : JSON.stringify(value, null, 2)}\n`
        }
        M.reply(text)
    }
}