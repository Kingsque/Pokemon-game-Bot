module.exports = {
    name: 'card-shop',
    aliases: ['cshop'],
    category: 'card shop',
    exp: 5,
    react: "✅",
    description: 'shows card shop items',
    async execute(client, arg, M) {
        
      //  const cshop = (await client.DB.get('cshop')) || []
        
      //  if(!cshop.includes(M.from)) return M.reply("join Auction and cards group for it by using :support")
     //Card Game enable checker

        let shop =  `⛺ *|------< CARD SHOP >-------|* ⛺\n\n🎉 *welcome to our card shop.Here are the list of cards* 🎉\n\n*#1*\n🔥 *Name:* Madara\n🔩Tier: 6\n💰 *Price:* 50000 diamonds\n🛠️ *Source:* Naruto\n\n*#2*\n🔥 *Name:* Goku\n🔩Tier: 6\n💰 *Price:* 40000 diamonds\n🛠️ *Source:* Dragon Ball\n\n*#3*\n🔥 *Name:* Yuji Itadori and Sukuna\n🔩Tier: 6\n💰 *Price:* 45000 diamonds\n🛠️ *Source:* Jujutsu Kaisen\n\n*#4*\n🔥 *Name:* Tanjiro\n🔩Tier: 6\n💰 *Price:* 60000 diamonds\n🛠️ *Source:* Demon slayer\n\n*#5*\n🔥 *Name:* Genos\n🔩Tier: 6\n💰 *Price:* 40000 diamonds\n🛠️ *Source:* One Punch Man\n\n*#6*\n\n🔥 *Name:* Allen Walker\n🔩Tier: 6\n💰 *Price:* 55000 diamonds\n\n🛠️ *Source:* D.gray Man\n\n*#7*\n🔥 *Name:* Yae Miko\n🔩Tier: 6\n💰 *Price:* 65000 diamonds\n🛠️ *Source:* genshin impact\n\n*#8*\n🔥 *Name: Broly* \n🔩Tier: 6\n💰 *Price:* 50000 diamonds\n🛠️ *Source:* Drago Ball\n\n*#9*\n🔥 *Name:* Hayase Nagatoro\n🔩Tier: 6\n💰 *Price:*  45000 diamonds\n🛠️ *Source:* i dot know\n\n*#10*\n🔥 *Name:* Ace x Sabo x Luffy\n🔩Tier: 6\n💰 *Price:* 70000 diamonds\n🛠️ *Source:* One Piece\n\n*#11*\n🔥 *Name:* Denji dream\n🔩Tier: S\n💰 *Price:* 100000 diamonds\n🛠️ *Source:* Chainsaw Man\n\n*#12*\n🔥 *Name:* Love & Mist Hashira vs Upper Moons\n🔩Tier: S\n💰 *Price:* 120000 diamonds\n🛠️ *Source:* Demon Slayer\n\n🔰 *Note:* *Use :buy-card <Index_Number> to select your card.*\nEvery week This list will be updated`
        M.reply(shop)  
    }
            }
