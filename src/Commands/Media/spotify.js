const { spotifydl } = require('../../lib/Spotify')

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    exp: 5,
    react: "✅",
    usage: 'Use :spotify <Link>',
    description: 'Downloads given Spotify track and sends it as audio with an image and caption',
    async execute(client, arg, M) {
        const link = arg
        if (!link.includes('https://open.spotify.com/track/'))
            return M.reply('Please use the command with a valid Spotify link')
        
        const audioSpotify = await spotifydl(link.trim()).catch((err) => {
            return M.reply(err.toString())
            client.log(err, 'red')
        })

        if (audioSpotify.error) 
            return M.reply(`Error Fetching: ${link.trim()}. Check if the URL is valid and try again`)
        
        M.reply('Downloading has started, please wait.')

        const caption = `🎧 *Title:* ${audioSpotify.data.name || ''}\n🎤 *Artists:* ${(
            audioSpotify.data.artists || []
        ).join(', ')}\n💽 *Album:* ${audioSpotify.data.album_name}\n📆 *Release Date:* ${
            audioSpotify.data.release_date || ''
        }`

        await client.sendMessage(
            M.from,
            {
                "type": "multimedia",
                "multimedia": [
                    {
                        "type": "image",
                        "url": audioSpotify.coverimage,
                        "caption": caption
                    },
                    {
                        "type": "audio",
                        "url": audioSpotify.audio,
                        "filename": audioSpotify.data.name + '.mp3'
                    }
                ]
            },
            {
                quoted: M
            }
        )
    }
}
