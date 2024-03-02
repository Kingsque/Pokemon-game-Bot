const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const ms = require('parse-ms');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    category: 'utils',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'sticker [caption/quote message containing media] <pack> | <author>',
    async execute(client, arg, M) {

        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.sticker`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
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
                await client.DB.set(`${M.sender}.sticker`, Date.now());

                // Create a new sticker instance
                const sticker = new Sticker(buffer, {
                    pack: packName || '👾 Handcrafted for you by',
                    author: authorName || 'aurora 👾',
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