const axios = require('axios');
const { calculateExp } = require('../../Helpers/pokeStats')

module.exports = {
    name: "pokemon",
    aliases: ["pokemon"],
    category: "pokemon",
    description: "Get details of a Pokémon by providing its National Pokédex number.",
    async execute(client, arg, M) {
        try {
            const args = arg.split(" ");
            if (!args[0]) {
                return M.reply("Please provide a National Pokédex number.");
            }
            
            const pokemonId = parseInt(args[0]);
            if (isNaN(pokemonId) || (pokemonId < 1 || (pokemonId > 1025 && pokemonId < 10001) || pokemonId > 10263)) {
                return M.reply("Invalid Pokémon ID. Please provide a number between 1 and 1025 or between 10001 and 10263.");
            }

            const fetchMoves = args.includes("--moves");

            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (10 - 5) + 5);
            const requiredExp = calculateExp(level);
            
            // Extracting base stats
            const baseStats = {};
            pokemon.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            let movesDetails = [];
            if (fetchMoves) {
                const movesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/moves`);
                const movesData = movesResponse.data.moves.slice(0, 2); // Limit moves to first 2
                movesDetails = await Promise.all(movesData.map(async move => {
                    const moveUrl = move.move.url;
                    const moveDataResponse = await axios.get(moveUrl);
                    const moveData = moveDataResponse.data;
                    const moveName = moveData.name;
                    const movePower = moveData.power || 0;
                    const moveAccuracy = moveData.accuracy || 0;
                    const moveMaxPower = moveData.power || 0;
                    const moveMaxAccuracy = moveData.accuracy || 0;
                    const movePP = moveData.pp || 5;
                    const moveMaxPP = moveData.pp || 5; // assuming max PP is same as PP
                    const moveType = moveData.type ? moveData.type.name : 'Normal';
                    const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
                    return { name: moveName, power: `${movePower} / ${moveMaxPower}`, accuracy: `${moveAccuracy} / ${moveMaxAccuracy}`, pp: `${movePP} / ${moveMaxPP}`, type: moveType, description: moveDescription };
                }));
            }

            const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
            const speciesData = speciesResponse.data;
            const catchRate = speciesData.capture_rate;

            const genderRate = pokemon.gender_rate;
            let isFemale = false;

            if (genderRate >= 8) {
              isFemale = true;
            } else if (genderRate > 0) {
              isFemale = Math.random() * 100 <= genderRate;
            }

            let ball = '';
            if (catchRate >= 200) {
              ball = "masterball";
            } else if (catchRate >= 100) {
              ball = "ultraball";
            } else if (catchRate >= 50) {
              ball = "greatball";
            } else {
              ball = "pokeball";
            }

            let message = `*POKEMON DETAILS*\n\n*Name:* ${name}\n*Level:* ${level}\n*Required Exp:* ${requiredExp}\n*ID:* ${pokemonId}\n*Image:* ${image}\n*HP:* ${baseStats['hp']} / ${baseStats['hp']}\n*Attack:* ${baseStats['attack']} / ${baseStats['attack']}\n*Defense:* ${baseStats['defense']} / ${baseStats['defense']}\n*Speed:* ${baseStats['speed']} / ${baseStats['speed']}\n*Type:* ${types.join(', ')}`;

            if (fetchMoves) {
                message += "\n*Moves:*";
                movesDetails.forEach(move => {
                    message += `\n- *Name:* ${move.name}\n  *Power:* ${move.power}\n  *Accuracy:* ${move.accuracy}\n  *PP:* ${move.pp}\n  *Type:* ${move.type}\n  *Description:* ${move.description}\n`;
                });
            }

            message += `\n*Female:* ${isFemale}\n*Catch Rate:* ${catchRate}\n*Pokeball:* ${ball}`;

            await client.sendMessage(M.from, {
                image: {
                    url: image,
                },
                caption: message,
            });
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while fetching Pokémon details."
            });
        }
    }
};
