const axios = require('axios');
const { Anime } = require('@shineiichijo/marika');

module.exports = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Gives you the info of the anime',
    async execute(client, arg, M) {
        try {
            const context = arg;
            if (!context) return M.reply('Provide a query for the search, Baka!');
            const query = context.trim();
            const { data } = await new Anime().searchAnime(query);
            const result = data[0];
            let text = '';
            text += `🎀 *Title:* ${result.title}\n`;
            text += `🎋 *Format:* ${result.type}\n`;
            text += `📈 *Status:* ${result.status.replace(/\_/g, ' ')}\n`;
            text += `🍥 *Total episodes:* ${result.episodes}\n`;
            text += `🎈 *Duration:* ${result.duration}\n`;
            text += `🧧 *Genres:* ${result.genres.map((genre) => genre.name).join(', ')}\n`;
            text += `✨ *Based on:* ${result.source}\n`;
            text += `📍 *Studios:* ${result.studios.map((studio) => studio.name).join(', ')}\n`;
            text += `🎴 *Producers:* ${result.producers.map((producer) => producer.name).join(', ')}\n`;
            text += `💫 *Premiered on:* ${result.aired.from}\n`;
            text += `🎗 *Ended on:* ${result.aired.to}\n`;
            text += `🎐 *Popularity:* ${result.popularity}\n`;
            text += `🎏 *Favorites:* ${result.favorites}\n`;
            text += `🎇 *Rating:* ${result.rating}\n`;
            text += `🏅 *Rank:* ${result.rank}\n\n`;
            if (result.background !== null) text += `🎆 *Background:* ${result.background}\n\n`;
            text += `❄ *Description:* ${result.synopsis}`;

            const image = await axios.get(result.images.jpg.large_image_url, { responseType: 'arraybuffer' });

            await client.sendMessage(
                M.from,
                {
                    image: Buffer.from(image.data, 'binary'),
                    caption: text,
                    contextInfo: {
                        externalAdReply: {
                            title: result.title,
                            mediaType: 1,
                            thumbnail: Buffer.from(image.data, 'binary'),
                            sourceUrl: result.url
                        }
                    }
                },
                {
                    quoted: M.message
                }
            );
        } catch (err) {
            console.error(err);
            return M.reply('Error occurred while fetching anime information.');
        }
    }
};
