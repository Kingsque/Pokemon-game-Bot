module.exports = {
    name: 'wallet',
    aliases: ['wal'],
    category: 'economy',
    exp: 5,
    react: "✅",
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
   
   let wallet = await client.cradit.get(`${M.sender}.wallet`) || 0;
   
   let text = `💰 *Wallet* 💰\n\n👤 *Name:* ${(await client.contact.getContact(M.sender, client)).username}\n🔖 *Tag:* #${M.sender.substring(3, 7)}\n💰 *Gold:* ${wallet} 🪙`
   
   M.reply(text)
   }
  }
