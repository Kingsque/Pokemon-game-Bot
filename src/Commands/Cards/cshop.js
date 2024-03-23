const cardData = [
    { name: "Madara", tier: 6, price: 50000, source: "Naruto" },
    { name: "Goku", tier: 6, price: 40000, source: "Dragon Ball" },
    { name: "Gojo Saturo", tier: 6, price: 45000, source: "Jujutsu Kaisen" },
    { name: "Tanjiro Kamado", tier: 6, price: 60000, source: "Demon Slayer" },
    { name: "Genos", tier: 6, price: 40000, source: "One Punch Man" },
    { name: "Allen Walker", tier: 6, price: 55000, source: "D.gray Man" },
    { name: "Yae Miko", tier: 6, price: 65000, source: "Genshin Impact" },
    { name: "Broly", tier: 6, price: 50000, source: "Dragon Ball" },
    { name: "Hayase Nagataro", tier: 6, price: 45000, source: "Unknown" },
    { name: "Ace x Sabo x Luffy", tier: 6, price: 70000, source: "One Piece" }
];

module.exports = {
    name: "buy-card",
    aliases: ["b-c"],
    exp: 0,
    cool: 4,
    react: "✅",
    category: "card game",
    description: 'To buy cards from card shop',
    async execute(client, arg, M) {
        const index = parseInt(arg);
        
        if (isNaN(index) || index < 1 || index > cardData.length) {
            return M.reply("Invalid card number.");
        }

        const card = cardData[index - 1];
        let dime = await client.rpg.get(`${M.sender}.diamond`) || 0;

        if (dime < card.price) {
            return M.reply("You don't have enough diamonds.");
        }

        await client.DB.push(`${M.sender}_Collection`, `${card.name}-6`);
        await client.rpg.sub(`${M.sender}.diamond`, card.price);
        M.reply(`You have successfully purchased ${card.name}. It's in your collection.`);
    }
};
