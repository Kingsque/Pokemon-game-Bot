const axios = require("axios");
const path = require('path');

module.exports = {
  name: "card",
  aliases: ["cards"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "View all your cards, mixed from deck and collection",
  async execute(client, arg, M) {
    const collection = await client.DB.get(`${M.sender}_Collection`) || [];
    const deck = await client.DB.get(`${M.sender}_Deck`) || [];
    
    try {
      if (collection.length === 0 && deck.length === 0) {
        return M.reply("Sorry, you don't have any cards in your collection and deck.");
      }

      let tag = M.sender.substring(3, 7);
      let tr = `*🃏 Name:* ${(await client.contact.getContact(M.sender, client)).username} #${tag}*\n\n`;

      // Display deck cards first
      if (deck.length > 0) {
        deck.forEach((card, index) => {
          const [name, tier] = card.split("-");
          tr += `${index + 1}. ${name} (Tier: ${tier})\n`;
        });
      }

      // Display collection cards
      if (collection.length > 0) {
        collection.forEach((card, index) => {
          const [name, tier] = card.split("-");
          tr += `${index + 1}. ${name} (Tier: ${tier})\n`;
        });
      }

      // Select the image or link of the first card in deck
      const firstDeckCard = deck.length > 0 ? deck[0].split("-") : null;
      const filePath = path.join(__dirname, '../../Helpers/card.json');
      const data = require(filePath);
      const matchingCards = data.filter(function (cardData) {
        return cardData.tier == firstDeckCard[1] && cardData.title == firstDeckCard[0];
      });
      const imageUrl = matchingCards.length > 0 ? matchingCards[0].url : '';

      if (imageUrl.endsWith(".gif")) {
        return await client.sendMessage(M.from, { video: { url: imageUrl }, caption: tr, gifPlayback: true }, { quoted: M });
      } else if (imageUrl) {
        return await client.sendMessage(M.from, { image: { url: imageUrl }, caption: tr }, { quoted: M });
      } else {
        return M.reply("Error: Unable to find an image for the first card in your deck.");
      }
    } catch(err) {
      await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`});
    }
  },
};
