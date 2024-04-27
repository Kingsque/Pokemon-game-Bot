const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: "startjourney",
    aliases: ["startjourney"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon or view Pokémon from a specific region.",
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
                const args = arg.split(' ');
                const flag = args[0].slice(2); // Remove '--' prefix

                if (flag === 'pokemon') {
                    const pokemonName = args.slice(1).join(' ').toLowerCase();

                    if (!isValidPokemon(pokemonName, pokemonNames)) {
                        return M.reply("Invalid Pokémon name. Please choose from the list.");
                    }

                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                    const pokemonData = response.data;
                    const name = pokemonData.name;
                    const types = pokemonData.types.map(type => type.type.name);
                    const image = pokemonData.sprites.other['official-artwork'].front_default;

                    const message = `*${name}*\n\n*Types:* ${types.join(', ')}`;

                    await client.sendMessage(M.from, {
                        image: {
                            url: image,
                        },
                        caption: message,
                    });
                } else if (flag === 'region') {
                    const regionName = args.slice(1).join(' ').toLowerCase();

                    if (!pokemonNames.hasOwnProperty(regionName)) {
                        return M.reply("Invalid region name. Please choose from the list of regions.");
                    }

                    const pokemonList = pokemonNames[regionName];
                    const pokemonImages = await Promise.all(
                        pokemonList.map(async (pokemon) => {
                            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
                            const imageData = response.data.sprites.other['official-artwork'].front_default;
                            return loadImage(imageData);
                        })
                    );

                    const canvasWidth = 400;
                    const canvasHeight = Math.ceil(pokemonList.length / 2) * 200;
                    const canvas = createCanvas(canvasWidth, canvasHeight);
                    const ctx = canvas.getContext('2d');

                    let x = 0;
                    let y = 0;
                    for (const image of pokemonImages) {
                        ctx.drawImage(image, x, y, canvasWidth / 2, canvasHeight / Math.ceil(pokemonList.length / 2));
                        x += canvasWidth / 2;
                        if (x >= canvasWidth) {
                            x = 0;
                            y += canvasHeight / Math.ceil(pokemonList.length / 2);
                        }
                    }

                    const collageImage = canvas.toDataURL('image/png');
                    await client.sendMessage(M.from, {
                        image: {
                            url: collageImage,
                        },
                        caption: `Pokémon from ${regionName} region.`,
                    });
                } else {
                    return M.reply("Invalid argument. Please use '--pokemon' or '--region'.");
                }
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while processing your request."
            });
        }
    }
};

function isValidPokemon(pokemonName, pokemonNames) {
    const allPokemons = [].concat(...Object.values(pokemonNames));
    return allPokemons.includes(pokemonName);
}
