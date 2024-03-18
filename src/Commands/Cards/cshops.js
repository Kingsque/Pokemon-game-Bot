const cardData = [
    { name: "Madara", tier: 6, price: 50000, source: "Naruto" },
    { name: "Goku", tier: 6, price: 40000, source: "Dragon Ball" },
    { name: "Yuji Itadori and Sukuna", tier: 6, price: 45000, source: "Jujutsu Kaisen" },
    { name: "Tanjiro", tier: 6, price: 60000, source: "Demon Slayer" },
    { name: "Genos", tier: 6, price: 40000, source: "One Punch Man" },
    { name: "Allen Walker", tier: 6, price: 55000, source: "D.gray Man" },
    { name: "Yae Miko", tier: 6, price: 65000, source: "Genshin Impact" },
    { name: "Broly", tier: 6, price: 50000, source: "Dragon Ball" },
    { name: "Hayase Nagatoro", tier: 6, price: 45000, source: "Unknown" },
    { name: "Ace x Sabo x Luffy", tier: 6, price: 70000, source: "One Piece" }
];

module.exports = {
    name: 'card-shop',
    aliases: ['cshop'],
    category: 'card game',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows available card shop items',
    async execute(client, arg, M) {
        let shop =  `⛺ *|------< CARD SHOP >-------|* ⛺\n\n🎉 *Welcome to our card shop. Here are the list of available cards:* 🎉\n\n`;

        cardData.forEach((card, index) => {
            shop += `*#${index + 1}*\n🔥 *Name:* ${card.name}\n🔩 *Tier:* ${card.tier}\n💰 *Price:* ${card.price} diamonds\n🛠️ *Source:* ${card.source}\n\n`;
        });

        shop += `🔰 *Note:* *Use :buy-card <Index_Number> to select your card.*\nEvery week, this list will be updated.`;
        M.reply(shop); 
    }
};
