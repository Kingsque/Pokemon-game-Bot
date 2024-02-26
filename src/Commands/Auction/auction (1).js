const axios = require("axios");
const path = require('path');

module.exports = {
  name: "auction",
  aliases: ["auction"],
  exp: 0,
  react: "✅",
  category: "auction",
  description: "Starts card auction",
  async execute(client, arg, M) {
    try {
      const auc = await client.DB.get(`${M.from}.auctionInProgress`) || true;
       if (!auc) return M.reply("A auction is already going on");

      const auction = (await client.DB.get('auction')) || [];
      if (!auction.includes(M.from)) return M.reply(`Join the auction group by using ${client.prefix}support`);

      const splitArgs = arg.split('|');
      if (!splitArgs[0] || !splitArgs[1]) {
        return M.reply("Please provide both index and price.");
      }
      const cardIndex = parseInt(splitArgs[0]) - 1;
      const price = splitArgs[1];

      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      if (!deck || !deck.length) {
        return M.reply("❗ You do not have any cards in your deck!");
      }

      if (cardIndex < 0 || cardIndex >= deck.length) {
        return M.reply("❗ The card index you provided is invalid!");
      }

      const cardToSell = deck[cardIndex].split('-');
      const filePath = path.join(__dirname, '../../Handlers/card.json');
      const data = require(filePath);
      const cardsInTier = data.filter((cardData) => cardData.tier === cardToSell[1]);
      const cardData = cardsInTier.find((cardData) => cardData.title === cardToSell[0]);

      if (!cardData) {
        return M.reply("❗ The card data could not be found!");
      }

      const cardUrl = cardData.url;
      const cardName = cardData.title;
      const cardTier = cardData.tier;
      
      const imageUrl = cardUrl;
      let isGif = imageUrl.endsWith('.gif');

      const file = await client.utils.getBuffer(imageUrl);
      const text = `💎 *Card on Auction* 💎\n\n🌊 *Name:* ${cardName}\n\n🌟 *Tier:* ${cardTier}\n\n📝 *Price:* ${price}\n\n🎉 *Highest bidder gets the card* 🎉\n\n🔰 Use :bid <amount> to bid`;

      if (isGif) {
        const giffed = await client.utils.gifToMp4(file);
        await client.sendMessage(M.from, {
          video: giffed,
          gifPlayback: true,
          caption: text
        }, { quoted: M });
      } else {
        await client.sendMessage(M.from, {
          image: file,
          caption: text
        }, { quoted: M });
      }

      await client.cradit.set(`${M.from}.bid`, price);
      await client.DB.get(`${M.from}.auctionInProgress`, true);


      // Set a timeout for 15 minutes
      setTimeout(async () => {
        const bid = await client.cradit.get(`${M.from}.bid`);
        const winner = await client.DB.get(`${M.from}.auctionWinner`);
        if (!winner) {
          return M.reply('No one bid, so Auction won by mods');
        } else {
          await client.cradit.sub(`${winner}.wallet`, bid);
          await client.DB.push(`${winner}_Collection`, `${cardName}-${cardTier}`);
          await client.DB.delete(`${M.from}.auctionWinner`);
          await client.cradit.delete(`${M.from}.bid`);
          await client.DB.get(`${M.from}.auctionInProgress`, false);
          M.reply(`The card ${cardName} of tier ${cardTier} is won by ${winner} by bidding ${bid} its succesfully added to your coll`);
        }
      }, 15 * 60 * 1000); // 15 minutes in milliseconds
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: client.utils.errorChan() }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};
