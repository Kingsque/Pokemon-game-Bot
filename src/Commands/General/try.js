const sortArray = require('sort-array');
const { getStats } = require('../Helpers/Stats.js'); // Assuming stats.js is in the same directory

module.exports = {
    name: 'try',
    aliases: ['try'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "📊",
    usage: 'Use :lb --exp/--credit/--cards/--pokemon',
    description: 'Shows the leaderboard based on different criteria',
    async execute(client, arg, M) {
        try {
            let allUsers = [];

            // Fetch data based on the provided argument
            if ((arg[1] ?? arg[0]) === '--credit') {
                // Fetch data based on total credits
                allUsers = Object.values(await client.credit.all()).map((x) => ({
                    user: x.id,
                    credit: x.value.credit || 0,
                    bank: x.value.bank || 0,
                }));
            } else if ((arg[1] ?? arg[0]) === '--cards') {
                // Fetch data based on total cards
                allUsers = Object.values(await client.DB.all()).map((x) => ({
                    user: x.id,
                    deck: x.value.deck || [],
                    collection: x.value.collection || []
                }));
            } else if ((arg[1] ?? arg[0]) === '--pokemon') {
                // Fetch data based on total pokemons
                allUsers = Object.values(await client.DB.all()).map((x) => ({
                    user: x.id,
                    party: x.value.party || [],
                    pc: x.value.pc || []
                }));
            } else {
                // Default to experience
                allUsers = Object.values(await client.exp.all()).map((x) => ({
                    user: x.id,
                    xp: x.value
                }));
            }

            // Sort users based on the provided argument
            let leaderboard;
            if ((arg[1] ?? arg[0]) === '--credit') {
                leaderboard = sortArray(allUsers, {
                    by: 'total',
                    order: 'desc',
                    computed: {
                        total: (x) => x.credit + x.bank
                    }
                });
            } else if ((arg[1] ?? arg[0]) === '--cards') {
                leaderboard = sortArray(allUsers, {
                    by: 'totalCards',
                    order: 'desc',
                    computed: {
                        totalCards: (x) => (x.deck ? x.deck.length : 0) + (x.collection ? x.collection.length : 0)
                    }
                });
            } else if ((arg[1] ?? arg[0]) === '--pokemon') {
                leaderboard = sortArray(allUsers, {
                    by: 'totalPokemons',
                    order: 'desc',
                    computed: {
                        totalPokemons: (x) => (x.party ? x.party.length : 0) + (x.pc ? x.pc.length : 0)
                    }
                });
            } else {
                leaderboard = sortArray(allUsers, {
                    by: 'xp',
                    order: 'desc'
                });
            }

            // Prepare and send leaderboard message
            let response = `📊 Leaderboard (Top 10):\n\n`;
            for (let i = 0; i < Math.min(10, leaderboard.length); i++) {
                const userData = leaderboard[i];
                const userInfo = getUserInfo(userData);
                response += `${i + 1}. ${userInfo}\n`;
            }
            await M.reply(response);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while fetching leaderboard data."
            });
        }
    }
};

// Function to get user information based on data structure
function getUserInfo(userData) {
    if (userData.credit !== undefined) {
        return `${userData.user} (Credits: ${userData.credit}, Bank: ${userData.bank})`;
    } else if (userData.deck !== undefined) {
        return `${userData.user} (Deck: ${userData.deck.length}, Collection: ${userData.collection.length})`;
    } else if (userData.party !== undefined) {
        return `${userData.user} (Party: ${userData.party.length}, PC: ${userData.pc.length})`;
    } else {
        const stats = getStats(userData.xp);
        return `${userData.user} (XP: ${userData.xp}, Required EXP: ${stats.requiredXpToLevelUp}, Rank: ${stats.rank})`;
    }
                      }
      
