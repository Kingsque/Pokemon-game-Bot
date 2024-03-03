const axios = require('axios');

module.exports = {
    name: 'trendinganime',
    aliases: ['ta', 'trendani'],
    category: 'weeb',
    exp: 4,
    react: "✅",
    description: 'Gives you the list of trending anime',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        try {
            const res = await axios.get(`https://api.consumet.org/meta/anilist/trending`);
            const trends = res.data.results;

            for (let i = 0; i < trends.length; i++) {
                let text = '==== *TRENDING ANIME* ====\n\n';
                text += `*Name:* ${trends[i].title.english || trends[i].title.romaji || trends[i].title.native}\n`;
                text += `*Status:* ${trends[i].status}\n`;
                text += `*Rating:* ${trends[i].rating}\n`;
                text += `*Release Date:* ${trends[i].releaseDate}\n`;
                text += `*Genres:* ${trends[i].genres.join(', ')}\n`;
                text += `*Total Episodes:* ${trends[i].totalEpisodes}\n`;
                text += `*Duration:* ${trends[i].duration}\n`;
                text += `*Type:* ${trends[i].type}\n`;
                text += `*Description:* ${trends[i].description || 'Not available'}\n\n========================\n`;

                await client.sendMessage(M.from, {
                    image: {
                        url: trends[i].image
                    },
                    caption: text
                });
            }
        } catch (error) {
            console.error('Error fetching trending anime:', error);
            M.reply('Failed to fetch trending anime.');
            client.log(error, 'red');
        }
    }
};