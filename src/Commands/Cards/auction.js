const axios = require("axios");
const path = require('path');

module.exports = {
  name: "auction",
  aliases: ["auction"],
  exp: 0,
  cool: 5,
  react: "✅",
  category: "card game",
  description: "Starts or ends a card auction",
  async execute(client, arg, M) {
    try {
      if (arg === 'start') {
        const auctionInProgress = await client.DB.get(`${M.from}.auctionInProgress`);
        if (auctionInProgress) {
          return M.reply("An auction is already in progress. You cannot start a new one.");
        }
        
        const deck = await client.DB.get(`${M.sender}_Deck`) || [];
        if (deck.length === 0) {
          return M.reply("You do not have any cards in your deck to auction.");
        }

        const cardIndex = parseInt(arg) - 1;
        if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= deck.length) {
          return M.reply("Please provide a valid card index to auction.");
        }

        const cardToSell = deck[cardIndex].split('-');
        const filePath = path.join(__dirname, '../../Helpers/card.json');
        const cardDataJson = require(filePath);
        const cardData = cardDataJson.find((card) => card.title === cardToSell[0]);
        if (!cardData) {
          return M.reply("The card data could not be found.");
        }

        let startingPrice;
        switch (cardData.tier) {
          case 't5':
            startingPrice = 20000;
            break;
          case 't6':
            startingPrice = 50000;
            break;
          case 'tS':
            startingPrice = 100000;
            break;
          default:
            startingPrice = 10000; // Default starting price for other tiers
            break;
        }

        const imageUrl = cardData.url;
        const text = `💎 *Card on Auction* 💎\n\n🌊 *Name:* ${cardData.title}\n\n🌟 *Tier:* ${cardData.tier}\n\n📝 *Price:* ${startingPrice}\n\n🎉 *Highest bidder gets the card* 🎉\n\n🔰 Use :bid <amount> to bid`;

        const file = await client.utils.getBuffer(imageUrl);
        const isGif = imageUrl.endsWith('.gif');

        if (isGif) {
          const giffed = await client.utils.gifToMp4(file);
          await client.sendMessage(M.from, { video: giffed, gifPlayback: true, caption: text }, { quoted: M });
        } else {
          await client.sendMessage(M.from, { image: file, caption: text }, { quoted: M });
        }

        await client.credit.set(`${M.from}.bid`, startingPrice);
        await client.DB.set(`${M.from}.auctionInProgress`, true);
        await client.DB.set(`${M.from}.auctionCardIndex`, cardIndex);
        return;
      }

      if (arg === 'end') {
        const bid = await client.credit.get(`${M.from}.bid`);
        const winner = await client.DB.get(`${M.from}.auctionWinner`);
        if (!winner) {
          return M.reply('No one bid, so the auction is won by mods.');
        } else {
          const cardIndex = await client.DB.get(`${M.from}.auctionCardIndex`);
          const deck = await client.DB.get(`${M.sender}_Deck`) || [];
          const cardToSell = deck[cardIndex].split('-');
          const filePath = path.join(__dirname, '../../Helpers/card.json');
          const cardDataJson = require(filePath);
          const cardData = cardDataJson.find((card) => card.title === cardToSell[0]);

          await client.credit.sub(`${winner}.wallet`, bid);
          await client.DB.push(`${winner}_Collection`, `${cardData.title}-${cardData.tier}`);
          await client.DB.delete(`${M.from}.auctionWinner`);
          await client.credit.delete(`${M.from}.bid`);
          await client.DB.delete(`${M.from}.auctionInProgress`);
          await client.DB.delete(`${M.from}.auctionCardIndex`);

          M.reply(`The auction for ${cardData.title} of tier ${cardData.tier} is won by ${winner} with a bid of ${bid}. It has been added to the winner's collection.`);
        }
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: client.utils.errorChan() }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};
        
