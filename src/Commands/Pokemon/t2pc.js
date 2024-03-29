// t2pc command
module.exports = {
  name: "t2pc",
  aliases: ["t2pc"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Move a Pokémon from Party to PC",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (pc.length >= 30) {
        return M.reply("🚫 Your PC is already full! You cannot add more Pokémon.");
      }

      const pokemonName = arg.toLowerCase();
      const pokemonIndex = party.findIndex(p => p.toLowerCase() === pokemonName);
      if (pokemonIndex === -1) {
        return M.reply(`🚫 Pokémon '${arg}' not found in your party!`);
      }

      const movedPokemon = party.splice(pokemonIndex, 1)[0];
      pc.push(movedPokemon);

      await client.DB.set(`${M.sender}_PC`, pc);
      await client.DB.set(`${M.sender}_Party`, party);

      await M.reply(`🔄 Moved ${movedPokemon} from your party to PC successfully!`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
