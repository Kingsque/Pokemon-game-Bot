const axios = require("axios");
const path = require('path');

module.exports = {
  name: "ToDeck",
  aliases: ["t2deck", "2deck"],
  exp: 0,
  react: "✅",
  category: "card game",
  description: "Send a card from collection to deck",
  async execute(client, arg, M) {
    try {
      const index = parseInt(arg) - 1; // The index in the array is 0-based
      
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      
      if (collection.length === 0) {
        return M.reply("I'm sorry, it appears that you currently don't have any cards in your collection. 😔 Keep collecting more cards to expand your collection! 🃏");
      }
      
      if (isNaN(index) || index < 0 || index >= collection.length) {
        return M.reply(`Invalid card index. Your collection has ${collection.length} cards.`);
      }
      
      const card = collection[index];
      
      if (deck.length === 12) {
        return M.reply("Your deck is full");
      }
      
      collection.splice(index, 1);
      deck.push(card);
      
      await client.DB.set(`${M.sender}_Collection`, collection);
      await client.DB.set(`${M.sender}_Deck`, deck);
      
      const filePath = path.join(__dirname, '../../Handlers/card.json');
      const data = require(filePath);
      const newArray = data.filter(function (I) {
        return I.tier == card.split("-")[1];
      });
      
      const obj = newArray.find((cardData) => cardData.title.toLowerCase() === card.split("-")[0].toLowerCase());
      
      let urlImage = obj.url;
      
      await client.sendMessage(M.from, { image: { url: urlImage }, caption: `Sent "${obj.title}" from your collection to your deck! 🃏🔀\n\n👉 Card Details:\nName: ${obj.title}\nTier: ${obj.tier}` }, { quoted: M });
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};
