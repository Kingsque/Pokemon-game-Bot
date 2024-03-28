const Spotify = require('../../lib/Spotify');

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Downloads given Spotify track and sends it as Audio',
    async execute(client, arg, M) {
        try {
            let context = arg.includes('https://open.spotify.com/')
            if (!context) return M.reply('Where is the url of spotify?')
            const spotify = new Spotify(context)
            const info = await spotify.getInfo() // Changed this line
            if (info.error) return M.reply('Provide a valid spotify track URL, Baka!')
            const { name, artists, album_name, release_date, cover_url } = info
            const details = `🎧 *Title:* ${name || ''}\n🎤 *Artists:* ${(artists || []).join(
                ','
            )}\n💽 *Album:* ${album_name}\n📆 *Release Date:* ${release_date || ''}`
            const response = await client.sendMessage(
                M.from,
                { image: { url: cover_url }, caption: details },
                { quoted: M.message }
            )
            const buffer = await spotify.download()
            await client.sendMessage(M.from, { audio: buffer }, { quoted: response })
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while downloading the Spotify track.');
        }
    }
};
