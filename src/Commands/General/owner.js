module.exports = {
    name: 'owner',
    aliases: ['own'],
    category: 'general',
    react: "📢",
    description: 'Get information bot information',
    async execute(client, arg, M) {
        let number = '919529426293@s.whatsapp.net'
        const owner = number
        let text = `Only @${owner.split('@')[0]} owned this bot { ${client.name} }!`
        await client.sendMessage(M.from , {text , mentions: [owner]} , {quoted: M})
    }
}
