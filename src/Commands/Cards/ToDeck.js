const axios = require("axios");
const path = require('path');
const ms = require('parse-ms');

module.exports = {
  name: "ToDeck",
  aliases: ["t2deck", "2deck"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "Send a card from collection to deck",
  async execute(client, arg, M) {
    const commandName = this.name || this.aliases[0];
    try {
      const commandName = this.name.toLowerCase();
      const now = Date.now(); // Get current timestamp
      const cooldownSeconds = this.cool;
      const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
    
      if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
          const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
          return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
      }

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
      
      await client.DB.set(`${M.sender}.todeck`, Date.now());
      
      const replyMsg = `Sent "${obj.title}" from your collection to your deck!\n\nCard Details:\nName: ${obj.title}\nTier: ${obj.tier}`;
      
      M.reply(replyMsg);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};
