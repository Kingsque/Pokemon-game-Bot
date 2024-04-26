const axios = require('axios');

module.exports = {
    name: "startjourney",
    aliases: ["startjourney"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon.",
    async execute(client, arg, M) {
        try {
            const pokemonNames = {
                kanto: ['bulbasaur', 'charmander', 'squirtle'],
                johto: ['chikorita', 'cyndaquil', 'totodile'],
                hoenn: ['treecko', 'torchic', 'mudkip'],
                sinnoh: ['turtwig', 'chimchar', 'piplup'],
                unova: ['snivy', 'tepig', 'oshawott'],
                kalos: ['chespin', 'fennekin', 'froakie'],
                alola: ['rowlet', 'litten', 'popplio'],
                galar: ['grookey', 'scorbunny', 'sobble']
            };

            if (!arg) {
                let message = "*Regions and Starter Pokémon:*\n";
                for (const region in pokemonNames) {
                    message += `*${region}:* ${pokemonNames[region].join(', ')}\n`;
                }
                return M.reply(message);
            }
            
            if (arg.startsWith('--')) {
                const pokemonName = arg.split(' ')[0].slice(2); // Remove '--' prefix
                let allStarters = [];
                let regionName;
                for (const region in pokemonNames) {
                    allStarters = allStarters.concat(pokemonNames[region]);
                    if (pokemonNames[region].includes(pokemonName)) {
                        regionName = region;
                    }
                }
                if (!allStarters.includes(pokemonName)) {
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
                        region: regionName
                    };
    
                    let userParty = await client.DB.get(`${M.sender}_Party`) || [];
                    userParty.push(starterPokemon);
                    await client.DB.set(`${M.sender}_Party`, userParty);
    
                    return M.reply(`Congratulations! You've started your journey with ${name} from ${regionName}!`);
                } else {
                    const message = `*${name}* from *${regionName}*\n\n*Types:* ${types.join(', ')}`;
                    
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
