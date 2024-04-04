const maxLevel = 100; // Maximum level for a Pokémon

/**
 * Calculate the experience points required for a Pokémon to level up from the current level.
 * @param {number} currentLevel - Current level of the Pokémon.
 * @returns {number} - Experience points required to level up.
 */
const calculatePokeExp = (currentLevel) => {
    // Formula to calculate experience points required for level up
    return Math.floor(100 * Math.pow(1.1, currentLevel));
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
    
    // Determine rank based on level
    const rank = level <= ranks.length ? ranks[level - 1] : ranks[ranks.length - 1];
    
    return {
        level,
        exp,
        requiredExpToLevelUp,
        rank
    };
};

module.exports = {
    calculatePokeExp,
    requirePokeExpToLevelUp,
    getPokeStats
};
