module.exports = {
  name: "swap",
  aliases: ["swap"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Swap the positions of two Pokémon in your party",
  async execute(client, arg, M) {
    try {
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (party.length < 2) {
        return M.reply("⚠️ You need at least two Pokémon in your party to swap positions!");
      }

      const [index1, index2] = arg.split(",").map(Number);

      if (!Number.isInteger(index1) || !Number.isInteger(index2) || index1 < 1 || index2 < 1 || index1 > party.length || index2 > party.length) {
        return M.reply("⚠️ Please provide valid positions to swap!");
      }

      const temp = party[index1 - 1];
      party[index1 - 1] = party[index2 - 1];
      party[index2 - 1] = temp;

      await client.DB.set(`${M.sender}_Party`, party);
      await M.reply("✅ Pokémon positions swapped successfully!");
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
