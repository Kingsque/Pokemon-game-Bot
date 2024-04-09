const axios = require('axios');

const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    // Formula to calculate experience points required for level up
    return Math.floor(100 + (currentLevel - 1) * 100 + (100 * (currentLevel - 1)));
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
 * Extract evolution details for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {Object|null} - Evolution details for the Pokémon, or null if not found.
 */
const extractEvolution = async (pokemonName) => {
    try {
        const response = await axios.get(`https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json/${pokemonName}`);
        return response.data.evolution;
    } catch (error) {
        console.error(`Error fetching evolution data for ${pokemonName}: ${error}`);
        return null;
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
    const evolutionDetails = await extractEvolution(pokemon.name);
    
    // Check if the Pokémon has evolution requirements
    if (evolutionDetails && evolutionDetails.required_level) {
        // Check if the Pokémon's level is high enough for evolution
        return pokemon.level >= evolutionDetails.required_level;
    } else {
        return false;
    }
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats,
    levelUpPokemon,
    extractEvolution,
    canPokemonEvolve
};
