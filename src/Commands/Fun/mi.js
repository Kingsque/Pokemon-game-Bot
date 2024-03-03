module.exports = {
    name: 'myinstants',
    aliases: ['mi'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Sends random facts',
    async execute(client, arg, M) {
        const term = arg.trim()
        if (!term) {
          return void (await M.reply('🟥 Search Term is required'));
        }
        const url = await client.utils.search(term).catch(() => null);
        if (!url) {
          return void (await M.reply(`🟥 No results for "${term}"`));
        }

        // Assuming client.utils.getBuffer is a valid function for fetching the audio buffer
        let buffer = await client.utils.getBuffer(url);

        // Send the audio buffer as a message
        client.sendMessage(M.from, buffer, { mimetype: 'audio/mp4' });
    }
}