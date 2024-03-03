module.exports = {
    name: 'removebg',
    aliases: ['rbg'],
    category: 'utils',
    exp: 10,
    cool: 4,
    react: "✅",
    description: 'Removes background from the image',
    async execute(client, arg, M) {
        try {
            // Check if the background removal API key is provided
            if (!client.bgAPI) {
                return M.reply("You didn't provide an API key for background removal.");
            }

            // Check if the message contains a quoted image or if it's an image itself
            const isQuotedImage = M.quoted && M.quoted.mimetype.includes('image');
            const isImage = M.mimetype.includes('image');

            // Check if the message is an image
            if (!isQuotedImage && !isImage) {
                return M.reply("You didn't provide an image.");
            }

            // Download the image
            const buffer = isQuotedImage ? await M.quoted.download() : await M.download();

            // Remove background from the image
            const removedBackgroundImage = await client.utils.removeBackground(buffer);

            // Send the image with the removed background
            await client.sendMessage(
                M.from,
                {
                    image: removedBackgroundImage
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error('Error removing background from image:', error);
            await client.sendMessage(
                M.from,
                { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${error}` }
            );
        }
    }
};