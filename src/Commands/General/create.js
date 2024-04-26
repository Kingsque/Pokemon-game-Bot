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
      if (!arg) M.reply('Use :create ttt/hm')
      if (arg === 'ttt') {

      const buffer = awai client.utils.getBuffer(client.utils.displayTicTacToeBoard())
         await client.sendMessage(
          M.from,
          {
            image: { url: bufer },
            caption: text
          },
          {
            quoted: M
          }
        );
    }
}; 
