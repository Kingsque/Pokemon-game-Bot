const axios = require('axios');

// Function to fetch starter Pokémon for each region
async function getStarterPokemons() {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/region/');
        const regions = response.data.results;
        const startersByRegion = {};

        // Fetch starter Pokémon for each region
        for (const region of regions) {
            const regionResponse = await axios.get(region.url);
            const regionData = regionResponse.data;
            const regionName = regionData.name;
            // Check if the region data contains pokemon_species
            const starters = regionData.pokemon_species ? regionData.pokemon_species.slice(0, 3).map(pokemon => pokemon.name) : [];
            startersByRegion[regionName] = starters;
        }

        return startersByRegion;
    } catch (error) {
        console.error('Error fetching starter Pokémon:', error.message);
        return {};
    }
}

module.exports = {
    name: "startjourney",
    aliases: ["startjourney"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon.",
    async execute(client, arg, M) {
        try {
            // Fetch starter Pokémon for each region
            const startersByRegion = await getStarterPokemons();

            // If no argument is provided, list regions and starters
            if (!arg) {
                let message = "*Regions and Starter Pokémon:*\n";
                for (const region in startersByRegion) {
                    const starters = startersByRegion[region].join(', ');
                    message += `*${region}:* ${starters}\n`;
                }
                return M.reply(message);
            }
            
            // If user provides --pokemon <name>, show details of that Pokémon
            if (arg.startsWith('--pokemon')) {
                const pokemonName = arg.split(' ')[1];
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;
                const name = pokemonData.name;
                const types = pokemonData.types.map(type => type.type.name);
                const image = pokemonData.sprites.other['official-artwork'].front_default;
                const level = Math.floor(Math.random() * (15 - 10) + 10); // Random level for starter Pokémon

                const message = `*Starter Pokémon Details:*\n\n*Name:* ${name}\n*Types:* ${types.join(', ')}\n*Level:* ${level}`;
                
                // Send image and details of the starter Pokémon
                await client.sendMessage(M.from, {
                    image: {
                        url: image,
                    },
                    caption: message,
                });
            }
            
            // If user confirms their choice with --confirm <name>, add the Pokémon to the user's party
            if (arg.startsWith('--confirm')) {
                const pokemonName = arg.split(' ')[1];
                // Fetch details of the confirmed Pokémon
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;
                
                // Create a Pokémon object with the required details
                const starterPokemon = {
                    name: pokemonData.name,
                    level: Math.floor(Math.random() * (15 - 10) + 10), // Random level for starter Pokémon
                    maxHp: pokemonData.stats[0].base_stat,
                    maxAttack: pokemonData.stats[1].base_stat,
                    maxDefense: pokemonData.stats[2].base_stat,
                    maxSpeed: pokemonData.stats[5].base_stat,
                    type: pokemonData.types.map(type => type.type.name),
                    // You can add more properties as needed
                };

                // Add the starter Pokémon to the user's party (assuming party is stored in the database)
                let userParty = await client.DB.get(`${M.sender}_Party`) || [];
                userParty.push(starterPokemon);
                await client.DB.set(`${M.sender}_Party`, userParty);

                return M.reply(`Congratulations! You've started your journey with ${pokemonName}!`);
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while starting your Pokémon journey."
            });
        }
    }
};
                    
