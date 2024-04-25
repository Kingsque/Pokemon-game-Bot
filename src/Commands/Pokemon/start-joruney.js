const axios = require('axios');

module.exports = {
    name: "startjourney",
    aliases: ["startjourney"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon.",
    async execute(client, arg, M) {
        try {
            const pokemonNames = {
                1: "Bulbasaur",
                4: "Charmander",
                7: "Squirtle",
                152: "Chikorita",
                155: "Cyndaquil",
                158: "Totodile",
                252: "Treecko",
                255: "Torchic",
                258: "Mudkip",
                387: "Turtwig",
                390: "Chimchar",
                393: "Piplup",
                495: "Snivy",
                498: "Tepig",
                501: "Oshawott",
                650: "Chespin",
                653: "Fennekin",
                656: "Froakie",
                722: "Rowlet",
                725: "Litten",
                728: "Popplio",
                810: "Grookey",
                813: "Scorbunny",
                816: "Sobble"
            };

            if (!arg) {
                let message = "*Regions and Starter Pokémon:*\n";
                for (const region in pokemonNames) {
                    message += `*${region}:* ${pokemonNames[region]}\n`;
                }
                return M.reply(message);
            }
            
            if (arg.startsWith('--')) {
                const pokemonName = arg.split(' ')[0].slice(2); // Remove '--' prefix
                if (!pokemonNames[pokemonName]) {
                    return M.reply("Invalid Pokémon name.");
                }
                
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;
                const name = pokemonData.name;
                const types = pokemonData.types.map(type => type.type.name);
                const image = pokemonData.sprites.other['official-artwork'].front_default;
                
                if (arg.includes('--choose')) {
                    const starterPokemon = {
                        name: name,
                        level: Math.floor(Math.random() * (15 - 10) + 10),
                        maxHp: pokemonData.stats[0].base_stat,
                        maxAttack: pokemonData.stats[1].base_stat,
                        maxDefense: pokemonData.stats[2].base_stat,
                        maxSpeed: pokemonData.stats[5].base_stat,
                        type: types,
                    };
    
                    let userParty = await client.DB.get(`${M.sender}_Party`) || [];
                    userParty.push(starterPokemon);
                    await client.DB.set(`${M.sender}_Party`, userParty);
    
                    return M.reply(`Congratulations! You've started your journey with ${name}!`);
                } else {
                    const level = Math.floor(Math.random() * (15 - 10) + 10);
                    const message = `*Starter Pokémon Details:*\n\n*Name:* ${name}\n*Types:* ${types.join(', ')}\n*Level:* ${level}`;
                    
                    await client.sendMessage(M.from, {
                        image: {
                            url: image,
                        },
                        caption: message,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while starting your Pokémon journey."
            });
        }
    }
};
