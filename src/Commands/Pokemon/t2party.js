module.exports = {
    name: "t2party",
    aliases: ["t2party"],
    exp: 0,
    cool: 4,
    react: "🔄",
    category: "pokemon",
    usage: 'Use :t2party <pokemon_name>',
    description: "Transfer a Pokémon from your PC to your party",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            if (pc.length === 0) {
                return M.reply("📭 Your Pokémon collection is empty!");
            }

            const pokemonName = arg.toLowerCase();
            const transferredPokemonIndex = pc.findIndex(pokemon => pokemon.name.toLowerCase() === pokemonName);
            if (transferredPokemonIndex === -1) {
                return M.reply(`Could not find a Pokémon named ${pokemonName} in your PC.`);
            }

            const transferredPokemon = pc.splice(transferredPokemonIndex, 1)[0];
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            party.push(transferredPokemon);

            await client.DB.set(`${M.sender}_PC`, pc);
            await client.DB.set(`${M.sender}_Party`, party);

            await M.reply(`🔄 Successfully transferred ${transferredPokemon.name} to your party!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while transferring Pokémon."
            });
        }
    },
};
