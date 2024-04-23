const cron = require("node-cron");
const axios = require('axios');
const { calculatePokeExp } = require('../Helpers/pokeStats');
const fetch = require('node-fetch');

module.exports = PokeHandler = async (client, m) => {
  try {
    let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      let jid = randomJid;

      if (wild.includes(jid)) {
        cron.schedule('*/20 * * * *', async () => {
          try {
            const id = Math.floor(Math.random() * 898) // Ensure ID is within valid range
            
            // Fetch Pokémon data
            const pokemonDataResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemonData = pokemonDataResponse.data;

            const name = pokemonData.name;
            const types = pokemonData.types.map(type => type.type.name);
            const level = Math.floor(Math.random() * (10 - 5) + 5);
            const requiredExp = calculatePokeExp(level);
            
            // Extracting base stats
            const baseStats = {};
            pokemonData.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            // Fetch Pokémon image
            const imageResponse = await axios.get(pokemonData.sprites.other['official-artwork'].front_default);
            const image = imageResponse.data;

            // Fetch Pokémon moves
            const movesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const movesData = await movesResponse.json();
            const moves = movesData.moves.slice(0, 2); 
            const movesDetails = await Promise.all(moves.map(async move => {
              const moveName = move.move.name;
              const moveUrl = move.move.url;
              const moveDataResponse = await fetch(moveUrl);
              const moveData = await moveDataResponse.json();
              const movePower = moveData.power || 0;
              const moveAccuracy = moveData.accuracy || 0;
              const movePP = moveData.pp || 5;
              const moveType = moveData.type ? moveData.type.name : 'Normal';
              const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
              return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, type: moveType, description: moveDescription };
            }));

            const pokemonDataObject = { 
              name: name, 
              level: level, 
              pokexp: requiredExp,
              id: id, // Using the same ID generated for fetching
              hp: baseStats['hp'] - 20,
              maxHp: baseStats['hp'],
              maxAttack: baseStats['attack'],
              maxDefense: baseStats['defense'],
              maxSpeed: baseStats['speed'],
              type: types,
              moves: movesDetails,
              status: '',
              movesUsed: 0
            };

            console.log(`Spawned: ${pokemonDataObject.name} in ${jid}`);
            await client.DB.set(`${jid}.pokemon`, pokemonDataObject);

            const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Types:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *Available Moves:* ${movesDetails.map(move => move.name).join(', ')} \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

            await client.sendMessage(jid, {
              image: {
                url: image,
              },
              caption: message,
            });
          } catch (err) {
            console.log(err);
            await client.sendMessage(M.from, {
              text: `Error occurred while spawning Pokémon: ${err.message}`
            });
          }      
  
          cron.schedule('*/15 * * * *', async () => {
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
              
