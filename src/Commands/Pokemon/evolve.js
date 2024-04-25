const { getNextEvolvedForm, getNextStats, canEvolve, levelUpPokemon } = require('../../Helpers/pokeStats');

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
            const canEvolveResult = await canEvolve(pokemonToEvolve, pokemonToEvolve.level);
            if (!canEvolveResult) {
                return M.reply("Your Pokémon cannot evolve at this time.");
            }
            
            const nextEvolvedForm = await getNextEvolvedForm(pokemonToEvolve.name);
            if (!nextEvolvedForm) {
                return M.reply("No evolution details found for your Pokémon.");
            }
            
            // Level up the Pokémon
            levelUpPokemon(pokemonToEvolve);
            
            // Get stats for the next evolved form
            const nextStats = await getNextStats(nextEvolvedForm.name);
            if (!nextStats) {
                return M.reply("Failed to fetch stats for the next evolved form.");
            }
            
            // Update the Pokémon's details with the next evolved form
            pokemonToEvolve.name = nextEvolvedForm.name;
            pokemonToEvolve.maxHp = nextStats.stats.hp;
            pokemonToEvolve.maxAttack = nextStats.stats.attack;
            pokemonToEvolve.maxDefense = nextStats.stats.defense;
            pokemonToEvolve.maxSpeed = nextStats.stats.speed;
            pokemonToEvolve.type = nextStats.types;
            // You may need to update other properties based on the next evolved form
            
            // Save the updated Pokémon details
            await client.DB.set(`${M.sender}_Party`, party);
            
            return M.reply(`Your Pokémon has evolved into ${nextEvolvedForm.name}!`);
            
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while evolving your Pokémon."
            });
        }
    }
};
