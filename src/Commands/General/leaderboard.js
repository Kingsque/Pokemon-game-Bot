const { getStats } = require('../../lib/stats');
const sortArray = require('sort-array');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'general',
    exp: 5,
    react: "✅",
    description: "Displays global's or group's leaderboard of a specific field\nEx: lb gold gc",
    async execute(client, arg, M) {
        const group = ['--gc', '--group'];
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants.map((x) => x.id.split('.whatsapp.net')[0]) || [];
        const all_users =
            (arg[1] ?? arg[0]) === '--credit'
                ? Object.values(await client.exp.all()).map((x) => ({ user: x.id, xp: x.value })) || []
                : Object.values(await client.credit.all()).map((x) => ({
                    user: x.id,
                    credit: x.value.credit || 0,
                    bank: x.value.bank || 0
                }));

        const users = group.includes(arg[0]) ? all_users.filter((x) => groupMembers.includes(x.user)) : all_users;

        const leaderboard =
            (arg[1] ?? arg[0]) === '--credit'
                ? sortArray(users, {
                    by: 'xp',
                    order: 'desc'
                })
                : sortArray(users, {
                    by: 'total',
                    order: 'desc',
                    computed: {
                        total: (x) => x.credit + x.bank
                    }
                });

        if (leaderboard.length < 10) return M.reply('🟥 *Sorry, there are not enough users to create a leaderboard*');
        const myPosition = leaderboard.findIndex((x) => x.user == M.sender.split('.whatsapp.net')[0]);
        let text = `☆☆💥 LEADERBOARD 💥☆☆\n\n*${
            (await client.contact.getContact(M.sender, client)).username
        }'s Position is ${myPosition + 1}*`;
        for (let i = 0; i < 10; i++) {
            const level = (await client.DB.get(`${leaderboard[i].user}.whatsapp.net_LEVEL`)) || 1;
            const { requiredXpToLevelUp, rank } = getStats(level);
            const username = (await client.contact.getContact(leaderboard[i].user, client)).username;
            const experience = (await client.exp.get(leaderboard[i].user)) || 0;
            text += `\n\n*>${i + 1}*\n`;
            text += `🏮 *Username: ${username}*#${leaderboard[i].user.substring(
                3,
                7
            )}\n〽️ *Level: ${level}*\n🎡 *Rank: ${rank}*\n💰 *Credit: ${
                leaderboard[i].credit + leaderboard[i].bank
            }*\n⭐ *Exp: ${experience}*\n📇 *Credits: ${leaderboard[i].credit}*\n🔐 *Bank: ${
                leaderboard[i].bank
            }*\n🍥 *RequiredXpToLevelUp: ${requiredXpToLevelUp} exp required*`;
        }

        client.sendMessage(
            M.from,
            {
                video: {
                    url: 'https://media.tenor.com/MqSOkI7a96cAAAPo/banner-discord.mp4'
                },
                caption: text,
                gifPlayback: true
            },
            {
                quoted: M
            }
        );
    }
};
