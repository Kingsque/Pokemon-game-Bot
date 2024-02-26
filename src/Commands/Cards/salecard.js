const axios = require("axios");
const path = require('path');

module.exports = {
  name: "sellcard",
  aliases: ["buycard", "csale"],
  exp: 0,
  react: "✅",
  category: "card game",
  description: "sales/buys or cancels card sales",
  async execute(client, arg, M) {
    const selling = await client.DB.get(`${M.from}.sellInProgress`) || true;
    if (!selling) return M.reply("Sale is going on already")

    try {
      const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim();
      if (command === 'salecard') {
        const seller = M.sender.jid;
        const splitArgs = arg.split('|');
        if (splitArgs.length !== 2) {
          return M.reply("Please provide both index and price in the format 'index|price'.");
        }
        const cardIndex = parseInt(splitArgs[0]) - 1;
        const price = splitArgs[1];
        const deck = await client.DB.get(`${M.sender}_Deck`) || [];
        if (!deck || !deck.length) {
          return M.reply("❗ You do not have any cards in your deck!");
        }
        const cardToSell = deck[cardIndex]?.split('-');
        if (!cardToSell) {
          return M.reply("❗ The card index you provided is invalid!");
        }
        const filePath = path.join(__dirname, '../../Handlers/card.json');
        const data = require(filePath);
        const cardsInTier = data.filter((cardData) => cardData.tier === cardToSell[1]);
        const cardData = cardsInTier.find((cardData) => cardData.title === cardToSell[0]);
        if (!cardData) {
          return M.reply("❗ Card data not found.");
        }
        const cardUrl = cardData.url;
        const cardName = cardData.title;
        const cardTier = cardData.tier;
        const shopID = client.utils.getRandomInt(10000, 99999);
        const imageUrl = cardUrl;
        let isGif = imageUrl.endsWith('.gif');
        const file = await client.utils.getBuffer(imageUrl);
        const text = `💎Card on sale💎\n\n🌊 Name: ${cardName}\n\n🌟 Tier: ${cardTier}\n\n📝 Price: ${price}\n\n🎉 ID: ${shopID}\n\n🔰 Use :buycard <saleID> to get the card`;

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

        await client.DB.push(`${M.sender}.sell`, { shopID, seller, cardIndex, price });
        await client.DB.set(`${M.from}.sellInProgress`, true);

        // Set a timeout to delete the sale after 10 minutes (600,000 milliseconds)
        setTimeout(async () => {
          await client.DB.pull(`${M.sender}.sell`, { shopID, seller, cardIndex, price });
          M.reply(`Sale with ID ${shopID} has expired and is now deleted.`);
        }, 600000);
      } else if (command === 'buycard') {
        const shopID = parseInt(arg);
        if (isNaN(shopID)) {
          return M.reply("Invalid sale ID. Please use a valid sale ID.");
        }
        const saleData = await client.DB.get(`${M.sender}.sell`, { shopID });
        if (!saleData) {
          return M.reply("Sale with that ID does not exist or has expired.");
        }
        const { seller, cardIndex, price } = saleData; // Removed unnecessary properties

        const buyer = M.sender;
        const sellerDeck = await client.DB.get(`${seller}_Deck`) || [];
        const buyerDeck = await client.DB.get(`${buyer}_Deck`) || [];
        const wallet = await client.DB.get(`${buyer}.wallet`) || 0;

        if (wallet < price) {
          return M.reply("Not enough funds to make the purchase.");
        }

        await client.DB.add(`${seller}.wallet`, price);
        await client.DB.subtract(`${buyer}.wallet`, price);

        buyerDeck.push(`${cardName}-${cardTier}`);
        sellerDeck.splice(cardIndex, 1);
        await client.DB.pull(`${M.sender}.sell`, { shopID, seller, cardIndex, price });
        await client.DB.set(`${M.from}.sellInProgress`, false);
        M.reply(`Sale is done. User ${buyer} paid ${price} to ${seller} and bought the card.`);
      } else if (command === 'csale') {
        const saleData = await client.DB.get(`${M.sender}.sell`, { shopID });
        if (!saleData) {
          return M.reply("Sale with that ID does not exist or has expired.");
        }
        const { seller, cardIndex, price } = saleData;
        if (M.sender !== seller) return M.reply("You cannot cancel as u didnt started");
        await client.DB.pull(`${M.sender}.sell`, { shopID, seller, cardIndex, price });
         await client.DB.set(`${M.from}.sellInProgress`, false);
        M.reply("Sale canceled");
      }
    } catch (err) {
      console.error(err);
      await client.sendMessage(M.from, {
        image: { url: client.utils.errorChan() },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`,
      });
    }
  },
};
