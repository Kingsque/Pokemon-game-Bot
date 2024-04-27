const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

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

                    const canvasWidth = 600;
                    const canvasHeight = 800;
                    const canvas = createCanvas(canvasWidth, canvasHeight);
                    const ctx = canvas.getContext('2d');

                    const backgroundImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmru1INQycEtNqouDSnB0XU7_CS3MzEpORvw&usqp=CAU';
                    const backgroundImage = await loadImage(backgroundImageUrl);
                    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

                    const pokemonImageUrl = await loadImage(image);
                    ctx.drawImage(pokemonImageUrl, 50, 50, 500, 500);

                    const filePath = path.join(__dirname, 'collage.png');
                    const buffer = canvas.toBuffer('image/png');
                    fs.writeFileSync(filePath, buffer);

                    await client.sendMessage(M.from, {
                        image: { url: filePath },
                        caption: `*${name}*\n\n*Types:* ${types.join(', ')}`
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

                    const collageCanvas = createCanvas(600, 800);
                    const collageCtx = collageCanvas.getContext('2d');
                    const collageImageUrls = await Promise.all(
                        pokemonImages.map(async (image, index) => {
                            const x = index % 2 === 0 ? 0 : 300;
                            const y = Math.floor(index / 2) * 400;
                            collageCtx.drawImage(image, x, y, 300, 400);
                            return collageCanvas.toDataURL();
                        })
                    );

                    const filePath = path.join(__dirname, 'region_collage.png');
                    const buffer = Buffer.from(collageImageUrls.join('\n'), 'base64');
                    fs.writeFileSync(filePath, buffer);

                    await client.sendMessage(M.from, {
                        image: { url: filePath },
                        caption: `Pokémon from ${regionName} region.`
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
