module.exports = {
    name: "t2pc",
    aliases: ["t2pc"],
    exp: 0,
    cool: 4,
    react: "⬅️",
    category: "pokemon",
    description: "Transfer a Pokémon from Party to PC",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            const party = await client.DB.get(`${M.sender}_Party`) || [];

            const pokemonName = arg.toLowerCase();
            const index = party.findIndex(p => p.name.toLowerCase() === pokemonName);
            if (index === -1) {
                return M.reply(`You don't have a Pokémon named ${pokemonName} in your Party.`);
            }

            const transferredPokemon = party.splice(index, 1)[0]; // Remove Pokémon from Party
            pc.push(transferredPokemon); // Add Pokémon to PC
            await client.DB.set(`${M.sender}_PC`, pc);
            await client.DB.set(`${M.sender}_Party`, party);

            await M.reply(`Pokémon ${transferredPokemon.name} transferred from Party to PC successfully!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    },
};
