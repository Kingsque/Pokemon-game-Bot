const { Manga } = require('@shineiichijo/marika')

module.exports = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Gives you the info of the anime',
    async execute(client, arg, M) {
        if (!arg) return void M.reply('Provide a query for the search, Baka!')
        const query = arg.trim()
        await new Manga()
            .searchManga(query)
            .then(async ({ data }) => {
                const result = data[0]
                let text = ''
                text += `🎀 *Title:* ${result.title}\n`
                text += `🎋 *Format:* ${result.type}\n`
                text += `📈 *Status:* ${this.helper.utils.capitalize(result.status.replace(/\_/g, ' '))}\n`
                text += `🍥 *Total chapters:* ${result.chapters}\n`
                text += `🎈 *Total volumes:* ${result.volumes}\n`
                text += `🧧 *Genres:* ${result.genres.map((genre) => genre.name).join(', ')}\n`
                text += `💫 *Published on:* ${result.published.from}\n`
                text += `🎗 *Ended on:* ${result.published.to}\n`
                text += `🎐 *Popularity:* ${result.popularity}\n`
                text += `🎏 *Favorites:* ${result.favorites}\n`
                text += `🏅 *Rank:* ${result.rank}\n\n`
                if (result.background !== null) text += `🎆 *Background:* ${result.background}*\n\n`
                text += `❄ *Description:* ${result.synopsis}`
                const image = result.images.jpg.large_image_url

                  await client.sendMessage(M.from, {
                image: {
                    url: image,
                },
                caption: text,
            });
            } catch (err) {
            console.error('Error fetching anime information:', err);
            M.reply('An error occurred while fetching anime information.');
        }
    }
