const ms = require('parse-ms');

module.exports = {
    name: 'wallet',
    aliases: ['wal'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        const wallet = await client.cradit.get(`${M.sender}.wallet`) || 0;
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `💰 *Wallet* 💰\n\n👤 *Name:* ${username}\n🔖 *Tag:* ${tag}\n💰 *Gold:* ${wallet} 🪙`;

        M.reply(text);
        await client.DB.set(`${M.sender}.wallet`, Date.now());
    }
};