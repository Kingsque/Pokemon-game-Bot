// Wallet Command
module.exports = {
    name: 'wallet',
    aliases: ['credit', 'cr', 'credits'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :wallet',
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        let wallet = await client.gem.get(`${M.sender}.wallet`) || 0;
        
        // Convert decimal or fraction amounts to nearest integer
        if (!Number.isInteger(wallet)) {
            wallet = Math.round(wallet);
            await client.gem.set(`${M.sender}.wallet`, wallet);
        }

        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `💳 *Credits* 💳\n\n👤 *Name:* ${username}\n🔖 *Tag:* ${tag}\n💳 *Credits:* ${wallet}`;
        const thumbnail = await client.utils.getBuffer('https://i.ibb.co/tPhb428/Aurora.jpg');
        
        await client.sendMessage(M.from, {
            text: '',
            contextInfo: {
                externalAdReply: {
                    title: `${username}: ${wallet}`,
                    mediaType: 2,
                    thumbnail: thumbnail,
                    sourceUrl: ''
                }
            }
        });
    }
};
