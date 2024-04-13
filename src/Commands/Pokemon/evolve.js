const axios = require('axios');
const { canPokemonEvolve, getNextId, getNextStats } = require('../../Helpers/pokeStats');

module.exports = {
    name: "evolve",
    aliases: ["evolve"],
    exp: 0,
    cool: 4,
    react: "🔄",
    category: "pokemon",
    description: "Evolve your Pokémon in the party if possible.",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }
            
            const index = parseInt(arg) - 1;
            if (isNaN(index) || index < 0 || index >= party.length) {
                return M.reply("Please provide a valid party number.");
            }
            
            const pokemon = party[index];
            const canEvolve = await canPokemonEvolve(pokemon);
            
            if (!canEvolve) {
                return M.reply("Your Pokémon cannot evolve at this time.");
            }
            
            const nextId = await getNextId(pokemon.name);
            if (!nextId) {
                return M.reply("Failed to find evolution data for your Pokémon.");
            }
            
            // Get new Pokémon data and extract stats and moves
            const { stats, moves } = await getNextStats(pokemon.name);
            
            // Update Pokémon name
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
            const newData = response.data;
            pokemon.name = newData.name; // Assuming the stats object includes the new Pokémon name
            
            // Update Pokémon stats (hp, attack, defense, speed)
            pokemon.hp = stats.hp;
            pokemon.attack = stats.attack;
            pokemon.defense = stats.defense;
            pokemon.speed = stats.speed;
            
            // Initialize moves array if undefined
            if (!pokemon.moves) {
                pokemon.moves = [];
            }
            
            // Push new moves to the Pokémon
            pokemon.moves.push(...moves);
            
            // Notify user about evolution
            await client.sendMessage(M.from, {
                text: `${pokemon.name} evolved into ${newData.name}!`,
            });
            
            // Save changes to the party
            await client.DB.set(`${M.sender}_Party`, party);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while trying to evolve your Pokémon.",
            });
        }
    },
};
