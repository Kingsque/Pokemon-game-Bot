module.exports = {
  name: "catch",
  aliases: ["catch"],
  exp: 0,
  cool: 4,
  react: "✅",
  usage: 'Use :catch <name>',
  category: "pokemon",
  description: "Catch the spawned Pokémon",
  async execute(client, arg, M) {
    try {
      const pokemon = await client.pokeMap.get(M.from); // Retrieve spawned Pokémon
      if (!pokemon) {
        return M.reply("🙅‍♂️ Sorry, there are currently no Pokémon available to catch!");
      }

      if (!arg || arg.length === 0) {
        return M.reply("Please provide the name of the Pokémon you want to catch.");
      }

      const catchRate = pokemon.catchrate;
      let ball = '';
      if (catchRate >= 200) {
        ball = "Master Ball";
      } else if (catchRate >= 100) {
        ball = "Ultra Ball";
      } else if (catchRate >= 50) {
        ball = "Great Ball";
      } else {
        ball = "Pokeball";
      }

      const pokemonName = arg.toLowerCase();
      if (pokemonName !== pokemon.name.toLowerCase()) {
        return M.reply(`You have provided the wrong name for the spawned Pokémon.`);
      }

      const userPokeballs = await client.rpg.get(`${M.sender}.pokeball`);
      if (userPokeballs <= 0) return M.reply('You do not have any Poké Balls to catch Pokémon.');

      let catchSuccess = false;
      let usedBall = ball; // Default to the determined ball type

      // Check if the user has the specific type of ball to use
      if (ball !== "Master Ball" && await client.rpg.get(`${M.sender}.${ball.split(' ').join('_').toLowerCase()}`) > 0) {
        usedBall = ball.split(' ').join('_').toLowerCase(); // Use the specific ball if available
      }

      // Attempt to catch the Pokémon based on the catch rate
      if (Math.random() * 100 <= catchRate) {
        catchSuccess = true;
      }

      if (catchSuccess) {
        const party = await client.DB.get(`${M.sender}_Party`) || [];
        if (party.length < 6) {
          party.push(pokemon); // Add Pokémon to Party
          await client.DB.set(`${M.sender}_Party`, party);
        } else {
          const pc = await client.DB.get(`${M.sender}_PC`) || [];
          pc.push(pokemon); // Add Pokémon to PC
          await client.DB.set(`${M.sender}_PC`, pc);
        }
        await client.rpg.sub(`${M.sender}.${usedBall}`, 1); // Subtract the used ball
        await M.reply(`🎉 You have successfully caught ${pokemon.name} (Level: ${pokemon.level}) and stored it accordingly!`);
      } else {
        await client.rpg.sub(`${M.sender}.${usedBall}`, 1); // Subtract the used ball
        await M.reply(`😢 Oh no! ${pokemon.name} broke free from your ${usedBall.split('_').join(' ')}!`);
      }

      // Delete the spawned Pokémon from the database
      await client.DB.delete(`${M.from}.pokemon`);
    } catch (err) {
      console.error(err);
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
