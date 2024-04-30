const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fetch = require('node-fetch');
const { calculatePokeExp } = require('../../Helpers/pokeStats');

module.exports = {
    name: "start-journey",
    aliases: ["start-journey"],
    category: "pokemon",
    description: "Start your Pokémon journey by choosing a starter Pokémon or view Pokémon from a specific region.",
    async execute(client, arg, M) {
        const companion = client.pkmn.get(`${M.sender}_Companion`) || [];

        if (companion.length === 0) {
            return M.reply('You already started your journey');
        }

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

            const starterPokemon = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott', 'chespin', 'fennekin', 'froakie', 'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble'];

            if (!arg) {
                let message = "*Regions and Starter Pokémon:*\n";
                for (const region in pokemonNames) {
                    message += `*${region}:* ${pokemonNames[region].join(', ')}\n`;
                }
                return M.reply(message);
            }

            if (arg.startsWith('--')) {
                const args = arg.split(' ');
                const flag = args[0].slice(2);

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

                    const canvasWidth = 1025;
                    const canvasHeight = 1800;
                    const regionMapUrl = regionMaps[regionName];
                    const regionMap = await loadImage(regionMapUrl);

                    const imageWidth = 300;
                    const imageHeight = 500;
                    const imagePadding = 10;
                    const imagesPerRow = 3;
                    const rows = Math.ceil(imageUrls.length / imagesPerRow);
                    const totalWidthNeeded = imagesPerRow * (imageWidth + imagePadding) - imagePadding;
                    const xStart = (canvasWidth - totalWidthNeeded) / 2;
                    const totalHeightNeeded = rows * (imageHeight + imagePadding) - imagePadding;
                    const yStart = (canvasHeight - totalHeightNeeded) / 2;

                    const canvas = createCanvas(canvasWidth, canvasHeight);
                    const ctx = canvas.getContext('2d');

                    ctx.drawImage(regionMap, 0, 0, canvasWidth, canvasHeight);

                    for (let i = 0; i < imageUrls.length; i++) {
                        const imageUrl = imageUrls[i];
                        const image = await loadImage(imageUrl);
                        const x = xStart + (i % imagesPerRow) * (imageWidth + imagePadding);
                        const y = yStart + Math.floor(i / imagesPerRow) * (imageHeight + imagePadding);
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
                } else if (flag === 'pokemon') {
                    const pkmmName = args.slice(1).join(' ').toLowerCase();

                    if (!starterPokemon.includes(pkmmName)) {
                        return M.reply("Invalid start pokemon. Please choose from the list of starters.");
                    }
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pkmmName}`);
                    const pokemon = response.data;

                    const name = pokemon.name;
                    const types = pokemon.types.map(type => type.type.name);
                    const image = pokemon.sprites.other['official-artwork'].front_default;
                    const level = Math.floor(Math.random() * (10 - 5) + 5);
                    const requiredExp = calculatePokeExp(level);

                    const baseStats = {};
                    pokemon.stats.forEach(stat => {
                        baseStats[stat.stat.name] = stat.base_stat;
                    });

                    const moves = pokemon.moves.slice(0, 2);
                    const movesDetails = await Promise.all(moves.map(async move => {
                        const moveUrl = move.move.url;
                        const moveDataResponse = await fetch(moveUrl);
                        const moveData = await moveDataResponse.json();
                        const moveName = move.move.name;
                        const movePower = moveData.power || 0;
                        const moveAccuracy = moveData.accuracy || 0;
                        const movePP = moveData.pp || 5;
                        const moveType = moveData.type ? moveData.type.name : 'Normal';
                        const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
                        return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, maxPower: moveName, maxPP: movePP, maxAccuracy: moveAccuracy, type: moveType, description: moveDescription };
                    }));

                    const genderRate = pokemon.gender_rate;
                    let isFemale = false;

                    if (genderRate >= 8) {
                        isFemale = true;
                    } else if (genderRate > 0) {
                        isFemale = Math.random() * 100 <= genderRate;
                    }

                    const pokemonData = {
                        name: name,
                        level: level,
                        pokexp: requiredExp,
                        id: pokemon.id,
                        image: image,
                        hp: baseStats['hp'],
                        attack: baseStats['attack'],
                        defense: baseStats['defense'],
                        speed: baseStats['speed'],
                        maxHp: baseStats['hp'],
                        maxAttack: baseStats['attack'],
                        maxDefense: baseStats['defense'],
                        maxSpeed: baseStats['speed'],
                        type: types,
                        moves: movesDetails,
                        status: '',
                        movesUsed: 0,
                        female: isFemale,
                        rarity: 'starter',
                        pokeball: ''
                    };

                    client.sendMessage(M.from, {
                        image: { url: image },
                        caption: JSON.stringify(pokemonData)
                    });
                } else if (flag === 'choose') {
                    const pName = args.slice(1).join(' ').toLowerCase();

                    if (starterPokemon.includes(pName)) {
                        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pName}`);
                        const pokemon = response.data;

                        const name = pokemon.name;
                        const types = pokemon.types.map(type => type.type.name);
                        const image = pokemon.sprites.other['official-artwork'].front_default;
                        const level = Math.floor(Math.random() * (10 - 5) + 5);
                        const requiredExp = calculatePokeExp(level);

                        const baseStats = {};
                        pokemon.stats.forEach(stat => {
                            baseStats[stat.stat.name] = stat.base_stat;
                        });

                        const moves = pokemon.moves.slice(0, 2);
                        const movesDetails = await Promise.all(moves.map(async move => {
                            const moveUrl = move.move.url;
                            const moveDataResponse = await fetch(moveUrl);
                            const moveData = await moveDataResponse.json();
                            const moveName = move.move.name;
                            const movePower = moveData.power || 0;
                            const moveAccuracy = moveData.accuracy || 0;
                            const movePP = moveData.pp || 5;
                            const moveType = moveData.type ? moveData.type.name : 'Normal';
                            const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
                            return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, maxPower: moveName, maxPP: movePP, maxAccuracy: moveAccuracy, type: moveType, description: moveDescription };
                        }));

                        const genderRate = pokemon.gender_rate;
                        let isFemale = false;

                        if (genderRate >= 8) {
                            isFemale = true;
                        } else if (genderRate > 0) {
                            isFemale = Math.random() * 100 <= genderRate;
                        }

                        const pokemonData = {
                            name: name,
                            level: level,
                            pokexp: requiredExp,
                            id: pokemon.id,
                            image: image,
                            hp: baseStats['hp'],
                            attack: baseStats['attack'],
                            defense: baseStats['defense'],
                            speed: baseStats['speed'],
                            maxHp: baseStats['hp'],
                            maxAttack: baseStats['attack'],
                            maxDefense: baseStats['defense'],
                            maxSpeed: baseStats['speed'],
                            type: types,
                            moves: movesDetails,
                            status: '',
                            movesUsed: 0,
                            female: isFemale,
                            pokeball: ''
                        };

                        let party = client.pkmn.get(`${M.sender}_Party`) || [];
                        party.push(pokemonData);
                        client.pkmn.set(`${M.sender}_Party`, party);
                        client.pkmn.set(`${M.sender}_Companion`, pName);

                        return M.reply(`You have successfully started your journey with ${pName}`);
                    }

                    // If the chosen Pokémon is not from the starter list, proceed with the region-based selection
                    if (!pokemonNames.hasOwnProperty(pName)) {
                        return M.reply("Invalid start pokemon. Please choose from the list of starters or regions.");
                    }
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pName}`);
                    const pokemon = response.data;

                    const name = pokemon.name;
                    const types = pokemon.types.map(type => type.type.name);
                    const image = pokemon.sprites.other['official-artwork'].front_default;
                    const level = Math.floor(Math.random() * (10 - 5) + 5);
                    const requiredExp = calculatePokeExp(level);

                    const baseStats = {};
                    pokemon.stats.forEach(stat => {
                        baseStats[stat.stat.name] = stat.base_stat;
                    });

                    const moves = pokemon.moves.slice(0, 2);
                    const movesDetails = await Promise.all(moves.map(async move => {
                        const moveUrl = move.move.url;
                        const moveDataResponse = await fetch(moveUrl);
                        const moveData = await moveDataResponse.json();
                        const moveName = move.move.name;
                        const movePower = moveData.power || 0;
                        const moveAccuracy = moveData.accuracy || 0;
                        const movePP = moveData.pp || 5;
                        const moveType = moveData.type ? moveData.type.name : 'Normal';
                        const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
                        return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, maxPower: moveName, maxPP: movePP, maxAccuracy: moveAccuracy, type: moveType, description: moveDescription };
                    }));

                    const genderRate = pokemon.gender_rate;
                    let isFemale = false;

                    if (genderRate >= 8) {
                        isFemale = true;
                    } else if (genderRate > 0) {
                        isFemale = Math.random() * 100 <= genderRate;
                    }

                    const pokemonData = {
                        name: name,
                        level: level,
                        pokexp: requiredExp,
                        id: pokemon.id,
                        image: image,
                        hp: baseStats['hp'],
                        attack: baseStats['attack'],
                        defense: baseStats['defense'],
                        speed: baseStats['speed'],
                        maxHp: baseStats['hp'],
                        maxAttack: baseStats['attack'],
                        maxDefense: baseStats['defense'],
                        maxSpeed: baseStats['speed'],
                        type: types,
                        moves: movesDetails,
                        status: '',
                        movesUsed: 0,
                        female: isFemale,
                        rarity: 'starter',
                        pokeball: 'pokeball'
                    };

                    let party = client.pkmn.get(`${M.sender}_Party`) || [];
                    party.push(pokemonData);
                    client.pkmn.set(`${M.sender}_Party`, party);
                    client.pkmn.set(`${M.sender}_Companion`, pName);

                    return M.reply(`You have successfully started your journey with ${pName}`);
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
                        
