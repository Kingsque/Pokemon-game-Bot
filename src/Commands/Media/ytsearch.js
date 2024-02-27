const yts = require('yt-search');
const ms = require('parse-ms');

module.exports = {
    name: 'ytsearch',
    aliases: ['yts'],
    category: 'media',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Searches for videos on YouTube based on the given query',
    async execute(client, flag, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.ytsearch`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');
            
            const { videos } = await yts(arg.trim());
            
            if (!videos || !videos.length) return M.reply(`No videos found for *"${arg.trim()}"*`);
            
            let text = '';
            const maxResults = 10;
            const length = Math.min(videos.length, maxResults);

            for (let i = 0; i < length; i++) {
                const video = videos[i];
                text += `*#${i + 1}*\n📗 *Title:* ${video.title}\n📕 *Channel:* ${video.author.name}\n📙 *Duration:* ${video.seconds}s\n🔗 *URL:* ${video.url}\n\n`;
            }

            M.reply(text);
            await client.DB.set(`${M.sender}.ytsearch`, Date.now());
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while searching for videos.');
        }
    }
};