module.exports = {
  name: "t2pc",
  aliases: ["t2pc"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Transfer a Pokémon from your party to your PC",
  async execute(client, arg, M) {
    try {
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (party.length === 0) {
        return M.reply("⚠️ Your party is empty!");
      }

      const index = parseInt(arg) - 1;

      if (isNaN(index) || index < 0 || index >= party.length) {
        return M.reply("⚠️ Please provide a valid position of the Pokémon in your party to transfer!");
      }

      const pokemon = party[index];
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      pc.push(pokemon);
      party.splice(index, 1);

      await client.DB.set(`${M.sender}_PC`, pc);
      await client.DB.set(`${M.sender}_Party`, party);
      await M.reply(`✅ ${pokemon} transferred from party to PC successfully!`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
