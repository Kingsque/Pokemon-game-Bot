module.exports = {
  name: "collect",
  aliases: ["c"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'Use :c',
  description: "Claim the card that is spawned",
  async execute(client, arg, M) {
    try {
      const card = await client.cardMap.get(M.from);
     if (!card) {
        return M.reply("🙅‍♀️ Sorry, there are currently no available cards to claim!");
      }

      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const userId = M.sender;
      const economy = await client.econ.findOne({ userId });

      let wallet = economy ? economy.gem : 0;
      
      if (wallet === 0) {
        return M.reply("You have an empty wallet");
      }

      if (wallet < cardPrice) {
        return M.reply(`You don't have enough in your wallet. Current balance: ${wallet}`);
      }

      // Deduct the card price from the user's wallet
      wallet -= cardPrice;
      
      const [title, tier] = card.card.split("-");

      let text = `🃏 ${title} (${tier}) has been safely stored in your deck!`;

      if (deck.length < 12) {
        deck.push(card.card);
      } else {
        text = `🃏 ${title} (${tier}) has been safely stored in your collection!`;
        collection.push(card.card);
      }

      await client.DB.set(`${M.sender}_Deck`, deck);
      await client.DB.set(`${M.sender}_Collection`, collection);

      await M.reply(
        `🎉 You have successfully claimed *${title} - ${tier}* for *${cardPrice} Credits* ${text}`
      );

      await client.cards.delete(`${M.from}.card`);
      await client.cards.delete(`${M.from}.card_price`);
      if (economy) {
        economy.gem = wallet;
        await economy.save();
      }
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Mai Sakurajima Dis\n\nError:\n${err}`
      });
    }
  },
};
