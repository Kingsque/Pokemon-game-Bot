const axios = require('axios');
const { canPokemonEvolve } = require('../../Helpers/pokeStats');

module.exports = {
    name: "evolve",
    aliases: ["evo"],
    exp: 0,
    cool: 4,
    react: "✨",
    usage: 'Use :evolve <index>',
    category: "pokemon",
    description: "Evolve your Pokémon if it meets the requirements",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            // Check if an index argument is provided
            if (!arg || !parseInt(arg) || parseInt(arg) <= 0 || parseInt(arg) > party.length) {
                return M.reply("Please provide a valid index of the Pokémon you want to evolve.");
            }

            const index = parseInt(arg) - 1;
            const pokemonToEvolve = party[index];

             const pokemon= pokemonToEvolve.name.toLowerCase()
            
            if (!canPokemonEvolve(pokemonToEvolve)) {
                return M.reply("This Pokémon cannot evolve at the moment.");
            }

            // Fetch evolution chain data for the current Pokémon species
            const speciesData = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
            const evolutionChainUrl = speciesData.data?.evolution_chain?.url;

            if (!evolutionChainUrl) {
                return M.reply(`Failed to retrieve evolution data for ${pokemonToEvolve.species}.`);
            }

            const evolutionChainData = await axios.get(evolutionChainUrl);
            const evolutionDetails = evolutionChainData.data?.chain;

            if (!evolutionDetails) {
                return M.reply(`Failed to parse evolution data for ${pokemonToEvolve.name}.`);
            }

            // Traverse the evolution chain to find the next evolution
            let nextEvolution = evolutionDetails;
            while (nextEvolution && nextEvolution.name && nextEvolution.sepcies.name !== pokemonToEvolve.name) {
                nextEvolution = nextEvolution.evolves_to[0];
            }

            if (!nextEvolution || !nextEvolution.evolves_to || !nextEvolution.evolves_to[0] || !nextEvolution.evolves_to[0].species) {
                return M.reply(`No evolution data found for ${pokemonToEvolve.species}.`);
            }

            const evolvedSpecies = nextEvolution.evolves_to[0].species.name;
            const evolvedSpeciesData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolvedSpecies}`);

            if (!evolvedSpeciesData || !evolvedSpeciesData.data) {
                return M.reply(`Failed to retrieve data for evolved species: ${evolvedSpecies}.`);
            }

            // Update the Pokémon's species and name to the evolved form
            pokemonToEvolve.species = evolvedSpecies;
            pokemonToEvolve.name = evolvedSpeciesData.data?.name;

            await M.reply(`Congratulations! Your ${pokemonToEvolve.name} has evolved into ${evolvedSpecies}! 🎉`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while trying to evolve your Pokémon."
            });
        }
    }
};
                                                   
