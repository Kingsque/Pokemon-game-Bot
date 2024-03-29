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

      // Check if the user's party is full
      const party = await client.DB.get(`${M.sender}_Party`) || [];
      if (party.length < 6) {
        // If the party is not full, store the caught Pokémon in the party
        party.push(pokemon);
        await client.DB.set(`${M.sender}_Party`, party);
        await M.reply(`🎉 You have successfully caught ${pokemon} and stored it in your party!`);
      } else {
        // If the party is full, store the caught Pokémon in the PC
        const pc = await client.DB.get(`${M.sender}_PC`) || [];
        pc.push(pokemon);
        await client.DB.set(`${M.sender}_PC`, pc);
        await M.reply(`🎉 You have successfully caught ${pokemon} and stored it in your PC!`);
      }

      // Delete the spawned Pokémon from the database
      await client.DB.delete(`${M.from}.pokemon`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
