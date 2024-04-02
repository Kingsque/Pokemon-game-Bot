const levels = Array.from({ length: 100 }, (_, i) => `🌸 Level ${i + 1}`);

/**
 * @param {number} level
 * @returns {{requiredXpToLevelUp: number, level: string}}
 */

const getStats = (level) => {
    let requiredXp = 70; // Base XP requirement
    for (let i = 1; i <= level; i++) {
        requiredXp += 5 * (i * 50) + 100 * i * (i * (i + 1)) + 300; // Calculate required XP
    }
    const levelStr = level <= levels.length ? levels[level - 1] : `🌸 Level ${level}`;
    return {
        requiredXpToLevelUp: requiredXp,
        level: levelStr
    };
};

module.exports = {
    getPokeStats,
    levels
};
