module.exports = {
    name: 'create',
    aliases: ['create'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :info',
    description: 'Get bot information',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Use :create ttt/hm');

        if (arg === 'ttt') {
            const buffer = await client.utils.drawTTTBoard();
            await client.sendMessage(M.from, { image: buffer, caption: `Your ttt` }, { quoted: M });
        } else if (arg === 'hm') {
            const mistakes = Math.floor(Math.random() * 6) + 0; // Generate random mistakes from 1 to 6
            const buffer = await client.utils.drawHangMan(mistakes);
            await client.sendMessage(M.from, { image: buffer, caption: `Hangman with ${mistakes} mistake(s)` }, { quoted: M });
        } else {
            M.reply('Invalid game type. Use :create ttt/hm');
        }
    }
};
