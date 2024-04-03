const levels = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

/**
 * Calculate required experience points to level up based on the level.
 * @param {number} level - The level of the Pokémon.
 * @returns {number} - The required experience points to level up.
 */
const calculateRequiredExp = (level) => {
    // Improved logic for calculating required experience points
    return Math.floor(70 * Math.pow(level, 1.8));
};

/**
 * @param {number} level - The level of the Pokémon.
 * @param {string} pokemon - The name of the Pokémon.
 * @returns {{requiredExpToLevelUp: number, pokemon: string}} - Object containing required experience points and Pokémon name.
 */
const getPokeStats = (level, pokemon) => {
    const requiredExpToLevelUp = calculateRequiredExp(level);
    return {
        requiredExpToLevelUp,
        pokemon
    };
};

module.exports = {
    getPokeStats,
    levels
};
