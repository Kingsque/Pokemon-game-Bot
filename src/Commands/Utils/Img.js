const ms = require('parse-ms');

module.exports = {
    name: 'toimg',
    aliases: ['img'],
    category: 'utils',
    exp: 10,
    react: "✅",
    description: 'Converts sticker to image/gif',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.toimg`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            if (!M.quoted || (M.quoted && M.quoted.mtype !== 'stickerMessage')) {
                return M.reply('*Quote the sticker that you want to convert, Baka!*');
            }

            // Download the sticker
            const buffer = await M.quoted.download();

            // Check if the sticker is animated
            const isAnimated = M.quoted.message.stickerMessage.isAnimated;
            const type = isAnimated ? 'video' : 'image';

            // Convert the sticker to image/gif
            const result = isAnimated ? await client.utils.webpToMp4(buffer) : await client.utils.webpToPng(buffer);

            // Send the converted image/gif
            await client.sendMessage(
                M.from,
                {
                    [type]: result,
                    gifPlayback: isAnimated ? true : undefined
                },
                { quoted: M }
            );

            await client.DB.set(`${M.sender}.toimg`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error converting sticker to image/gif:', error);
            await M.reply('*Try Again*');
        }
    }
};