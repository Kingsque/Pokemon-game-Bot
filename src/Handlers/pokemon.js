const axios = require('axios');
const fetch = require('node-fetch');
const cron = require('node-cron');
const { calculatePokeExp } = require('../Helpers/pokeStats');

module.exports = PokeHandler = async (client, m) => {
  try {
    let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      const jid = randomJid; // Simplified jid assignment
      
      // Ensure the jid is still in the wild array
      if (wild.includes(jid)) {
        cron.schedule('*/10 * * * *', async () => {
          try {
            const legendary = [151, 251, 385, 489, 490, 491, 492, 493, 494, 648, 649, 719, 720, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890];
            // Fetch a random Pokémon from the API
            const mythical = [151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 893, 894, 895, 896];
            const pseudo1 = [149, 248, 373, 376, 445, 635, 706, 784, 887, 330, 497];
            const pseudo2 = [142, 473, 715, 861, 884, 230, 306, 466, 428];
            const ultra = [793, 794, 795, 796, 797, 798, 799, 803, 805, 806, 807];
            let id;
            do {
              id = Math.floor(Math.random() * 1025); // Ensure ID is within valid range
            } while (legendary.includes(id) || mythical.includes(id));
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            // Extract necessary data from the API response
            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (10 - 5) + 5);
            const requiredExp = calculatePokeExp(level);
            
            // Extract base stats
            const baseStats = {};
            pokemon.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            // Fetch moves for the Pokémon
            const dataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await dataResponse.json();
            const moves = data.moves.slice(0, 2); // Limit moves to first 2
            const movesDetails = await Promise.all(moves.map(async move => {
              const moveUrl = move.move.url;
              const moveDataResponse = await fetch(moveUrl);
              const moveData = await moveDataResponse.json();
              const moveName = move.move.name;
              const movePower = moveData.power || 0;
              const moveAccuracy = moveData.accuracy || 0;
              const movePP = moveData.pp || 5;
              const moveType = moveData.type ? moveData.type.name : 'Normal';
              const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
              return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, maxPower: movePower, maxPP: movePP, maxAccuracy: moveAccuracy, type: moveType, description: moveDescription };
            }));

            // Determine Pokémon's gender
            const genderRate = pokemon.gender_rate;
            const isFemale = genderRate >= 8 || (genderRate > 0 && Math.random() * 100 <= genderRate);

            // Determine rarity and pokeball type
            let pokeball = 'pokeball';
            let rarity = 'common';
            if (pseudo1.includes(id)) {
              pokeball = 'ultraball';
              rarity = 'pseudo legendary';
            } else if (pseudo2.includes(id)) {
              pokeball = 'greatball';
              rarity = 'semi-pseudo';
            } else if (ultra.includes(id)) {
              pokeball = 'ultraball';
              rarity = 'ultra rare';
            }

            // Construct the Pokémon data object
            const pokemonData = { 
              name: level, 
              level: level, 
              pokexp: requiredExp,
              id: pokemon.id,
              image: image,
              hp: baseStats['hp'],
              attack: baseStats['attack'],
              defense: baseStats['defense'],
              speed: baseStats['speed'],
              maxHp: baseStats['hp'],
              maxAttack: baseStats['attack'],
              maxDefense: baseStats['defense'],
              maxSpeed: baseStats['speed'],
              type: types,
              moves: movesDetails,
              status: '',
              movesUsed: 0,
              female: isFemale,
              rarity: rarity,
              pokeball: pokeball
            };

            // Store Pokémon data in the client's map
            await client.pokeMap.set(jid, pokemonData);

            // Prepare and send message to the user
            const message = `*🧧 A new Pokémon appeared 🧧*\n\n *💥 Types:* ${types.join(', ')} \n\n *🀄 Level:* 「 ${level} 」 \n\n *Available Moves:* ${movesDetails.map(move => move.name).join(', ')} \n\n Pokeball suggested: ${pokeball} \n\n*Type ${client.prefix}catch <pokemon_name>, to catch it!*`;

            await client.sendMessage(jid, {
              image: {
                url: image,
              },
              caption: message,
            });
          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon: ${err.message}`
            });
          }      
  
          // Schedule deletion of Pokémon after 15 minutes
          cron.schedule('*/8 * * * *', async () => {
            await client.DB.delete(`${jid}.pokemon`);
            console.log(`Pokemon deleted after 15 minutes`);
          });
  
        });
      }
    }
  } catch(error) {
    console.log(error);
  }
};
                                     
