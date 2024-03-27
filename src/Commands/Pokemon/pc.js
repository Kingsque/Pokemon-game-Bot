module.exports = {
  name: "pc",
  aliases: ["pc"],
  exp: 0,
  cool: 4,
  react: "📋",
  category: "pokemon",
  description: "View your catched Pokémon",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      if (pc.length === 0) {
        return M.reply("📭 Your Pokémon collection is empty!");
      }

      let response = "📋 Your Pokémon Collection:\n";
      pc.forEach((pokemon, index) => {
        response += `${index + 1}. ${pokemon}\n`;
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
