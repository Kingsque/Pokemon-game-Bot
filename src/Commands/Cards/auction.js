const axios = require("axios");
const path = require('path');

module.exports = {
  name: "auction",
  aliases: ["auction"],
  exp: 0,
  cool: 5,
  react: "✅",
  category: "card game",
  description: "Starts card auction",
  async execute(client, arg, M) {
    try {
      const auctionInProgress = await client.DB.get(`${M.from}.auctionInProgress`);
      if (auctionInProgress) {
        return M.reply("An auction is already in progress.");
      }

      const splitArgs = arg.split('|');
      if (splitArgs.length !== 2) {
        return M.reply("Please provide both the card index and the starting price separated by '|' (e.g., 1|100).");
      }

      const cardIndex = parseInt(splitArgs[0]) - 1;
      const price = parseInt(splitArgs[1]);

      if (isNaN(cardIndex) || cardIndex < 0) {
        return M.reply("Please provide a valid card index.");
      }

      if (isNaN(price) || price <= 0) {
        return M.reply("Please provide a valid starting price.");
      }

      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      if (deck.length === 0) {
        return M.reply("You do not have any cards in your deck.");
      }

      if (cardIndex >= deck.length) {
        return M.reply("The card index you provided is invalid.");
      }

      const cardToSell = deck[cardIndex].split('-');
      const filePath = path.join(__dirname, '../../storages/card.json');
      const cardDataJson = require(filePath);
      const cardsInTier = cardDataJson.filter((card) => card.tier === cardToSell[1]);
      const cardData = cardsInTier.find((card) => card.title === cardToSell[0]);
      if (!cardData) {
        return M.reply("The card data could not be found.");
      }

      const imageUrl = cardData.url;
      const text = `💎 *Card on Auction* 💎\n\n🌊 *Name:* ${cardData.title}\n\n🌟 *Tier:* ${cardData.tier}\n\n📝 *Price:* ${price}\n\n🎉 *Highest bidder gets the card* 🎉\n\n🔰 Use :bid <amount> to bid`;

      const file = await client.utils.getBuffer(imageUrl);
      const isGif = imageUrl.endsWith('.gif');

      if (isGif) {
        const giffed = await client.utils.gifToMp4(file);
        await client.sendMessage(M.from, { video: giffed, gifPlayback: true, caption: text }, { quoted: M });
      } else {
        await client.sendMessage(M.from, { image: file, caption: text }, { quoted: M });
      }

      await client.credit.set(`${M.from}.bid`, price);
      await client.DB.set(`${M.from}.auctionInProgress`, true);

      setTimeout(async () => {
        const bid = await client.credit.get(`${M.from}.bid`);
        const winner = await client.DB.get(`${M.from}.auctionWinner`);
        if (!winner) {
          return M.reply('No one bid, so the auction is won by mods.');
        } else {
          await client.credit.sub(`${winner}.wallet`, bid);
          await client.DB.push(`${winner}_Collection`, `${cardData.title}-${cardData.tier}`);
          await client.DB.delete(`${M.from}.auctionWinner`);
          await client.credit.delete(`${M.from}.bid`);
          await client.DB.delete(`${M.from}.auctionInProgress`);
          M.reply(`The card ${cardData.title} of tier ${cardData.tier} is won by ${winner} with a bid of ${bid}. It has been added to your collection.`);
        }
      }, 15 * 60 * 1000); 
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: client.utils.errorChan() }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};