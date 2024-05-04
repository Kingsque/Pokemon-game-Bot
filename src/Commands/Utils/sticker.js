const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    category: 'utils',
    exp: 15,
    cool: 4,
    react: "🌀",
    usage: 'Use :sticker by quoting a image/gif <pack_name>|<author_name>',
    description: 'sticker command helps you to convert images or gifs to an sticker',
    async execute(client, arg, M) {
        try {
            const content = JSON.stringify(M.quoted);
            const isMedia = M.type === 'imageMessage' || M.type === 'videoMessage';
            const isQuotedMedia = (M.type === 'extendedTextMessage' && content.includes('imageMessage')) ||
                (M.type === 'extendedTextMessage' && content.includes('videoMessage'));

            if (isMedia || isQuotedMedia) {
                // Split pack and author from the argument
                const [packName, authorName] = arg.split('|').map(part => part.trim());

                // Download the media
                const buffer = isQuotedMedia ? await M.quoted.download() : await M.download();

                M.reply('Processing.....');

                // Create a new sticker instance
                const sticker = new Sticker(buffer, {
                    pack: packName || 'I Hope That Like You!! 🥰',
                    author: authorName || '𝕹𝖎𝖊𝖗 𝕬𝖚𝖙𝖔𝖒𝖆𝖙𝖆',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    quality: 70
                });

                // Build and send the sticker
                await client.sendMessage(
                    M.from,
                    {
                        sticker: await sticker.build()
                    },
                    {
                        quoted: M
                    }
                );
            } else {
                return M.reply('Please quote or caption the image/video.');
            }
        } catch (error) {
            console.error('Error while executing sticker command:', error);
            await M.reply('An error occurred while processing the command.');
        }
    }
};
