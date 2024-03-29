module.exports = {
  name: "dex",
  aliases: ["dex"],
  exp: 0,
  cool: 4,
  react: "📋",
  category: "pokemon",
  description: "View all caught Pokémon in your PC and party along with their levels",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (pc.length === 0 && party.length === 0) {
        return M.reply("📭 Your Pokémon collection is empty!");
      }

      let response = "📋 Your Pokémon Collection:\n";

      pc.forEach((pokemon, index) => {
        const [name, level] = pokemon.split("-");
        response += `${index + 1}. ${name} (Level ${level})\n`;
      });

      party.forEach((pokemon, index) => {
        const [name, level] = pokemon.split("-");
        response += `${pc.length + index + 1}. ${name} (Level ${level})\n`;
      });

      await M.reply(response);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
