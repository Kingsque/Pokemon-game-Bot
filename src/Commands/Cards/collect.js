module.exports = {
  name: "collect",
  aliases: ["c"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'Use :c <code>',
  description: "Claim the card that is spawned",
  async execute(client, arg, M) {
    try {
      const code = arg.trim(); // Get the code provided by the user
      if (!code) {
        return M.reply("Please provide the code to claim the card.");
      }

      // Check if the provided code matches the code stored in the database
      const storedCode = await client.cards.get(`${M.from}.code`);
      if (code !== storedCode) {
        return M.reply("Invalid code. Please check and try again.");
      }

      // Check if the card has already been claimed by three users
      const claimCount = await client.cards.get(`${M.from}.claim_count`) || 0;
      if (claimCount >= 3) {
        return M.reply("Sorry, this card has already been claimed by the maximum number of users.");
      }

      const card = await client.cards.get(`${M.from}.card`);
      const cardPrice = await client.cards.get(`${M.from}.card_price`);
      if (!card) {
        return M.reply("🙅‍♀️ Sorry, there are currently no available cards to claim!");
      }

      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;

      if (wallet === 0) {
        return M.reply("You have an empty wallet");
      }

      if (wallet < cardPrice) {
        return M.reply(`You don't have enough in your wallet. Current balance: ${wallet}`);
      }

      // Increment the claim count
      await client.cards.set(`${M.from}.claim_count`, claimCount + 1);

      // Deduct the card price from the user's wallet
      await client.credit.sub(`${M.sender}.wallet`, cardPrice);

      const [title, tier] = card.split("-");

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
        `🎉 You have successfully claimed *${title} - ${tier}* for *${cardPrice} Credits* ${text}`
      );

      // Check if the maximum claim count has been reached
      if (claimCount + 1 >= 3) {
        await M.reply("This card has been claimed by the maximum number of users.");
      }

      // Remove the user's claim count after a cooldown period
      setTimeout(async () => {
        await client.cards.delete(`${M.from}.claim_count`);
      }, 5 * 60 * 1000); // 5 minutes cooldown

      await client.cards.delete(`${M.from}.card`);
      await client.cards.delete(`${M.from}.card_price`);
      await client.cards.delete(`${M.from}.code`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
