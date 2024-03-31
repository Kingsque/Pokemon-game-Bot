module.exports = {
    name: 'credit',
    aliases: ['ct'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :credit',
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `💳 *Credits* 💳\n\n👤 *Name:* ${username}\n🔖 *Tag:* ${tag}\n💰 *Credits:* ${wallet} 🪙`;

        M.reply(text);
    }
};
