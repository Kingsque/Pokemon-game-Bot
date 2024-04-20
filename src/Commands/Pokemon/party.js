const { Sets } = require('@pkmn/sets');
const { Screens } = require('pkmn-screens');
const { summaryScreen, partyScreen } = require('pkmn-screens');

module.exports = {
    name: "party",
    aliases: ["party"],
    exp: 0,
    cool: 4,
    react: "📋",
    category: "pokemon",
    party: 'Use :party',
    description: "View your caught Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            const teamData = party.map(pokemon => ({
                name: pokemon.name,
                hp: pokemon.hp,
                maxHp: pokemon.maxHp,
                female: pokemon.female,
                level: pokemon.level
            }));

            const buffer = await Screens.party({
                data: teamData.map((s) => Sets.importSet(s)),
                anim: true,
            });

            let pushname = M.pushName.trim();
            let response = `📋 ${pushname}'s Party:\n`;
            party.forEach((pokemon, index) => {
                response += `${index + 1}. ${pokemon.name}\nLevel: ${pokemon.level}\n\n`;
            });

            await client.sendMessage(
                M.from,
                {
                    video: buffer,
                    caption: response
                },
                {
                    quoted: M
                }
            );
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon party."
            });
        }
    },
};
