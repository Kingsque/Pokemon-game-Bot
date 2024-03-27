const axios = require('axios');

module.exports = {
  name: "pokemon",
  aliases: ["poke"],
  exp: 0,
  cool: 4,
  react: "📋",
  category: "pokemon",
  description: "View Pokémon details",
  async execute(client, arg, M) {
    try {
      if (!arg) {
        return M.reply('Please provide the name or ID of the Pokémon you want to search for.');
      }

      const pokemonName = arg[0].toLowerCase();

      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);

      const pokemon = response.data;
      const species = speciesResponse.data;

      const name = pokemon.name;
      const types = pokemon.types.map(type => type.type.name);
      const image = pokemon.sprites.front_default;
      const abilities = pokemon.abilities.map(ability => ability.ability.name);
      const stats = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`);
      const height = pokemon.height;
      const weight = pokemon.weight;
      const flavorText = species.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

      // Fetch evolution chain
      const evolutionResponse = await axios.get(species.evolution_chain.url);
      let evolutionChain = evolutionResponse.data.chain;
      let evolutionDetails = `**Evolution Chain:** ${evolutionChain.species.name}`;

      while (evolutionChain.evolves_to.length > 0) {
        evolutionChain = evolutionChain.evolves_to[0];
        evolutionDetails += ` -> ${evolutionChain.species.name}`;
      }

      const messageContent = `**Name:** ${name}\n**Types:** ${types.join(', ')}\n**Abilities:** ${abilities.join(', ')}\n**Height:** ${height} dm\n**Weight:** ${weight} hg\n**Stats:**\n${stats.join('\n')}\n**Flavor Text:**\n${flavorText}\n${evolutionDetails}`;

      await client.sendMessage(M.from, {
        image: {
          url: image,
        },
        caption: messageContent,
      });
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      M.reply('Error fetching Pokémon data. Please try again later.');
    }
  },
};
