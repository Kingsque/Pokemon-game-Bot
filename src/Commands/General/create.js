const { drawHangMan } = require('./your/drawHangMan/module/path');

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
        if (!arg || arg.length < 1) return M.reply('Use :create ttt/hm');

        const [gameType] = arg;

        if (gameType === 'ttt') {
            const buffer = await client.utils.drawTTTBoard();
            await client.sendMessage(M.from, { image: buffer, caption: `Your ttt` }, { quoted: M });
        } else if (gameType === 'hm') {
            const mistakes = Math.floor(Math.random() * 6) + 1; // Generate random mistakes from 1 to 6
            const buffer = await drawHangMan(mistakes);
            await client.sendMessage(M.from, { image: buffer, caption: `Hangman with ${mistakes} mistake(s)` }, { quoted: M });
        } else {
            M.reply('Invalid game type. Use :create ttt/hm');
        }
    }
};
