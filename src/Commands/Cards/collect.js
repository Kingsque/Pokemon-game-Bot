module.exports = {
  name: "collect",
  aliases: ["c"],
  exp: 0,
  react: "✅",
  category: "card game",
  description: "Claim the card",
  async execute(client, arg, M) {
    const card = await client.cards.get(`${M.from}.card`);
    const cardPrice = await client.cards.get(`${M.from}.card_price`);
    const deck = await client.DB.get(`${M.sender}_Deck`) || [];
    const collection = await client.DB.get(`${M.sender}_Collection`) || [];
    const wallet = await client.cradit.get(`${M.sender}.wallet`) || 0;

    // Check if the user already has the card in their deck or collection
    if (deck.includes(card)) {
      return M.reply(`🛑 You already have the card 🃏 ${title} (Tier ${tier}) in your deck.`);
    } else if (collection.includes(card)) {
      return M.reply(`🛑 You already have the card 🃏 ${title} (Tier ${tier}) in your collection.`);
    }

    // Check if the card has already been claimed by another user
    const claimedCards = await client.DB.get('claimed-cards') || [];
    if (claimedCards.includes(card)) {
      return M.reply("This card has already been claimed by another user.");
    }

    try {
      if (!card) {
        return M.reply("🙅‍♀️ Sorry, there are currently no available cards to claim!");
      }

      if (wallet === 0) return M.reply("You have an empty wallet");

      if (wallet < cardPrice) return M.reply(`You don't have enough in your wallet ${wallet}`);

      const [title, tier] = card.split("-");

      // Deduct the card price from the user's wallet
      await client.cradit.sub(`${M.sender}.wallet`, cardPrice);

      let text = `🃏 ${title} (${tier}) has been safely stored in your deck!`;

      if (deck.length < 12) {
        deck.push(card);
      } else {
        text = `🃏 ${title} (${tier}) has been safely stored in your collection!`;
        collection.push(card);
      }

      await client.DB.set(`${M.sender}_Deck`, deck);
      await client.DB.set(`${M.sender}_Collection`, collection);

      await M.reply(
        '🎉 You have successfully claimed'.concat(
          ' *',
          title,
          ' - ',
          tier,
          '* for *',
          cardPrice,
          ' Credits* ',
          text
        )
      );
      await client.cards.delete(`${M.from}.card`);
      await client.cards.delete(`${M.from}.card_price`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
