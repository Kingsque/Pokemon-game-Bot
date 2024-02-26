module.exports = {
  name: "deldeck",
  aliases: ["deldeck"],
  exp: 0,
  react: "✅",
  category: "card game",
  description: "Delete all cards in deck",
  async execute(client, arg, M) {
    try {
      // Get the user's deck from the database
      const deck = await client.DB.get(`${M.sender}_Deck`);

      // Check if the deck is empty
      if (!deck || deck.length === 0) {
        return M.reply("Your deck is already empty!");
      }

      // Card position in the user's deck
      const position = parseInt(arg[0], 10) - 1;

      // Check if the user sent a valid number
      if (isNaN(position)) {
        return await M.reply('🔍 Please enter a valid index number for the card you want to view.');
      }

      // Check if the index is available in the user's deck
      if (position < 0 || position >= deck.length) {
        return await M.reply('🔍 Please enter a valid index number for the card you want to view.');
      }

      // Remove the selected card from the deck
      deck.splice(position, 1);
      console.log(deck);
      
      // Send a confirmation message
      return M.reply("Selected cards have been removed from your deck!");
    } catch (err) {
      // Handle errors
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`,
      });
    }
  },
};
