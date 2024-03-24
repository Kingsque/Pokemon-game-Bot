const { getStats } = require('../../Helpers/Stats');
const sortArray = require('sort-array');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "✅",
    description: "Displays global's or group's leaderboard of a specific field\nEx: lb gold gc",
    async execute(client, arg, M) {
        try {
            const allUsers =
                (arg[1] ?? arg[0]) === '--credit'
                    ? Object.values(await client.credit.all()).map((x) => ({
                        user: x.id,
                        credit: x.value.credit || 0,
                        bank: x.value.bank || 0,
                    }))
                    : (arg[1] ?? arg[0]) === '--cards'
                        ? Object.values(await client.DB.all()).map((x) => ({
                            user: x.id,
                            deck: x.value.deck || [],
                            collection: x.value.collection || []
                        }))
                        : Object.values(await client.exp.all()).map((x) => ({ user: x.id, xp: x.value })) || [];

            const leaderboard =
                (arg[1] ?? arg[0]) === '--credit'
                    ? sortArray(allUsers, {
                        by: 'total',
                        order: 'desc',
                        computed: {
                            total: (x) => x.credit + x.bank
                        }
                    })
                    : (arg[1] ?? arg[0]) === '--cards'
                        ? sortArray(allUsers, {
                            by: 'totalCards',
                            order: 'desc',
                            computed: {
                                totalCards: (x) => x.deck.length + x.collection.length
                            }
                        })
                        : sortArray(allUsers, {
                            by: 'xp',
                            order: 'desc'
                        });

            if (leaderboard.length < 10) {
                return M.reply('🟥 *Sorry, there are not enough users to create a leaderboard*');
            }

            const myPosition = leaderboard.findIndex((x) => x.user === M.sender.split('.whatsapp.net')[0]);
            let text = `☆☆💥 LEADERBOARD 💥☆☆\n\n*${
                (await client.contact.getContact(M.sender, client)).username
            }'s Position is ${myPosition + 1}*`;

            for (let i = 0; i < Math.min(10, leaderboard.length); i++) {
                const level = (await client.DB.get(`${leaderboard[i].user}.whatsapp.net_LEVEL`)) || 1;
                const { requiredXpToLevelUp, rank } = getStats(level);
                const username = (await client.contact.getContact(leaderboard[i].user, client)).username;
                const experience = (await client.exp.get(leaderboard[i].user)) || 0;

                text += `\n\n*>${i + 1}*\n`;
                text += `🏮 *Username: ${username}*#${leaderboard[i].user.substring(3, 7)}\n`;
                text += `〽️ *Level: ${level}*\n🎡 *Rank: ${rank}*\n`;
                text += `💰 *Credit: ${leaderboard[i].credit + leaderboard[i].bank}*\n`;
                text += `🃏 *Cards: ${leaderboard[i].deck.length + leaderboard[i].collection.length || 0}*\n`;
                text += `⭐ *Exp: ${experience}*\n\n🍥 *RequiredXpToLevelUp: ${requiredXpToLevelUp} exp required*`;
            }
            client.sendMessage(
                M.from,
                {
                    image: {
                        url: 'https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg'
                    },
                    caption: text
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error('Error in leaderboard command:', error);
            M.reply('An error occurred while processing the command.');
        }
    }
};
