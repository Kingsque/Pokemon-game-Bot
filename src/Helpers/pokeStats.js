const levels = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

/**
 * @param {number} levels
 * @returns {number} requiredPokeExpToLevelUp
 */
const calculatePokeExp = (levels) => {
    let requiredPokeExp = 0;
    for (let i = 1; i <= level; i++) {
        requiredPokeExp += 50 * i;
    }
    return requiredPokeExp;
};

/**
 * @param {number} pokeExp
 * @returns {string} levels
 */
const getPokeLevel = (pokeExp) => {
    let level = 1;
    let requiredPokeExp = 0;
    while (pokeExp >= requiredPokeExp) {
        requiredPokeExp = calculatePokeExp(level);
        if (pokeExp >= requiredPokeExp) {
            level++;
        }
    }
    return levels.toString();
};

/**
 * @param {number} level
 * @returns {{requiredPokeExpToLevelUp: number, level: string}}
 */
const getPokeStats = (level) => {
    const requiredPokeExp = calculatePokeExp(level);
    const levelString = levels > levels.length ? levels[levels.length - 1] : levels[levels - 1];
    return {
        requiredPokeExpToLevelUp: requiredPokeExp,
        level: levelString
    };
};

module.exports = {
    getPokeStats,
    levels,
    getPokeLevel,
    calculatePokeExp
};

