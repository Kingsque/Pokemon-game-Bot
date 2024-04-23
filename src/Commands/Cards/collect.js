const { Card } = require("../../Database");

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
      const code = parseInt(arg); // Get the code provided by the user
      if (!code) {
        return M.reply("Please provide the code to claim the card.");
      }

      const card = await Card.findOne({ jid: M.from });
      if (!card) {
        return M.reply(
          "🙅‍♀️ Sorry, there are currently no available cards to claim. Please try again later!"
        );
      }

      const { card_price, card_code, claimed } = card;
      const Getcard = card.card

      if (claimed) {
        return M.reply("🛑 Sorry, this card has already been claimed by another user.");
      }

      card.claimed = M.sender;
      await card.save();

      if (card_code !== code) { // Compare provided code with the code from the database
        return M.reply("Invalid code. Please check and try again.");
      }

      const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;

      if (wallet < card_price) {
        return M.reply(`You don't have enough credits in your wallet. Current balance: ${wallet}`);
      }

      await client.credit.sub(`${M.sender}.wallet`, card_price);

      const [title, tier] = Getcard.split("-");
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const maxDeckSize = 12;

      if (deck.length < maxDeckSize) {
        deck.push(Getcard);
        await client.DB.set(`${M.sender}_Deck`, deck);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${card_price} Credits*. It has been added to your deck.`);
      } else {
        collection.push(Getcard);
        await client.DB.set(`${M.sender}_Collection`, collection);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${card_price} Credits*. It has been added to your collection.`);
      }

      await Card.findOneAndDelete({ jid: M.from });
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
