module.exports = {
  name: "t2party",
  aliases: ["t2party"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Transfer a Pokémon from your PC to your party",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];

      if (pc.length === 0) {
        return M.reply("⚠️ Your PC is empty!");
      }

      const index = parseInt(arg) - 1;

      if (isNaN(index) || index < 0 || index >= pc.length) {
        return M.reply("⚠️ Please provide a valid position of the Pokémon in your PC to transfer!");
      }

      const pokemon = pc[index];
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (party.length >= 6) {
        return M.reply("⚠️ Your party is already full! You cannot transfer more Pokémon to your party.");
      }

      pc.splice(index, 1);
      party.push(pokemon);

      await client.DB.set(`${M.sender}_PC`, pc);
      await client.DB.set(`${M.sender}_Party`, party);
      await M.reply(`✅ ${pokemon} transferred from PC to party successfully!`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
