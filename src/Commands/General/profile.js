const { getStats } = require('../../Helpers/Stats');

module.exports = {
    name: 'profile',
    aliases: ['p'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "👀",
    usage: 'Use :p to get your profile',
    description: 'Gives you your stats',
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants || [];
        const groupAdmins = groupMembers.filter((v) => v.isAdmin).map((v) => v.id);
        const user = M.quoted?.participant || M.mentions[0] || M.sender;
        const collection = (await client.DB.get(`${user}_Collection`)) || [];
        const deck = await client.DB.get(`${user}_Deck`);
        let bank = await client.credit.get(`${user}.bank`) || 0;
        let wallet = await client.credit.get(`${user}.wallet`) || 0;

        let pfp;
        try {
            pfp = await client.profilePictureUrl(user, 'image');
        } catch {
            pfp = 'https://i.ibb.co/jyfcX5S/wp4055471-mai-sakurajima-wallpapers.png';
        }

        let bio;
        try {
            bio = (await client.fetchStatus(user)).status;
        } catch {
            bio = 'None'; // Set to 'None' if no bio is available
        }

        const level = (await client.DB.get(`${user}_LEVEL`)) || 1;
        const stats = getStats(level);
        const contact = await client.contact.getContact(user, client);
        const username = (await client.contact.getContact(user, client)).username?.whatsapp?.net ?? 'Unknown';
        const experience = (await client.exp.get(user)) || 0;
        const banned = (await client.DB.get('banned')) || [];

        let text = '';
        text += `🏮 *Username:* ${username}#${user.substring(3, 7)}\n`;
        text += `🎫 *Bio:* ${bio}\n`;
        text += `🍀 *Level:* ${level}\n`;
        text += `🌟 *XP:* ${experience}\n`;
        text += `🥇 *Rank:* ${stats.rank}\n`;
        text += `👑 *Admin:* ${groupAdmins.includes(user) ? 'True' : 'False'}\n`;
        text += `✖ *Ban:* ${banned.includes(user) ? 'True' : 'False'}\n`;
        text += `💰 *Wallet:* ${wallet}\n`;
        text += `🃏 *Deck:* ${deck ? deck.length : 0}\n`; // Check if deck is empty

        client.sendMessage(
            M.from,
            {
                image: {
                    url: pfp
                },
                caption: text
            },
            {
                quoted: M
            }
        );
    }
};
