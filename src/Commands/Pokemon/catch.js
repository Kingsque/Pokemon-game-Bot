module.exports = {
  name: "catch",
  aliases: ["catch"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "pokemon",
  description: "Catch the spawned Pokémon",
  async execute(client, arg, M) {
    try {
      const pokemon = await client.DB.get(`${M.from}.pokemon`); // Retrieve spawned Pokémon
      if (!pokemon) {
        return M.reply("🙅‍♂️ Sorry, there are currently no Pokémon available to catch!");
      }

      // Check if the argument matches the spawned Pokémon name
      if (arg.toLowerCase() === pokemon.toLowerCase()) {
        // Proceed to catch the Pokémon
        const pc = await client.DB.get(`${M.sender}_PC`) || [];
        pc.push(pokemon); // Add Pokémon to PC
        await client.DB.set(`${M.sender}_PC`, pc);

        await M.reply(`🎉 You have successfully caught ${pokemon} and stored it in your PC!`);
        
        // Delete the spawned Pokémon from the database
        await client.DB.delete(`${M.from}.pokemon`);
      } else {
        // If the argument does not match the spawned Pokémon name
        await M.reply("❌ The Pokémon you tried to catch does not match the spawned Pokémon!");
      }
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
