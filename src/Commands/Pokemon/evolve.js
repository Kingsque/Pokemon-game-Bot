const { pokemonEvolve, canItEvolve } = require('../../Helpers/pokeStats');

module.exports = {
    name: "evolve",
    aliases: ["evolve"],
    category: "pokemon",
    description: "Evolve your Pokémon.",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("Your Pokémon party is empty!");
            }
            
            const index = parseInt(arg);
            if (isNaN(index) || index <= 0 || index > party.length) {
                return M.reply("Invalid index. Please provide a valid index within your party range.");
            }
            
            const pokemonToEvolve = party[index - 1];
            
            // Check if the Pokémon can evolve
            const canEvolveResult = await canItEvolve(pokemonToEvolve, pokemonToEvolve.level);
            if (!canEvolveResult) {
                return M.reply("Your Pokémon cannot evolve at this time.");
            }
            
            // Get evolution details including the level at which it evolves and next stage stats
            const evolutionDetails = await pokemonEvolve(pokemonToEvolve.name);
            if (!evolutionDetails) {
                return M.reply("No evolution details found for your Pokémon.");
            }
            
            // Check if the Pokémon's level is greater than or equal to the evolution level
            if (pokemonToEvolve.level >= evolutionDetails.evolutionLevel) {
                
                // Update the Pokémon's details with the next evolved form
                pokemonToEvolve.name = evolutionDetails.name;
                pokemonToEvolve.id = evolutionDetails.id;
                pokemonToEvolve.types = evolutionDetails.types
                pokemonToEvolve.hp = evolutionDetails.stats.hp;
                pokemonToEvolve.attack = evolutionDetails.stats.attack;
                pokemonToEvolve.defense = evolutionDetails.stats.defense;
                pokemonToEvolve.speed = evolutionDetails.stats.speed;
                // You may need to update other properties based on the evolution details
                
                // Save the updated Pokémon details
                await client.DB.set(`${M.sender}_Party`, party);
                
                return M.reply(`Your Pokémon has evolved into ${evolutionDetails.name}!`);
            } else {
                return M.reply("Your Pokémon's level is not high enough to evolve.");
            }
            
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while evolving your Pokémon."
            });
        }
    }
};
