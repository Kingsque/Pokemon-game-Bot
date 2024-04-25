const axios = require('axios');

module.exports = {
    name: "startjourney",
    aliases: ["startjourney"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon.",
    async execute(client, arg, M) {
        try {
            const pokemon = {
                kanto: [1, 4, 7],
                johto: [152, 155, 158],
                hoenn: [252, 255, 258],
                sinnoh: [387, 390, 393],
                unova: [495, 498, 501],
                kalos: [650, 653, 656],
                alola: [722, 725, 728],
                galar: [810, 813, 816]
            };

            if (!arg) {
                let message = "*Regions and Starter Pokémon:*\n";
                for (const region in pokemon) {
                    const starters = pokemon[region].join(', ');
                    message += `*${region}:* ${starters}\n`;
                }
                return M.reply(message);
            }
            
            if (arg.startsWith('--pokemon')) {
                const pokemonName = arg.split(' ')[1];
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;
                const name = pokemonData.name;
                const types = pokemonData.types.map(type => type.type.name);
                const image = pokemonData.sprites.other['official-artwork'].front_default;
                const level = Math.floor(Math.random() * (15 - 10) + 10);

                const message = `*Starter Pokémon Details:*\n\n*Name:* ${name}\n*Types:* ${types.join(', ')}\n*Level:* ${level}`;
                
                await client.sendMessage(M.from, {
                    image: {
                        url: image,
                    },
                    caption: message,
                });
            }
            
            if (arg.startsWith('--confirm')) {
                const pokemonName = arg.split(' ')[1];
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;
                
                const starterPokemon = {
                    name: pokemonData.name,
                    level: Math.floor(Math.random() * (15 - 10) + 10),
                    maxHp: pokemonData.stats[0].base_stat,
                    maxAttack: pokemonData.stats[1].base_stat,
                    maxDefense: pokemonData.stats[2].base_stat,
                    maxSpeed: pokemonData.stats[5].base_stat,
                    type: pokemonData.types.map(type => type.type.name),
                };

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
                        
