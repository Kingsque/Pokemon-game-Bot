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
            const buffer = await client.utils.getBuffer(client.utils.drawTTTBoard());
            await client.sendMessage(
                M.from,
                {
                    image: { url: `data:image/png;base64,${buffer.toString('base64')}` },
                    caption: "Here's the Tic Tac Toe board:"
                },
                {
                    quoted: M
                }
            );
        }
    }
};
