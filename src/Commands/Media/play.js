const YT = require('../../lib/YT');
const axios = require('axios');

module.exports = {
    name: 'play',
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    react: "🎶",
    category: 'media',
    usage: 'play [term]',
    async execute(client, arg, M) {
        try {
            if (!arg) return M.reply('Provide a term to play, Baka!');
            const { data: videos } = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${arg}`);
            if (!videos || !videos.length) return M.reply(`No matching songs found | *"${arg}"*`);
            const audioBuffer = await YT.getBuffer(videos[0].url, 'audio');
            
            await client.sendMessage(
                M.from,
                {   
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${videos[0].title}.mp3`
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while playing the song.');
        }
    }
};
