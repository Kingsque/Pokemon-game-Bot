module.exports = {
    name: 'ytaudio',
    aliases: ['yta'],
    category: 'media',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :ytaudio <song_link>',
    description: 'Downloads given YouTube Video and sends it as Audio',
    async execute(client, arg, M) {
	@@ -28,23 +26,7 @@ module.exports = {

            const { videoDetails } = await YT.getInfo(term);

            M.reply('Downloading has started, please wait...');

            let text = `*Title:* ${videoDetails.title} | *Type:* Audio | *From:* ${videoDetails.ownerChannelName}`;

            // Sending thumbnail and video details
            client.sendMessage(
                M.from,
                {
                    image: {
                        url: `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`
                    },
                    caption: text
                },
                {
                    quoted: M
                }
            );

            // Checking if the video is longer than 30 minutes
            if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes');
	@@ -54,7 +36,7 @@ module.exports = {
            await client.sendMessage(
                M.from,
                {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${videoDetails.title}.mp3`
                },
	
