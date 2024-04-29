const { Sets } = require('@pkmn/sets');
const { Screens } = require('pkmn-screens');
const { summaryScreen, partyScreen } = require('@shineiichijo/team-preview');
const { calculatePokeExp } = require('../../Helpers/pokeStats');

module.exports = {
    name: "party",
    aliases: ["party"],
    exp: 4,
    cool: 5,
    react: "🟩",
    category: "pokemon",
    party: 'Use :party',
    description: "View your caught Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.pkmn.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            if (arg) {
                const index = parseInt(arg);
                if (index <= 0 || index > party.length) {
                    return M.reply("Invalid index. Please provide a valid index within your party range.");
                }
                const pokemon = party[index - 1];

                if (arg.includes('--moves')) {
                    const moves = pokemon.moves.map(move => ({
                        name: move.name,
                        pp: move.pp,
                        maxPp: move.maxPp,
                        type: move.type,
                        power: move.power,
                        accuracy: move.accuracy,
                        description: move.description
                    }));

                    const ball = pokemon.pokeball
                    const buffer = await client.utils.gifToMp4(
                        await summaryScreen({
                            pokemon: { name: pokemon.name, moves, level: pokemon.level, female: pokemon.female },
                            pokeball: '${ball}'
                        })
                    );

                    let texto = `*Moves | ${client.utils.capitalize(pokemon.name)}*`;
                    for (let i = 0; i < moves.length; i++) {
                        texto += `\n\n*#${i + 1}*\n❓ *Move:* ${moves[i].name.split('-').map(client.utils.capitalize).join(' ')}\n
〽 *PP:* ${moves[i].pp} / ${moves[i].maxPp}\n
🎗 *Type:* ${client.utils.capitalize(moves[i].type)}\n
🎃 *Power:* ${moves[i].power} / ${moves[i].maxPower}\n
🎐 *Accuracy:* ${moves[i].accuracy} / ${moves[i].maxAccuracy}\n
🧧 *Description:* ${moves[i].description}`;
                    }

                    client.sendMessage(
                        M.from,
                        {
                            video: buffer,
                            caption: texto,
                            gifPlayback: true,
                            quoted: M
                        }
                    );
                } else {
                    // Normal text response without summary screen
                    const neededExp = pokemon.level + 1;
                    const need = calculatePokeExp(neededExp);
                    let text = `🟩 *Name:* ${client.utils.capitalize(pokemon.name)}
                
🟧 *Types:* ${pokemon.type.map(client.utils.capitalize).join(', ')}\n
🟨 *Level:* ${pokemon.level}\n
🟦 *XP:* ${pokemon.pokexp} / ${need}\n
🟢 *HP:* ${pokemon.hp} / ${pokemon.maxHp}\n
⬜ *Speed:* ${pokemon.speed} / ${pokemon.maxSpeed}\n
🛡 *Defense:* ${pokemon.defense} / ${pokemon.maxDefense}\n
🟥 *Attack:* ${pokemon.attack} / ${pokemon.maxAttack}\n
🟫 *Rarity:* ${pokemon.rarity}
⬛ *Moves:* ${pokemon.moves.map(move => move.name.split('-').map(client.utils.capitalize).join(' ')).join(', ')}
\n\n*[Use ${client.prefix}party ${index + 1} --moves to see all of the moves of the pokemon with details]*`;
                    
                    M.reply(text);
                }
            } else {
                const teamData = party.map(pokemon => ({
                    name: pokemon.name,
                    hp: pokemon.hp,
                    maxHp: pokemon.maxHp,
                    level: pokemon.level,
                    female: pokemon.female
                }));

                const buffer = await client.utils.gifToMp4(await partyScreen(teamData))

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
                        gifPlayback: true,
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

                          
