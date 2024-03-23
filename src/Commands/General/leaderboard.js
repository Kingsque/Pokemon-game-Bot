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
            const field = arg[0] || '';
            const subfield = arg[1] || '';
            let allUsers = [];

            if (field === '--credit') {
                allUsers = Object.values(await client.credit.all()).map(x => ({
                    user: x.id,
                    credit: x.value.credit || 0,
                    bank: x.value.bank || 0,
                }));
            } else if (field === '--cards') {
                allUsers = Object.values(await client.DB.all()).map(x => ({
                    user: x.id,
                    deck: x.value.deck || [],
                    collection: x.value.collection || []
                }));
            } else {
                allUsers = Object.values(await client.exp.all()).map(x => ({
                    user: x.id,
                    xp: x.value
                })) || [];
            }

            if (allUsers.length === 0) {
                return M.reply('🟥 *Sorry, there are not enough users to create a leaderboard*');
            }

            const leaderboard = (field === '--credit' || subfield === '--credit')
                ? sortArray(allUsers, {
                    by: 'total',
                    order: 'desc',
                    computed: {
                        total: (x) => x.credit + x.bank
                    }
                })
                : (field === '--cards' || subfield === '--cards')
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

            const senderId = M.sender.split('.whatsapp.net')[0];
            const myPosition = leaderboard.findIndex(x => x.user === senderId);

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
                text += `🃏 *Cards: ${leaderboard[i].deck.length + leaderboard[i].collection.length}*\n`;
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
