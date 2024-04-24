const { Card } = require("../Database");

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
      const card = await Card.findOne({ jid: M.from });
      if (!card) {
        return M.reply("🙅‍♀️ Sorry, there are currently no available cards to claim!");
      }
      const { card_price } = card;

      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;

      if (wallet === 0) {
        return M.reply("You have an empty wallet");
      }

      if (wallet < card_price) {
        return M.reply(`You don't have enough in your wallet. Current balance: ${wallet}`);
      }

      // Deduct the card price from the user's wallet
      await client.credit.sub(`${M.sender}.wallet`, card_price);

      const [title, tier] = card.getcard.split("-");

      let text = `🃏 ${title} (${tier}) has been safely stored in your deck!`;

      if (deck.length < 12) {
        deck.push(getcard);
      } else {
        text = `🃏 ${title} (${tier}) has been safely stored in your collection!`;
        collection.push(getcard);
      }

      await client.DB.set(`${M.sender}_Deck`, deck);
      await client.DB.set(`${M.sender}_Collection`, collection);

      await M.reply(
        `🎉 You have successfully claimed *${title} - ${tier}* for *${cardPrice} Credits* ${text}`
      );

      await Card.findOneAndUpdate(
							{ jid: M.from },
							{
								$unset: {
									Getcard: '',
									card_price: ''
								}
							}
							);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
