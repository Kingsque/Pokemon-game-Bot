module.exports = {
  name: "collect",
  aliases: ["collect"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'Use :collect <code>',
  description: "Claim the card that is spawned",
  async execute(client, arg, M) {
    try {
      const codes = parseInt(arg); // Get the code provided by the user
      if (!codes) {
        return M.reply("Please provide the code to claim the card.");
      }

      const code = client.cards.get(`${M.from}.code`);
      const card = client.cards.get(`${M.from}.card`);
      const price = client.cards.get(`${M.from}.price`);

      if (!card) {
        return M.reply("There are no cards available to claim.");
      }

      if (codes !== code) {
        return M.reply("Invalid code. Please check and try again.");
      }

      const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;

      if (wallet < price) {
        return M.reply(`You don't have enough credits in your wallet. Current balance: ${wallet}`);
      }

      await client.credit.sub(`${M.sender}.wallet`, price);

      const [title, tier] = card.split("-");
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const maxDeckSize = 12;

      if (deck.length < maxDeckSize) {
        deck.push(card);
        await client.DB.set(`${M.sender}_Deck`, deck);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${price} Credits*. It has been added to your deck.`);
      } else {
        collection.push(card);
        await client.DB.set(`${M.sender}_Collection`, collection);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${price} Credits*. It has been added to your collection.`);
      }

      await client.cards.delete(`${M.from}.card`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
