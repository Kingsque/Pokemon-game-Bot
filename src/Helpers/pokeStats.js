const axios = require('axios');

// Constants
const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    if (currentLevel <= 0 || currentLevel > maxLevel) {
        return Infinity; // or any other appropriate value to indicate an invalid level
    }

    return currentLevel <= 10 ? 100 + (currentLevel - 1) * 100 :
           currentLevel <= 50 ? 1000 + (currentLevel - 10) * 200 :
           9000 + (currentLevel - 50) * 300;
};

/**
 * Calculate the experience points required for a Pokémon to reach the next level.
 * @param {number} currentExp - Current experience points of the Pokémon.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const requirePokeExpToLevelUp = (currentExp, currentLevel) => {
    if (currentLevel <= 0 || currentLevel >= maxLevel) {
        return Infinity; // or any other appropriate value to indicate an invalid level
    }

    return calculatePokeExp(currentLevel + 1) - currentExp;
};

/**
 * Get Pokémon stats including level and experience points.
 * @param {number} level - Current level of the Pokémon.
 * @param {number} exp - Current experience points of the Pokémon.
 * @returns {Object} - Object containing Pokémon stats.
 */
const getPokeStats = (level, exp) => ({
    level: Math.min(level, maxLevel),
    exp,
    requiredExpToLevelUp: requirePokeExpToLevelUp(exp, level)
});

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
        pokemon.exp = remainingExp + calculatePokeExp(pokemon.level);
    }
};

/**
 * Get evolution details of a Pokémon including the level at which it evolves
 * and the stats of the next stage.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {Object|null} - Object containing evolution details or null if not found.
 */
const pokemonEvolve = async (pokemonName) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonData = response.data;

        return {
            evolutionLevel: pokemonData.evolve_to[0].evolve_level, // Assuming the API provides the evolution level
            nextStageStats: {
                hp: pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: pokemonData.stats.find(stat => stat.stat.name === 'speed').base_stat,
            }
        };
    } catch (error) {
        console.error('Error fetching evolution details:', error.message);
        return null;
    }
};

/**
 * Check if a Pokémon can evolve based on its name and current level.
 * @param {string} pokemonName - Name of the Pokémon.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {boolean} - True if the Pokémon can evolve, otherwise false.
 */
const canItEvolve = async (pokemonName, currentLevel) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonData = response.data;

        return currentLevel >= pokemonData.evolve_to[0].evolve_level;
    } catch (error) {
        console.error('Error checking evolution:', error.message);
        return false; // Error occurred, assume evolution is not possible
    }
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats,
    levelUpPokemon,
    pokemonEvolve,
    canItEvolve
};
