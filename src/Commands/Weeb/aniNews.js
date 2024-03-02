const { NEWS } = require('@consumet/extensions');
const ms = require('parse-ms');

module.exports = {
    name: 'aninews',
    aliases: ['animenews'],
    category: 'weeb',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'Provides news about anime',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.aninews`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        try {
            const news = await NEWS.ANN.fetchNewsFeeds(); // Updated fetch method
            for (let i = 0; i < 5 && i < news.length; i++) { // Added condition to avoid errors if less than 5 news articles are available
                const article = news[i];
                const topics = article.topics.join('\n'); // Improved formatting for topics
                const previewIntro = article.preview.intro.replace(/\n/g, '\n\n'); // Improved formatting for intro
                const previewFull = article.preview.full.replace(/\n/g, '\n\n'); // Improved formatting for full description
                await client.sendMessage(M.from, {
                    image: {
                        url: article.thumbnail
                    },
                    caption: `===== ANIME NEWS =====\n*Title*: ${article.title}\n*ID*: ${article.id}\n*Topics*: ${topics}\n*Uploaded At*: ${article.uploadedAt}\n*Preview*:-\n\n*Intro*: ${previewIntro}\n\n*Description*: ${previewFull}\n*Link*: ${article.url}`
                });
                await client.DB.set(`${M.sender}.aninews`, Date.now());
            }
        } catch (err) {
            M.reply(err.toString());
            client.log(err, 'red');
        }
    }
};