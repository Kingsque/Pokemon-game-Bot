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
      const pokemonInfo = await client.DB.get(`${M.from}.pokemon`); // Retrieve spawned Pokémon info (name and level)
      if (!pokemonInfo) {
        return M.reply("🙅‍♂️ Sorry, there are currently no Pokémon available to catch!");
      }

      const [pokemonName, pokemonLevel] = pokemonInfo.split("-"); // Split Pokémon info into name and level
      const caughtPokemon = { name: pokemonName, level: parseInt(pokemonLevel) }; // Store Pokémon name and level as separate values

      // Check if the argument matches the spawned Pokémon name
      if (arg.toLowerCase() === caughtPokemon.name.toLowerCase()) {
        // Proceed to catch the Pokémon
        const pc = await client.DB.get(`${M.sender}_PC`) || [];
        pc.push(caughtPokemon); // Add Pokémon to PC
        await client.DB.set(`${M.sender}_PC`, pc);

        await M.reply(`🎉 You have successfully caught ${caughtPokemon.name} (Level: ${caughtPokemon.level}) and stored it in your PC!`);
        
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
