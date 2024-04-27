const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

                if (flag === 'region') {
                    const regionName = args.slice(1).join(' ').toLowerCase();

                    if (!pokemonNames.hasOwnProperty(regionName)) {
                        return M.reply("Invalid region name. Please choose from the list of regions.");
                    }

                    const pokemonList = pokemonNames[regionName];
                    const imageUrls = await Promise.all(
                        pokemonList.map(async (pokemon) => {
                            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
                            const imageData = response.data.sprites.other['official-artwork'].front_default;
                            return imageData;
                        })
                    );

                    const canvasWidth = 1050;
                    const canvasHeight = 1800;
                    const canvas = createCanvas(canvasWidth, canvasHeight);
                    const ctx = canvas.getContext('2d');

                    // Fill background with white color
                    ctx.fillStyle = '#FFFFFF'; // White color
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                    const imageWidth = 350;
                    const imageHeight = 450;
                    const imagePadding = 10;
                    const imagesPerRow = 3;
                    const rows = 4;
                    const xStart = (canvasWidth - (imageWidth * imagesPerRow + imagePadding * (imagesPerRow - 1))) / 2;
                    const yStart = (canvasHeight - (imageHeight * rows + imagePadding * (rows - 1))) / 2;

                    for (let i = 0; i < imageUrls.length; i++) {
                        const imageUrl = imageUrls[i];
                        const image = await loadImage(imageUrl);
                        const x = xStart + (i % imagesPerRow) * (imageWidth + imagePadding);
                        const y = yStart + Math.floor(i / imagesPerRow) * (imageHeight + imagePadding);
                        ctx.drawImage(image, x, y, imageWidth, imageHeight);
                    }

                    const directory = require('os').tmpdir();
                    const filePath = path.join(directory, 'collage.png');
                    const buffer = canvas.toBuffer('image/png');
                    fs.writeFileSync(filePath, buffer);

                    client.sendMessage(M.from, {
                        image: { url: filePath },
                        caption: `Starter Pokémon from ${regionName.charAt(0).toUpperCase() + regionName.slice(1)} region`
                    });
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
