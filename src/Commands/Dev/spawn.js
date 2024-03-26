const path = require('path');
const axios = require('axios');
const cron = require('node-cron');

module.exports = {
  name: 'spawn',
  aliases: ['event'],
  category: 'dev',
  exp: 5,
  react: "✅",
  description: 'spawns cards',
  async execute(client, arg, M) {
    try {
      let cardgames = await client.DB.get('card-game');
      const cardgame = cardgames || [];

      for (let i = 0; i < cardgame.length; i++) {
        const jid = cardgame[i];

        if (cardgame.includes(jid)) {
          cron.schedule('*/10 * * * *', async () => {
            try {
              const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
              const pokemons = response.data.results;
              const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
              const pokemonData = await axios.get(randomPokemon.url);
              const pokemon = pokemonData.data;

              // Validate extracted properties
              const name = pokemon.name; // Verify if the name is correctly extracted
              const types = pokemon.types.map(type => type.type.name); // Extracted types
              const image = pokemon.sprites.front_default; // URL of the default image
              const level = pokemon.base_experience; // Base experience level

              console.log("Name:", name);
              console.log("Types:", types);
              console.log("Image URL:", image);
              console.log("Base Experience Level:", level);
                        
              const price = Math.floor(Math.random() * 500) + 500; // Example price generation

              console.log(`Spawned: ${pokemon.name} in ${jid}`);
              await client.cards.set(`${jid}.pokemon`, `${pokemon.name}`);
              await client.cards.set(`${jid}.pokemon_price`, price);

              const message = `🌟 *━『 Wild Pokémon Spawn 』━* 🌟\n\n🔥 Name: ${pokemon.name}\n\n💥 Type(s): ${pokemon.types.map(type => type.type.name).join(', ')}\n\n💪 Level: ${pokemon.base_experience}\n\n💰 Price: ${price} coins\n\n🔖 To catch, use command *:catch ${pokemon.name}*`;

              const imageMessage = {
                url: pokemon.sprites.front_default,
                caption: message
              };

              await client.sendMessage(jid, {
                image: imageMessage
              });

            } catch (err) {
              console.log(err);
              await client.sendMessage(jid, {
                text: `Error occurred while spawning Pokémon.`
              });
            }
          });

          setTimeout(() => {
            client.cards.delete(`${M.from}.card`);
            client.cards.delete(`${M.from}.card_price`);
            console.log('card deleted');
          }, 3000);
        }
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}` });
    }
  }
}
