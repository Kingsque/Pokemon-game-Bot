const axios = require('axios');

// Constants
const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * Updated formula for leveling up:
 * Level 1-10: 100 + (level - 1) * 100
 * Level 11-50: 1000 + (level - 10) * 200
 * Level 51-100: 9000 + (level - 50) * 300
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    if (currentLevel <= 0 || currentLevel > maxLevel) {
        return Infinity; // or any other appropriate value to indicate an invalid level
    }

    if (currentLevel <= 10) {
        return 100 + (currentLevel - 1) * 100;
    } else if (currentLevel <= 50) {
        return 1000 + (currentLevel - 10) * 200;
    } else {
        return 9000 + (currentLevel - 50) * 300;
    }
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

    const nextLevelExp = calculatePokeExp(currentLevel + 1);
    return nextLevelExp - currentExp;
};

/**
 * Get Pokémon stats including level and experience points.
 * @param {number} level - Current level of the Pokémon.
 * @param {number} exp - Current experience points of the Pokémon.
 * @returns {Object} - Object containing Pokémon stats.
 */
const getPokeStats = (level, exp) => {
    // Ensure level doesn't exceed the maximum level
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

const axios = require('axios');

/**
 * Get evolution details of a Pokémon including the level at which it evolves
 * and the stats of the next stage.
 * @param {string} pokemonName - Name of the Pokémon.
 * @param {number} pokemonId - ID of the Pokémon.
 * @param {string} pokemonType - Type of the Pokémon.
 * @returns {Object|null} - Object containing evolution details or null if not found.
 */
const pokemonEvolve = async (pokemonName, pokemonId, pokemonType) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
        const speciesData = response.data;
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        const evolutionChain = evolutionChainResponse.data.chain;

        let evolutionLevel = 1;
        let nextStageStats = null;

        if (evolutionChain && evolutionChain.evolves_to.length > 0) {
            const nextForm = evolutionChain.evolves_to[0];
            evolutionLevel = nextForm.min_level;

            const nextFormName = nextForm.species.name;
            const nextFormResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nextFormName}`);
            const nextFormData = nextFormResponse.data;

            nextStageStats = {
                hp: nextFormData.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: nextFormData.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: nextFormData.stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: nextFormData.stats.find(stat => stat.stat.name === 'speed').base_stat,
            };
        }

        return { evolutionLevel, nextStageStats };
    } catch (error) {
        console.error('Error fetching evolution details:', error.message);
        return null;
    }
};

const axios = require('axios');

/**
 * Check if a Pokémon can evolve based on its name and current level.
 * @param {string} pokemonName - Name of the Pokémon.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {boolean} - True if the Pokémon can evolve, otherwise false.
 */
const canItEvolve = async (pokemonName, currentLevel) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
        const speciesData = response.data;
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        const evolutionChain = evolutionChainResponse.data.chain;

        if (evolutionChain && evolutionChain.evolves_to.length > 0) {
            const nextForm = evolutionChain.evolves_to[0];
            const evolutionLevel = nextForm.min_level;

            return currentLevel >= evolutionLevel;
        }

        return false; // No evolution chain found
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
    
