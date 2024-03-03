const { spotifydl } = require('../../lib/Spotify');

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Downloads given Spotify track and sends it as Audio',
    async execute(client, flag, arg, M) {
        try {
            const link = M.urls[0];
            if (!link || !link.includes('https://open.spotify.com/track/')) {
                return M.reply('Please use the command with a valid Spotify track link.');
            }

            // Download the Spotify track
            const audioSpotify = await spotifydl(link.trim());

            if (!audioSpotify || !audioSpotify.audio) {
                return M.reply(`Error downloading: ${link.trim()}. Check if the URL is valid and try again.`);
            }

            M.reply('Downloading has started, please wait...');

            const caption = `🎧 *Title:* ${audioSpotify.data.name || ''}\n🎤 *Artists:* ${
                (audioSpotify.data.artists || []).join(', ') || ''
            }\n💽 *Album:* ${audioSpotify.data.album_name || ''}\n📆 *Release Date:* ${
                audioSpotify.data.release_date || ''
            }`;

            // Send cover image and track details
            if (audioSpotify.coverimage) {
                await client.sendMessage(M.from, { image: audioSpotify.coverimage, caption }, { quoted: M });
            } else {
                await client.sendMessage(M.from, caption, { quoted: M });
            }

            // Send the downloaded audio track
            await client.sendMessage(
                M.from,
                {
                    document: audioSpotify.audio,
                    mimetype: 'audio/mpeg',
                    fileName: `${audioSpotify.data.name || 'spotify_track'}.mp3`
                },
                { quoted: M }
            );
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while downloading the Spotify track.');
        }
    }
};