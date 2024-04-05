const axios = require('axios');
const { calculatePokeExp } = require('../Helpers/pokeStats');

const spawnPokemon = async (client, M) => {
    try {
        if (!M) {
            throw new Error('Message object is undefined');
        }
        
        const id = Math.floor(Math.random() * 1025);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = response.data;

        const name = pokemon.name;
        const types = pokemon.types.map(type => type.type.name);
        const image = pokemon.sprites.other['official-artwork'].front_default;
        const level = Math.floor(Math.random() * (30 - 15) + 15);
        const requiredExp = calculatePokeExp(level);

        const pokemonData = { name: name, level: level, exp: requiredExp }; // Create an object with name, level, and exp
        console.log(`Spawned: ${pokemonData.name} in ${M.from}`);
        await client.DB.set(`${M.from}.pokemon`, pokemonData);

        const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Type:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

        await client.sendMessage(M.from, {
            image: {
                url: image,
            },
            caption: message,
        });
    } catch (error) {
        console.error('Error spawning Pokemon:', error);
    }
};

module.exports = spawnPokemon;
    
