const ms = require('parse-ms');

module.exports = {
    name: 'card-shop',
    aliases: ['cshop'],
    category: 'card shop',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows available card shop items',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }

        const auction = (await client.DB.get('cshop')) || [];
        if (!auction.includes(M.from)) return M.reply(`Join the official group by using ${client.prefix}support, every weekend card shop commands are turned on`);
        
        let shop =  `⛺ *|------< CARD SHOP >-------|* ⛺\n\n🎉 *Welcome to our card shop. Here are the list of available cards:* 🎉\n\n*#1*\n🔥 *Name:* Madara\n🔩Tier: 6\n💰 *Price:* 50000 diamonds\n🛠️ *Source:* Naruto\n\n*#2*\n🔥 *Name:* Goku\n🔩Tier: 6\n💰 *Price:* 40000 diamonds\n🛠️ *Source:* Dragon Ball\n\n*#3*\n🔥 *Name:* Yuji Itadori and Sukuna\n🔩Tier: 6\n💰 *Price:* 45000 diamonds\n🛠️ *Source:* Jujutsu Kaisen\n\n*#4*\n🔥 *Name:* Tanjiro\n🔩Tier: 6\n💰 *Price:* 60000 diamonds\n🛠️ *Source:* Demon Slayer\n\n*#5*\n🔥 *Name:* Genos\n🔩Tier: 6\n💰 *Price:* 40000 diamonds\n🛠️ *Source:* One Punch Man\n\n*#6*\n🔥 *Name:* Allen Walker\n🔩Tier: 6\n💰 *Price:* 55000 diamonds\n🛠️ *Source:* D.gray Man\n\n*#7*\n🔥 *Name:* Yae Miko\n🔩Tier: 6\n💰 *Price:* 65000 diamonds\n🛠️ *Source:* Genshin Impact\n\n*#8*\n🔥 *Name:* Broly\n🔩Tier: 6\n💰 *Price:* 50000 diamonds\n🛠️ *Source:* Dragon Ball\n\n*#9*\n🔥 *Name:* Hayase Nagatoro\n🔩Tier: 6\n💰 *Price:*  45000 diamonds\n🛠️ *Source:* Unknown\n\n*#10*\n🔥 *Name:* Ace x Sabo x Luffy\n🔩Tier: 6\n💰 *Price:* 70000 diamonds\n🛠️ *Source:* One Piece\n\n🔰 *Note:* *Use :buy-card <Index_Number> to select your card.*\nEvery week, this list will be updated.`;
        M.reply(shop); 
        await client.DB.set(`${M.sender}.slot`, Date.now());
    }
};