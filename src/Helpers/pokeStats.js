const levels = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

/**
 * @param {number} level
 * @returns {{requiredExpToLevelUp: number, pokemon: string}}
 */
const getPokeStats = (level, pokemon) => {
    let required = 70;
    for (let i = 1; i <= level; i++) {
        required += 5 * (i * 50) + 100 * i * (i * (i + 1)) + 300;
    }
    return {
        requiredExpToLevelUp: required,
        pokemon
    };
};

module.exports = {
    getPokeStats,
    levels
};
