module.exports = {
  name: "dex",
  aliases: ["dex"],
  exp: 0,
  cool: 4,
  react: "📖",
  category: "pokemon",
  description: "View your Pokémon Dex",
  async execute(client, arg, M) {
    try {
      const pc = await client.DB.get(`${M.sender}_PC`) || [];
      const party = await client.DB.get(`${M.sender}_Party`) || [];

      let dex = "📖 Your Pokémon Dex:\n";
      
      if (pc.length === 0 && party.length === 0) {
        dex += "Your Pokémon collection is empty!";
      } else {
        // Combine Pokémon from PC and party
        const allPokemons = [...party, ...pc];
        
        // Remove duplicate Pokémon
        const uniquePokemons = [...new Set(allPokemons)];

        // Generate dex entries for each unique Pokémon
        uniquePokemons.forEach((pokemon, index) => {
          dex += `${index + 1}. ${pokemon}\n`;
        });
      }

      await M.reply(dex);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
