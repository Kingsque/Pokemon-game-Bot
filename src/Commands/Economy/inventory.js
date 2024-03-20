module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    category: 'economy',
    exp: 7,
    cool: 4,
    react: "✅",
    description: 'Gives you details about your inventory',
    async execute(client, arg, M) {

        const pepper = await client.rpg.get(`M.sender.
        const inventory = await client.rpg.get(M.sender)
        if (!inventory) return M.reply('You have no inventory')

        let text = '===🗻 *INVENTORY* 🗻===\n\n'
         
        }
        M.reply(text)
    }
}
