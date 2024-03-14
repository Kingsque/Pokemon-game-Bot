const { getStats } = require('../../lib/stats');
const cx = require('canvacord');

module.exports = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Gives you your rank',
    async execute(client, arg, M) {

        const user = M.quoted?.participant ? M.quoted.participant : M.mentions[0] ? M.mentions[0] : M.sender;

        let pfp;
        try {
            pfp = await client.profilePictureUrl(user, 'image');
        } catch {
            pfp = 'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg';
        }

        const level = (await client.DB.get(`${user}_LEVEL`)) || 1;
        const { requiredXpToLevelUp, rank } = getStats(level);
        const username = (await client.contact.getContact(user, client)).username;
        const experience = (await client.exp.get(user)) || 0;

        const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
        const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
        const randomHexz = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;

        const card = await new cx.Rank()
            .setAvatar(pfp)
            .setLevel(level)
            .setCurrentXP(experience, '#db190b')
            .setRequiredXP(requiredXpToLevelUp, '#db190b')
            .setProgressBar('#db190b')
            .setDiscriminator(user.substring(3, 7), '#db190b')
            .setCustomStatusColor('#db190b')
            .setLevelColor(randomHexs, randomHex)
            .setOverlay('', '', false)
            .setUsername(username, '#db190b')
            .setBackground('COLOR', randomHexz)
            .setRank(1, '', false)
            .renderEmojis(true)
            .build();

        client.sendMessage(
            M.from,
            {
                image: card,
                caption: `@${user.split("@")[0]}#${user.substring(3, 7)}'s rank card\n\n🎯 Exp: ${experience}/${requiredXpToLevelUp}\n❤️ Level: ${level}\n🔮 Rank: ${rank}`,
                mentions: [user]
            },
            {
                quoted: M
            }
        );
    }
};