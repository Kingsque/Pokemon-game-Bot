const cron = require("node-cron")
const axios = require('axios')
const path = require('path')
const { calculatePokeExp } = require('../Helpers/pokeStats')
const { shizobtn1, shizobtn1img, shizobtn1gif } = require('./shizofunc.js')
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
            const id = Math.floor(Math.random() * 1025);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (30 - 15) + 15);
            const requiredExp = calculatePokeExp(level);

            const pokemonData = { name: name, level: level, exp: requiredExp }; // Create an object with name, level, and exp
           console.log(`Spawned: ${pokemonData.name} in ${jid}`);
           await client.DB.set(`${jid}.pokemon`, pokemonData);

            const message = `*┌─🄱🄾🅃────────❀̥˚─┈ ⳹*̥̥
*└───🄿🄾🄺🄴🄼🄾🄽───┈ ⳹*
*│▱▱▱▱▱▱▱▱▱▱▱▱▱▱*
*│𓊈 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 𓊉*
*│🏮 ᴛʏᴘᴇ: 𓆩 ${types.join(', ')} 𓆪*
*│🔰 ʟᴇᴠᴇʟ: 【 ${level} 】*
*│░░░░░░░░░░░░░░░░░░░░*
*│📤 ɪɴғᴏ: ᴘᴏᴋᴇᴍᴏɴ ᴄᴀʀᴅ'ꜱ  🎏*
*│ᴠᴇʀꜱɪᴏɴ 𝟐𝟎𝟐𝟒-𝟐𝟓 🎯*
*│░░░░░░░░░░░░░░░░░░░░*
*│♒ ᴛʏᴘᴇ ᴄᴀᴛᴄʜ [ ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ ]*
*│🎋 ʏᴏᴜʀ ᴘᴏᴋᴇᴍᴏɴ ᴡɪʟʟ ʙᴇ*
*│ꜱᴛᴏʀᴇᴅ ɪɴ ʏᴏᴜʀ ᴘᴏᴋᴇ-ᴅᴇᴄᴋ. 📲*
*│- ᴏᴡɴᴇʀ: ʀᴇᴅᴢᴇᴏꭗ 彡*
*│▱▱▱▱▱▱▱▱▱▱▱▱▱▱*
*┌───🄿🄾🄺🄴🄼🄾🄽───┈ ⳹*
*└❀̥˚───────────🄱🄾🅃─┈ ⳹*`;

              return shizobtn1img(client, jid, message, image, ' Stat-journey🔖', `-start-journey`, '𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻')
          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon.`
            });
          }      
  
    cron.schedule('*/2 * * * *', async () => {
     await client.DB.delete(`${jid}.pokemon`);
      console.log(`Pokemon deleted after 5minutes`)
  
    })
  
  });
  
  }
    }
    
    } catch(error){
        console.log(error)
    }

              }

      
