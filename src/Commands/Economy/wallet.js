module.exports = {
    name: 'credit',
    aliases: ['cr', 'credits'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :credit',
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        let wallet = await client.credit.get(`${M.sender}.wallet`) || 0;
        
        // Check if the amount starts with a "-" sign
        if (wallet.toString().startsWith('-')) {
            wallet = 0; // Convert negative amount to 0
        }
        
        // Check if the amount contains a "." sign
        if (wallet.toString().includes('.')) {
            wallet = Math.round(wallet); // Round decimal or fraction amounts
        }
        
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `💳 *Credits* 💳\n\n👤 *Name:* ${username}\n🔖 *Tag:* ${tag}\n💳 *Credits:* ${wallet}`;

        M.reply(text);
    }
};
