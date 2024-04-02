module.exports = {
  name: 'cardswap',
  aliases: ['cswap'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'card game',
  usage: 'Use :cardswap <index1> <index2>',
  description: 'Swap the positions of two cards in your deck',
  async execute(client, arg, M) {
    const deck = await client.DB.get(`${M.sender}_Deck`);
    if (!deck || deck.length === 0) {
      M.reply('No Deck Found');
      return;
    }

    // Check if both indexes are provided
    if (!arg || arg.length !== 2) {
      M.reply('Please provide two card indexes to swap.');
      return;
    }

    const [index1, index2] = arg.map(i => parseInt(i) - 1); // Adjusting to 0-based index
    if (isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0 || index1 >= deck.length || index2 >= deck.length) {
      M.reply(`Invalid card indexes. Your deck has ${deck.length} cards.`);
      return;
    }

    // Swap the positions of the cards
    const temp = deck[index1];
    deck[index1] = deck[index2];
    deck[index2] = temp;

    // Update the deck in the database
    await client.DB.set(`${M.sender}_Deck`, deck);

    M.reply(`Successfully swapped the positions of cards at indexes ${index1 + 1} and ${index2 + 1}.`);
  },
};
