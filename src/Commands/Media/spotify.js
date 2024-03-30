const { spotifydl } = require('../../lib/Spotify');

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    exp: 5,
    react: "✅",
    usage: 'Use :spotify <Link>',
    description: 'Downloads given Spotify track and sends it as audio with an image and caption',
    async execute(client, arg, M) {
        const link = arg;
        if (!link.includes('https://open.spotify.com/track/'))
            return M.reply('Please use the command with a valid Spotify link');
        
        try {
            // Download Spotify audio
            const audioSpotify = await spotifydl(link.trim());
            
            if (audioSpotify.error) {
                return M.reply(`Error Fetching: ${link.trim()}. Check if the URL is valid and try again`);
            }
            

            const caption = `🎧 *Title:* ${audioSpotify.data.name || ''}\n🎤 *Artists:* ${(
                audioSpotify.data.artists || []
            ).join(', ')}\n💽 *Album:* ${audioSpotify.data.album_name}\n📆 *Release Date:* ${
                audioSpotify.data.release_date || ''
            }`;

            // Send the image with caption
            await client.sendMessage(
                M.from,
                {
                    image: audioSpotify.coverimage, // Send image
                    caption: caption,
                    quoted: M // Quote the original message
                }
            );

            // Send the audio with the caption
            await client.sendMessage(
                M.from,
                {
                    audio: audioSpotify.audio, // Send audio
                    mimetype: 'audio/mpeg', // Correct mimetype for audio
                    fileName: audioSpotify.data.name + '.mp3',
                    quoted: M // Quote the original message
                }
            );
        } catch (err) {
            console.error(err);
            return M.reply('An error occurred while processing the request.');
        }
    }
};
