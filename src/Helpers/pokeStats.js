const axios = require('axios');

const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    // Formula to calculate experience points required for level up
    return Math.floor(100 + (currentLevel - 1) * 100);
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
 * Extract species information for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {Object} - Species information for the Pokémon.
 */
const extractSpecies = async (pokemonName) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching species data for ${pokemonName}: ${error}`);
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
    
    // Extract species information for the Pokémon
    const speciesData = await extractSpecies(pokemon.name);
    
    // Check if the Pokémon has evolution requirements
    if (speciesData && speciesData.evolves_from_species) {
        const { evolves_from_species } = speciesData;
        
        // Check if the Pokémon's level is high enough for evolution
        if (pokemon.level >= evolves_from_species.min_level && pokemon.species === evolves_from_species.name) {
            return true;
        }
    } else {
        // If no evolution data or not in the correct level/species, cannot evolve
        return false;
    }
    
    return false;
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats,
    levelUpPokemon,
    extractSpecies,
    canPokemonEvolve
};
