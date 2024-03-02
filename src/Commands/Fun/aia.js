const ms = require('parse-ms');

module.exports = {
    name: 'myinstants',
    aliases: ['mi'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Sends random facts',
    async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.mi`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
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
        await client.DB.set(`${M.sender}.mi`, Date.now());
    }
}