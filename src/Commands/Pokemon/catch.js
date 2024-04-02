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
            const pokemon = await client.DB.get(`${M.from}.pokemon`); // Retrieve spawned Pokémon
            if (!pokemon) {
                return M.reply("🙅‍♂️ Sorry, there are currently no Pokémon available to catch!");
            }

            if (!arg || arg.length === 0) {
                return M.reply("Please provide the name of the Pokémon you want to catch.");
            }

            const pokemonName = arg.toLowerCase();
            if (pokemonName !== pokemon.name.toLowerCase()) {
                return M.reply(`The provided Pokémon name '${pokemonName}' does not match the spawned Pokémon.`);
            }

            // Check if the user has space in their party
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length < 6) {
                // If party has space, add Pokémon to party
                party.push(pokemon); // Add Pokémon to Party
                await client.DB.set(`${M.sender}_Party`, party);

                await M.reply(`🎉 You have successfully caught ${pokemon.name} (Level: ${pokemon.level}) and stored it in your Party!`);
            } else {
                // If party is full, add Pokémon to PC
                const pc = await client.DB.get(`${M.sender}_PC`) || [];
                pc.push(pokemon); // Add Pokémon to PC
                await client.DB.set(`${M.sender}_PC`, pc);

                await M.reply(`🎉 You have successfully caught ${pokemon.name} (Level: ${pokemon.level}) and stored it in your PC!`);
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
