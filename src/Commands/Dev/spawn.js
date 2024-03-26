const path = require('path');
const axios = require('axios');

module.exports = {
  name: 'spawn',
  aliases: ['event'],
  category: 'dev',
  exp: 5,
  react: "✅",
  description: 'spawns cards',
  async execute(client, arg, M) {
    try {
      let cardgames = await client.DB.get('wild');
      const cardgame = cardgames || [];

      for (let i = 0; i < cardgame.length; i++) {
        const jid = cardgame[i];

        if (cardgame.includes(jid)) {
          try {
            const id = Math.floor(Math.random() * 898);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            // Validate extracted properties
            const name = pokemon.name; // Verify if the name is correctly extracted
            const types = pokemon.types.map(type => type.type.name); // Extracted types
            const image = pokemon.sprites.front_default; // URL of the default image
            const level = pokemon.base_experience; // Base experience level
            const price = Math.floor(Math.random() * 500) + 500; // Example price generation

            console.log("Name:", name);
            console.log("Types:", types);
            console.log("Image URL:", image);
            console.log("Base Experience Level:", level);

            console.log(`Spawned: ${pokemon.name} in ${jid}`);
            await client.cards.set(`${jid}.pokemon`, `${pokemon.name}`);
            await client.cards.set(`${jid}.pokemon_price`, price);

            const message = `🌟 *━『 Wild Pokémon Spawn 』━* 🌟\n\n🔥 Name: ${name}\n\n💥 Type(s): ${types.join(', ')}\n\n💪 Level: ${level}\n\n💰 Price: ${price} coins\n\n🔖 To catch, use command *:catch ${name}*`;

            await client.sendMessage(jid, {
              image: {
                url: image,
              },
              caption: message,
            });

          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon.`
            });
          }

          setTimeout(() => {
            client.cards.delete(`${jid}.pokemon`);
            client.cards.delete(`${jid}.pokemon_price`);
            console.log('pokemon data deleted');
          }, 3000);
        }
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}` });
    }
  }
};
                                     
