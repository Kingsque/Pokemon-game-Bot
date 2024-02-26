const axios = require('axios');

module.exports = {
    name: 'myinstants',
    aliases: ['mi'],
    category: 'fun',
    exp: 5,
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
        // await M.reply(await fetchBuffer(url), 'audio', 'audio/mp4');
        // let res = await client.utils.getBuffer(url)
        client.sendMessage(M.from,{audio: {url},mimetype: 'audio/mp4'},
            {
                quoted: M
            }
        )
    }
}
