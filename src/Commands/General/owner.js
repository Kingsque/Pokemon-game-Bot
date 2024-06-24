module.exports = {
    name: 'owner',
    aliases: ['own'],
    category: 'general',
    react: "📢",
    description: 'Get information bot information',
    async execute(client, arg, M) {
        let number = '919529426293@s.whatsapp.net'
        const owner = number
        let text = `*🎍Owner:-* @${owner.split('@')[0]}\n*I'M The Owner Of this Bot:-*\n{ ${client.name} }!`
        await client.sendMessage(M.from , {text , mentions: [owner]} , {quoted: M})
    }
}
