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
            if (!arg || !arg.includes('https://open.spotify.com/')) {
                return M.reply('Please provide a valid Spotify track URL.');
            }
            
            const spotify = new Spotify(arg);
            const info = await spotify.getInfo();
            
            if (info.error) {
                return M.reply('Provide a valid Spotify track URL.');
            }
            
            const { name, artists, album_name, release_date, cover_url } = info;
            const details = `🎧 *Title:* ${name || ''}\n🎤 *Artists:* ${(artists || []).join(',')}\n💽 *Album:* ${album_name}\n📆 *Release Date:* ${release_date || ''}`;
            
            const response = await client.sendMessage(
                M.from,
                { image: { url: cover_url }, caption: details },
                { quoted: M.message }
            );
            
            const buffer = await spotify.download();
            
            if (buffer) {
                await client.sendMessage(M.from, { audio: buffer }, { quoted: response });
            } else {
                M.reply('Failed to download the Spotify track.');
            }
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while downloading the Spotify track.');
        }
    }
};
