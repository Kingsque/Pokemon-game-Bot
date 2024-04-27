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

      const pokemonName = arg.toLowerCase();
      if (pokemonName !== pokemon.name.toLowerCase()) {
        return M.reply(`You have provided the wrong name for the spawned Pokémon.`);
      }

      const catchRate = pokemon.catchrate;
      let ball = '';
      if (catchRate >= 200) {
        ball = "masterball";
      } else if (catchRate >= 100) {
        ball = "ultraball";
      } else if (catchRate >= 50) {
        ball = "greatball";
      } else {
        ball = "pokeball";
      }

      const userSpecificBallCount = await client.rpg.get(`${M.sender}.${ball}`) || 0;
      const userPokeballs = await client.rpg.get(`${M.sender}.pokeball`) || 0;

      if (userSpecificBallCount <= 0 && userPokeballs <= 0) {
        return M.reply('You do not have any Poké Balls to catch Pokémon.');
      }

      let usedBall = ball; // Default to the determined ball type
      let attemptWithBall = true;

      // Check if the user has the specific type of ball to use
      if (userSpecificBallCount > 0) {
        usedBall = ball; // Use the specific ball if available
      } else {
        attemptWithBall = false; // User doesn't have the specific ball, attempt with regular Poké Balls
      }

      // Attempt to catch the Pokémon based on the catch rate
      const catchSuccess = attemptWithBall ? Math.random() * 100 <= catchRate : Math.random() * 100 <= 50; // Assuming regular Poké Balls have a 50% catch rate

      if (catchSuccess) {
        const party = await client.DB.get(`${M.sender}_Party`) || [];
        if (party.length < 6) {
          party.push(pokemon); // Add Pokémon to Party
          await client.DB.set(`${M.sender}_Party`, party);
          party[0].pokeball = usedBall;
          await client.DB.set(`${M.sender}_Party`, party);
        } else {
          const pc = await client.DB.get(`${M.sender}_PC`) || [];
          pc.push(pokemon); // Add Pokémon to PC
          await client.DB.set(`${M.sender}_PC`, pc);
          pc[0].pokeball = usedBall
           await client.DB.set(`${M.sender}_PC`, pc);
        }
        if (attemptWithBall) {
          await client.rpg.sub(`${M.sender}.${usedBall}`, 1); // Subtract the used ball
        } else {
          await client.rpg.sub(`${M.sender}.pokeball`, 1); // Subtract regular Poké Ball
        }
        await M.reply(`🎉 You have successfully caught ${pokemon.name} (Level: ${pokemon.level}) and stored it accordingly!`);
      } else {
        if (attemptWithBall) {
          await client.rpg.sub(`${M.sender}.${usedBall}`, 1); // Subtract the used ball
        } else {
          await client.rpg.sub(`${M.sender}.pokeball`, 1); // Subtract regular Poké Ball
        }
        await M.reply(`😢 Oh no! ${pokemon.name} broke free from your ${usedBall}!`);
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
