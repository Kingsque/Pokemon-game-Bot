module.exports = {
    name: "t2pc",
    aliases: ["t2pc"],
    exp: 0,
    cool: 4,
    react: "🔄",
    category: "pokemon",
    usage: 'Use :t2pc <pokemon_name>',
    description: "Transfer a Pokémon from your party to your PC",
    async execute(client, arg, M) {
        try {
            const party = await client.pkmn.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            const pokemonName = arg.toLowerCase();
            const transferredPokemonIndex = party.findIndex(pokemon => pokemon.name.toLowerCase() === pokemonName);
            if (transferredPokemonIndex === -1) {
                return M.reply(`Could not find a Pokémon named ${pokemonName} in your party.`);
            }
            const companion = await client.pkmn.get(`${M.sender}_Companion`) || []
            if ( transferredPokemonIndex.name === companion ) return M.reply('You cant move your starter to your pss')
            const transferredPokemon = party.splice(transferredPokemonIndex, 1)[0];
            const pc = await client.pkmn.get(`${M.sender}_PSS`) || [];
            pc.push(transferredPokemon);

            await client.pkmn.set(`${M.sender}_Party`, party);
            await client.pkmn.set(`${M.sender}_PSS`, pc);

            await M.reply(`🔄 Successfully transferred ${transferredPokemon.name} to your PC!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while transferring Pokémon."
            });
        }
    },
};
      
