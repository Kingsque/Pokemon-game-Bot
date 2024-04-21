const { Sets } = require('@pkmn/sets');
const { Screens } = require('pkmn-screens');
const { summaryScreen, partyScreen } = require('@shineiichijo/team-preview');
const { calculatePokeExp } = require('../../Helpers/pokeStats');

module.exports = {
    name: "test",
    aliases: ["t"],
    exp: 4,
    cool: 5,
    react: "🟩",
    category: "pokemon",
    party: 'Use :party',
    description: "View your caught Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            if (arg) {
                const index = parseInt(arg);
                if (index <= 0 || index > party.length) {
                    return M.reply("Invalid index. Please provide a valid index within your party range.");
                }
                const pokemon = party[index - 1];
                const neededExp = pokemon.level + 1;
                const need = calculatePokeExp(neededExp);
                let text = `🟩 *Name:* ${client.utils.capitalize(pokemon.name)}
                \n\n🟧 *Types:* ${pokemon.type.map(client.utils.capitalize).join(', ')}\n\n🟨 *Level:* ${
                    pokemon.level
                }\n\n🟦 *XP:* ${pokemon.pokexp} / ${need}
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

                if (arg.includes('--moves')) {
                    const moves = pokemon.moves.map(move => ({
                        name: move.name,
                        pp: move.pp,
                        maxPp: move.maxPp,
                        type: move.type
                    }));
                    const buffer = await client.utils.gifToMp4(
                        await summaryScreen({
                            pokemon: { name: pokemon.name, moves, level: pokemon.level, female: pokemon.female },
                            pokeball: 'pokeball'
                        })
                    );

                    let texto = `*Moves | ${client.utils.capitalize(pokemon.name)}*`;
                    for (let i = 0; i < pokemon.moves.length; i++) {
                        texto += `\n\n*#${i + 1}*\n❓ *Move:* ${pokemon.moves[i].name
                            .split('-')
                            .map(client.utils.capitalize)
                            .join(' ')}\n〽 *PP:* ${pokemon.moves[i].pp} / ${
                            pokemon.moves[i].maxPp
                        }\n🎗 *Type:* ${client.utils.capitalize(pokemon.moves[i].type)}\n🎃 *Power:* ${
                            pokemon.moves[i].power
                        }\n🎐 *Accuracy:* ${pokemon.moves[i].accuracy}\n🧧 *Description:* ${
                            pokemon.moves[i].description
                        }`;
                    }

                    client.sendMessage(
                        M.from,
                        {
                            video: buffer,
                            caption: texto,
                            gifPlayback: true
                        },
                        {
                            quoted: M
                        }
                    );
                }
            } else {
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

                client.sendMessage(
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
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon party."
            });
        }
    },
};
