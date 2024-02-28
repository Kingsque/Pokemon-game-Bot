const { getStats } = require('../../lib/stats');
const cx = require('canvacord');
const ms = require('parse-ms');

module.exports = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Gives you your rank',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.rank`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

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
                caption: `@${user.split("@")[0]}#${user.substring(3, 7)}'s rank card\n\n🎯 Exp: ${experience}/${requiredXpToLevelUp}\n❤️ Level: ${level}\n🔮 Role: ${rank}`,
                mentions: [user]
            },
            {
                quoted: M
            }
        );
        await client.DB.set(`${M.sender}.rank`, Date.now());
    }
};