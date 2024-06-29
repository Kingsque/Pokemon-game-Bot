const { shizobtn1, shizobtn1img, shizobtn1gif } = require('../../shizofunc.js')

module.exports = {
    name: 'owner',
    aliases: ['own'],
    category: 'general',
    react: "📢",
    description: 'Get information bot information',
    async execute(client, arg, M) {
        let number = '919529426293@s.whatsapp.net'
        const owner = number
        let text = `*🎍Owner:-* @${owner.split('@')[0]}\n*I'm The Owner Of This Bot..!`
        return shizobtn1img(client, M.from, text, "https://telegra.ph/file/fe7d26d07ca4a88657159.jpg", "Manual 👋", "-help", "𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻")
       
    }
}; 
