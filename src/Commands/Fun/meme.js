const axios = require('axios')

module.exports = {
    name: 'Meme',
    aliases: ['meme'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "🧩",
    usage: 'Use :fact',
    description: 'Sends random facts'}
    module.exports.execute = async (client, flag, arg, M) => {
    const res = await axios.get(`https://meme-api.com/gimme`).catch((err) => {
        return M.reply(err.toString())
    })
    client.sendMessage(M.from, {
        image: {
            url: res.data.url
        },
        caption: `${res.data.title}`
    })
    }
