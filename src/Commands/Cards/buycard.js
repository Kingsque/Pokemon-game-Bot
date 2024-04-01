module.exports = {
  name: "buycard",
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'buycard <saleID>',
  description: "Buys a card on sale",
  async execute(client, arg, M) {
    try {
      const shopID = parseInt(arg);
      if (isNaN(shopID)) {
        return M.reply("Invalid sale ID. Please use a valid sale ID.");
      }
      const saleData = await client.DB.get(`${M.from}.sell`, { shopID });
      if (!saleData) {
        return M.reply("Sale with that ID does not exist or has expired.");
      }
      const { seller, cardIndex, price } = saleData;

      const buyer = M.sender;
      const sellerDeck = await client.DB.get(`${seller}_Deck`) || [];
      const buyerDeck = await client.DB.get(`${buyer}_Deck`) || [];
      const wallet = await client.credit.get(`${buyer}.wallet`) || 0;

      if (wallet < price) {
        return M.reply("Not enough funds to make the purchase.");
      }

      await client.credit.add(`${seller}.wallet`, price);
      await client.credit.sub(`${buyer}.wallet`, price);

      buyerDeck.push(`${cardName}-${cardTier}`);
      sellerDeck.splice(cardIndex, 1);
      await client.DB.pull(`${M.from}.sell`, { shopID, seller, cardIndex, price });
      await client.DB.set(`${M.from}.sellInProgress`, false);
      M.reply(`Sale is done. User ${buyer} paid ${price} to ${seller} and bought the card.`);
    } catch (err) {
      console.error(err);
      await client.sendMessage(M.from, {
        image: { url: client.utils.errorChan() },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`,
      });
    }
  },
};
