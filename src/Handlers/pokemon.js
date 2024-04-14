const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
const { calculatePokeExp } = require('../Helpers/pokeStats');
require("./Message");

module.exports = PokeHandler = async (client, m) => {
  try {
    let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      let jid = randomJid;

      if (wild.includes(jid)) {
        cron.schedule('*/2 * * * *', async () => {
          try {
            const id = Math.floor(Math.random() * 898) + 1; // Ensure ID is within valid range
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (10 - 5) + 5);
            const requiredExp = calculatePokeExp(level);
            
            // Extracting base stats
            const baseStats = {};
            pokemon.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            const desc = pokemon && pokemon.moves ? pokemon.moves.filter((x) => x.language.name === 'en') : [];
            const moves = pokemon.moves
              .filter(move => move.version_group_details[0].level_learned_at <= level) // Filter moves based on level
              .slice(0, 2) // Select the first two moves
              .map(async move => {
                const moveResponse = await axios.get(move.move.url); // Fetch move details from move URL
                const moveData = moveResponse.data;
                return {
                  name: moveData.name,
                  power: moveData.power || 0,
                  accuracy: moveData.accuracy || 0,
                  pp: moveData.pp || 5,
                  type: moveData.type ? moveData.type.name : 'Normal',
                  description: desc[0].flavor_text,
                };
              });

            const movesDetails = await Promise.all(moves);
            
            const pokemonData = { 
              name: name, 
              level: level, 
              pokexp: requiredExp,
              id: pokemon.id,
              maxHP: baseStats['hp'],
              maxAttack: baseStats['attack'],
              maxDefense: baseStats['defense'],
              maxSpeed: baseStats['speed'],
              type: types,
              moves: movesDetails,
              state: {
                status: '',
                movesUsed: 0
              },
            };

            console.log(`Spawned: ${pokemonData.name} in ${jid}`);
            await client.DB.set(`${jid}.pokemon`, pokemonData);

            const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Type:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *Moves:* ${movesDetails.map(move => move.name).join(', ')} \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

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
  
          cron.schedule('*/1 * * * *', async () => {
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
    
