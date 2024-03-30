module.exports = {
    name: 'invite',
    aliases: ['invt', 'gclink', 'grouplink'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'moderation',
    usage: 'Use :invite <user_number> withiut +',
    description: 'Get the group link',
    async execute(client, arg, M) {
        const code = await client.groupInviteCode(M.from);
        if (!code) {
            return M.reply('Failed to get the group invite link.');
        }

        if (/\d+/.test(arg)) {
            const number = arg.match(/\d+/)[0];
            await client.sendMessage(number + '@s.whatsapp.us', `Here's the group invite link: https://chat.whatsapp.com/${code}`);
            return M.reply('✅ Group invite link sent to the specified number.');
        } else {
            M.reply('https://chat.whatsapp.com/' + code);
        }
    }
};
