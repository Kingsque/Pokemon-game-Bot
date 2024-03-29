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
            const pokemonData = await client.DB.get(`${M.from}.pokemon`); // Retrieve spawned Pokémon data
            if (!pokemonData) {
                return M.reply("🙅‍♂️ Sorry, there are currently no Pokémon available to catch!");
            }

            const { name, level, exp } = pokemonData; // Destructure Pokémon data

            // Check if the argument matches the spawned Pokémon name
            if (arg.toLowerCase() === name.toLowerCase()) {
                // Proceed to catch the Pokémon
                const pc = await client.DB.get(`${M.sender}_PC`) || [];
                pc.push({ name: name, level: level, exp: exp }); // Add Pokémon data to PC
                await client.DB.set(`${M.sender}_PC`, pc);

                await M.reply(`🎉 You have successfully caught ${name} (Level: ${level}) and stored it in your PC!`);
                
                // Delete the spawned Pokémon data from the database
                await client.DB.delete(`${M.from}.pokemon`);
            } else {
                // If the argument does not match the spawned Pokémon name
                await M.reply("❌ The Pokémon you tried to catch does not match the spawned Pokémon!");
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while catching the Pokémon."
            });
        }
    },
};
