module.exports = {
  name: "swap",
  aliases: ["swap"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Swap positions of two Pokémon in your party",
  async execute(client, arg, M) {
    try {
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      // Check if the party has less than two Pokémon
      if (party.length < 2) {
        return M.reply("🚫 Your party must have at least two Pokémon to swap!");
      }

      // Parse arguments: swap <index1> <index2>
      const [index1, index2] = arg.trim().split(/\s+/).map(Number);

      // Check if arguments are valid indices
      if (isNaN(index1) || isNaN(index2) || index1 < 1 || index2 < 1 || index1 > party.length || index2 > party.length || index1 === index2) {
        return M.reply("🚫 Please provide two valid indices to swap the positions of Pokémon in your party!");
      }

      // Swap the positions of the Pokémon
      [party[index1 - 1], party[index2 - 1]] = [party[index2 - 1], party[index1 - 1]];

      // Update the party in the database
      await client.DB.set(`${M.sender}_Party`, party);

      await M.reply(`🔄 Swapped positions of Pokémon ${index1} and ${index2} in your party successfully!`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
