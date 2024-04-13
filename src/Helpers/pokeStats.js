const axios = require('axios');

const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    if (currentLevel <= 0 || currentLevel > maxLevel) {
        return Infinity; // or any other appropriate value to indicate invalid level
    }
    return 100 + (currentLevel - 1) * 200; // Starting from 200, increase by 200 for each level
};

/**
 * Calculate the experience points required for a Pokémon to reach the next level.
 * @param {number} currentExp - Current experience points of the Pokémon.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const requirePokeExpToLevelUp = (currentExp, currentLevel) => {
    const expToNextLevel = calculatePokeExp(currentLevel + 1);
    return expToNextLevel - currentExp;
};

/**
 * Get Pokémon stats including level and experience points.
 * @param {number} level - Current level of the Pokémon.
 * @param {number} exp - Current experience points of the Pokémon.
 * @returns {Object} - Object containing Pokémon stats.
 */
const getPokeStats = (level, exp) => {
    // Ensure level doesn't exceed maximum level
    level = Math.min(level, maxLevel);
    
    // Calculate required experience points for leveling up
    const requiredExpToLevelUp = requirePokeExpToLevelUp(exp, level);
    
    return {
        level,
        exp,
        requiredExpToLevelUp,
    };
};

/**
 * Level up a Pokémon if it has enough experience points to do so.
 * @param {Object} pokemon - The Pokémon object to level up.
 */
const levelUpPokemon = (pokemon) => {
    const { level, exp } = pokemon;
    const requiredExp = requirePokeExpToLevelUp(exp, level);
    
    if (requiredExp <= 0 && level < maxLevel) {
        pokemon.level += 1;
        const remainingExp = Math.max(exp - calculatePokeExp(level), 0);
        const nextLevelExp = calculatePokeExp(pokemon.level);
        pokemon.exp = remainingExp + nextLevelExp;
    }
};

/**
 * Check if a Pokémon can evolve based on its level and species.
 * @param {Object} pokemon - The Pokémon object to check for evolution.
 * @returns {boolean} - True if the Pokémon can evolve, otherwise false.
 */
const canPokemonEvolve = async (pokemon) => {
    // Check if the Pokémon has reached its maximum level
    if (pokemon.level >= maxLevel) {
        return false;
    }
    
    // Extract evolution details for the Pokémon
    const response = await axios.get(`https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json`);
    const pokemonData = response.data.find(p => p.name.english.toLowerCase() === pokemon.name.toLowerCase());
    if (pokemonData && pokemonData.evolution && pokemonData.evolution.next) {
        const [nextId, requirement] = pokemonData.evolution.next[0];
        const requiredLevel = parseInt(requirement.match(/\d+/)[0]); // Extract required level from the requirement string
        return pokemon.level >= requiredLevel;
    } else {
        return false;
    }
};

/**
 * Get the ID of the next evolution for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {string|null} - ID of the next evolution, or null if not found.
 */
const getNextId = async (pokemonName) => {
    const response = await axios.get(`https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json`);
    const pokemonData = response.data.find(p => p.name.english.toLowerCase() === pokemonName.toLowerCase());
    if (pokemonData && pokemonData.evolution && pokemonData.evolution.next) {
        return pokemonData.evolution.next[0][0]; // Return the ID of the next evolution
    } else {
        return null;
    }
};


const getNextStats = async (pokemonName) => {
    const nextId = await getNextId(pokemonName);
    if (!nextId) {
        throw new Error("Failed to find evolution data for your Pokémon.");
    }

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
    const newData = response.data;

    // Extract new stats and moves
    const stats = {
        hp: newData.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: newData.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: newData.stats.find(stat => stat.stat.name === 'defense').base_stat,
        speed: newData.stats.find(stat => stat.stat.name === 'speed').base_stat,
    };

    const moves = newData.moves.filter(move => move.version_group_details.some(detail => detail.level_learned_at <= 1))
                                .map(move => ({
                                    name: move.move.name,
                                    power: move.move.power || 0,
                                    accuracy: move.move.accuracy || 0,
                                    pp: move.move.pp || 0,
                                    type: move.move.type ? move.move.type.name : 'Normal',
                                    description: move.move.description || ''
                                }));
    return { stats, moves };
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats,
    levelUpPokemon,
    canPokemonEvolve,
    getNextId,
    getNextStats // Fixed typo here
};
