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

/**
 * Get the evolution chain for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {Object[]} - Array of objects representing the evolution chain.
 */
const getEvolveChain = async (pokemonName) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
        const speciesData = response.data;
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        return evolutionChainResponse.data.chain;
    } catch (error) {
        console.error('Error fetching evolution chain:', error.message);
        return [];
    }
};

/**
 * Get the name of the next evolved form for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {string|null} - Name of the next evolved form, or null if not found.
 */
const getNextEvolvedForm = async (pokemonName) => {
    try {
        const evolutionChain = await getEvolveChain(pokemonName);
        if (evolutionChain.evolves_to.length > 0) {
            const nextForm = evolutionChain.evolves_to[0];
            return {
                name: nextForm.species.name,
                levelRequired: nextForm.min_level
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching next evolved form:', error.message);
        return null;
    }
};

/**
 * Check if a Pokémon can evolve based on its level and species.
 * @param {Object} pokemon - The Pokémon object to check for evolution.
 * @returns {boolean} - True if the Pokémon can evolve, otherwise false.
 */
const canEvolve = async (pokemon, requiredLevel) => {
    return pokemon.level >= requiredLevel && pokemon.level < maxLevel;
};

/**
 * Get the name of the next evolved form for a given Pokémon name.
 * @param {string} pokemonName - Name of the Pokémon.
 * @returns {string|null} - Name of the next evolved form, or null if not found.
 */
const getNextStats = async (pokemonName) => {
    try {
        const nextEvolvedForm = await getNextEvolvedForm(pokemonName);
        if (!nextEvolvedForm) {
            throw new Error("Failed to find evolution data for your Pokémon.");
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nextEvolvedForm.name}`);
        const newData = response.data;

        const stats = {
            hp: newData.stats.find(stat => stat.stat.name === 'hp').base_stat,
            attack: newData.stats.find(stat => stat.stat.name === 'attack').base_stat,
            defense: newData.stats.find(stat => stat.stat.name === 'defense').base_stat,
            speed: newData.stats.find(stat => stat.stat.name === 'speed').base_stat,
        };

        return { stats };
    } catch (error) {
        console.error('Error fetching next evolved form stats:', error.message);
        return null;
    }
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats,
    levelUpPokemon,
    canEvolve,
    getEvolveChain,
    getNextEvolvedForm,
    getNextStats
};
    
