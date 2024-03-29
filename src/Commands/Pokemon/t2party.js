// t2party command
module.exports = {
  name: "t2party",
  aliases: ["t2party"],
  exp: 0,
  cool: 4,
  react: "🔄",
  category: "pokemon",
  description: "Move a Pokémon from PC to Party",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      if (party.length >= 6) {
        return M.reply("🚫 Your party is already full! You cannot add more Pokémon.");
      }

      const pokemonName = arg.toLowerCase();
      const pokemonIndex = pc.findIndex(p => p.toLowerCase() === pokemonName);
      if (pokemonIndex === -1) {
        return M.reply(`🚫 Pokémon '${arg}' not found in your PC!`);
      }

      const movedPokemon = pc.splice(pokemonIndex, 1)[0];
      party.push(movedPokemon);

      await client.DB.set(`${M.sender}_PC`, pc);
      await client.DB.set(`${M.sender}_Party`, party);

      await M.reply(`🔄 Moved ${movedPokemon} from PC to your party successfully!`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
