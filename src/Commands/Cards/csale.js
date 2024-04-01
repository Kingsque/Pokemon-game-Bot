module.exports = {
  name: "csale",
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: ':csale',
  description: "Cancels a card sale",
  async execute(client, arg, M) {
    try {
      const saleData = await client.DB.get(`${M.from}.sell`, { shopID });
      if (!saleData) {
        return M.reply("Sale with that ID does not exist or has expired.");
      }
      const { seller, cardIndex, price } = saleData;
      if (M.sender === seller) {
        await client.DB.pull(`${M.from}.sell`, { shopID, seller, cardIndex, price });
        await client.DB.set(`${M.from}.sellInProgress`, false);
        M.reply("Sale canceled");
      } else {
        M.reply("You haven't started the sale, so you cannot cancel it.");
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
