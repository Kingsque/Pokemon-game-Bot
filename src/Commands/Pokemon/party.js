const { Sets } = require('@pkmn/sets');
const { Screens } = require('pkmn-screens');
const { summaryScreen, partyScreen } = require('@shineiichijo/team-preview');
const { requirePokeExpToLevelUp } = require('../Helpers/pokeStats');

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
            
            if (!arg) {
                const teamData = party.map(pokemon => ({
                    name: pokemon.name,
                    hp: pokemon.hp,
                    maxHp: pokemon.maxHp,
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
                        caption: response,
                        gifPlayback: true
                    },
                    {
                        quoted: M
                    }
                );
            } else if (arg) {
                const index = parseInt(arg);
                const pokemon = party[index - 1];
                const neededExp = requirePokeExpToLevelUp(pokemon.exp, pokemon.level);
                let text = `🟩 *Name:* ${client.utils.capitalize(pokemon.name)}
                \n\n🟧 *Types:* ${pokemon.types.map(client.utils.capitalize).join(', ')}\n\n🟨 *Level:* ${
                    pokemon.level
                }\n\n🟦 *XP:* ${pokemon.pokexp} / ${neededExp}
                \n\n🟢 *HP:* ${pokemon.hp} / ${pokemon.maxHp}\n\n⬜ *Speed:* ${pokemon.speed} / ${
                    pokemon.maxSpeed
                }\n\n🛡 *Defense:* ${pokemon.defense} / ${pokemon.maxDefense}\n\n🟥 *Attack:* ${pokemon.attack} / ${
                    pokemon.maxAttack
                }\n\n⬛ *Moves:* ${pokemon.moves
                    .map((x) => x.name.split('-').map(client.utils.capitalize).join(' '))
                    .join(', ')}\n\n*[Use ${client.prefix}party ${
                    index + 1
                } --moves to see all of the moves of the pokemon with details]*`;
                M.reply(text);
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon party."
            });
        }
    },
};
