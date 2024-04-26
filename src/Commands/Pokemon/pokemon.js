const axios = require('axios');

module.exports = {
    name: "pokemon",
    aliases: ["pokemon"],
    category: "pokemon",
    description: "Get details of a Pokémon by providing its National Pokédex number.",
    async execute(client, arg, M) {
        try {
            if (!arg) {
                return M.reply("Please provide a National Pokédex number.");
            }
            
            const pokemonId = parseInt(arg);
            if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 898) {
                return M.reply("Invalid Pokémon ID. Please provide a number between 1 and 898.");
            }
            
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemonData = response.data;
            const name = pokemonData.name;
            const types = pokemonData.types.map(type => type.type.name);
            const abilities = pokemonData.abilities.map(ability => ability.ability.name);
            const height = pokemonData.height / 10; // Convert to meters
            const weight = pokemonData.weight / 10; // Convert to kilograms
            const image = pokemonData.sprites.other['official-artwork'].front_default;
            
            const message = `*${name.toUpperCase()}*\n\n*Types:* ${types.join(', ')}\n*Abilities:* ${abilities.join(', ')}\n*Height:* ${height} m\n*Weight:* ${weight} kg`;
            
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
