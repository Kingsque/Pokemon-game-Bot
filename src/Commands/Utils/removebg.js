const ms = require('parse-ms');

module.exports = {
    name: 'removebg',
    aliases: ['rbg'],
    category: 'utils',
    exp: 10,
    cool: 4,
    react: "✅",
    description: 'Removes background from the image',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.rbg`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
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
            await client.DB.set(`${M.sender}.rbg`, Date.now());

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