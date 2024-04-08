const { getStats } = require('../../Helpers/Stats');
const sortArray = require('sort-array');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :lb',
    description: "Displays global leaderboard of aurora bot in various types",
    async execute(client, arg, M) {
        try {
            const exp = Object.values(await client.exp.all()) ?? [];

            const users = exp.map((x) => ({
                user: x.id,
                xp: x.value.whatsapp.net
            }));

            const lb = sortArray(users, {
                by: 'xp',
                order: 'desc'
            });

            if (lb.length < 1) return M.reply('🟥 *There are no users with XP*');
            
            const myPosition = lb.findIndex((x) => x.user === M.sender.split('.whatsapp.net')[0]);
            const topUsers = lb.slice(0, 10);

            let text = `☆☆💥 GLOBAL LEADERBOARD 💥☆☆\n\nYour Position: ${myPosition + 1}\n`;

            for (let i = 0; i < topUsers.length; i++) {
                const level = (await client.DB.get(`${topUsers[i].user}.whatsapp.net_LEVEL`)) ?? 1;
                const { requiredXpToLevelUp, rank } = getStats(level);
                const username = (await client.contact.getContact(topUsers[i].user, client)).username.whatsapp.net;
                
                text += `\n\n*(${i + 1})*\n`;
                text += `⛩ Username: ${username}#${topUsers[i].user.substring(3, 7)}\n`;
                text += `〽️ Level: ${level}\n`;
                text += `🎡 Rank: ${rank}\n`;
                text += `⭐ Exp: ${topUsers[i].xp}\n`;
                text += `🍥 RequiredXpToLevelUp: ${requiredXpToLevelUp} exp required\n`;
            }

            client.sendMessage(
                M.from,
                {
                    image: {
                        url: 'https://i.ibb.co/tPhb428/Aurora.jpg'
                    },
                    caption: text,
                    gifPlayback: true
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error('Error in leaderboard command:', error);
            M.reply('🟥 *An error occurred while fetching leaderboard.*');
        }
    }
};
                
