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

            const regionMaps = {
                kanto: 'https://archives.bulbagarden.net/media/upload/thumb/2/25/LGPE_Kanto_Map.png/300px-LGPE_Kanto_Map.png',
                johto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVPlheybsjIM1VRgTT_kH5KAyZN09HGAEpbOKzkIANMZBu5a02-sjAm-o&s=10',
                hoenn: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoa5sCI9l7tI8NpjbEtlqoo4ZpOeedR-6y6FiO8IYp4A&s',
                sinnoh: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNgftV7vj9vpXKjCDBd8qLAWEyo_TRI9qbOE_aYPyd7NfrvxzUsOVJpVs&s=10',
                unova: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW5wz8KY5Zf0BVEpbiKvqWAPWFu5Mr_jCvm_IHEK5xpO3ZxuuYu0jLPZ-S&s=10',
                kalos: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsg7x3Z5ds_nNpqby-jYeX8f8rzsFMQP0Y4szKYDnAJ8zFxUU6xRjwYBgS&s=10',
                alola: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPyNRB92Ls2VqDvoRccbLZevXuPxB8XOaFS5vTrWkDPGlcjhmmH6UF6J4&s=10',
                galar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYXvUHrLahCwi_m7TfDWlvIYaR8w9kLGweMBgImUyXw&s'
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

                    const canvasWidth = 625;
                    const canvasHeight = 1000;
                    const canvas = createCanvas(canvasWidth, canvasHeight);
                    const ctx = canvas.getContext('2d');

                    // Load region map as background
                    const regionMapUrl = regionMaps[regionName];
                    const regionMap = await loadImage(regionMapUrl);
                    ctx.drawImage(regionMap, 0, 0, canvasWidth, canvasHeight);

                    const imageWidth = 300; // Changed image width to half
                    const imageHeight = 500; // Changed image height to half
                    const imagePadding = 10;
                    const imagesPerRow = 3;
                    const rows = 4;
                    const xStart = (canvasWidth - (imageWidth * imagesPerRow + imagePadding * (imagesPerRow - 1))) / 2;
                    const yStart = (canvasHeight - (imageHeight * rows + imagePadding * (rows - 1))) / 2; // Adjusted parentheses

                    for (let i = 0; i < imageUrls.length; i++) {
                        const imageUrl = imageUrls[i];
                        const image = await loadImage(imageUrl);
                        const x = xStart + (i % imagesPerRow) * (imageWidth + imagePadding);
                        const y = yStart + Math.floor(i / imagesPerRow) * (imageHeight + imagePadding);
                        // Implementing zigzag line representation
                        const yOffset = i % 2 === 0 ? 0 : imageHeight / 2;
                        ctx.drawImage(image, x, y + yOffset, imageWidth, imageHeight);
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
                    
