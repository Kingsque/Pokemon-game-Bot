const axios = require('axios');
const { Character } = require('@shineiichijo/marika');

module.exports = {
    name: 'character',
    aliases: ['char'],
    category: 'weeb',
    react: "✅",
    exp: 5,
    cool: 4, // Adding cooldown time in seconds
    description: 'Provides information about a character from anime',
    async execute(client, arg, M) {
        try {
            if (!arg) return M.reply('Provide a query for the search, Baka!');
            const query = arg.trim();
            const { data } = await new Character().searchCharacter(query);
            const chara = data[0];
            let source = '';
            try {
                const animeRes = await new Character().getCharacterAnime(chara.mal_id);
                source = animeRes.data[0].anime.title;
            } catch {
                try {
                    const mangaRes = await new Character().getCharacterManga(chara.mal_id);
                    source = mangaRes.data[0].manga.title;
                } catch {
                    source = '';
                }
            }
            let text = `💙 *Name:* ${chara.name}\n`;
            if (chara.nicknames.length > 0) text += `💚 *Nicknames:* ${chara.nicknames.join(', ')}\n`;
            text += `💛 *Source:* ${source}`;
            if (chara.about !== null) text += `\n\n❤ *Description:* ${chara.about}`;
            
            // Fetching image buffer
            const imageResponse = await axios.get(chara.images.jpg.image_url, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');

            await client.sendMessage(M.from, {
                image: {
                    url: imageBuffer,
                },
                caption: text,
            });
        } catch (error) {
            console.error('Error fetching character information:', error);
            M.reply('An error occurred while fetching character information.');
        }
    }
};
