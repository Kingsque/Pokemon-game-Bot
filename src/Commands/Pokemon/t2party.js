module.exports = {
    name: "t2party",
    aliases: ["t2party"],
    exp: 0,
    cool: 4,
    react: "➡️",
    category: "pokemon",
    description: "Transfer a Pokémon from PC to Party",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length >= 6) {
                return M.reply("Your Party is already full!");
            }

            const pokemonName = arg.toLowerCase();
            const index = pc.findIndex(p => p.name.toLowerCase() === pokemonName);
            if (index === -1) {
                return M.reply(`You don't have a Pokémon named ${pokemonName} in your PC.`);
            }

            const transferredPokemon = pc.splice(index, 1)[0]; // Remove Pokémon from PC
            party.push(transferredPokemon); // Add Pokémon to Party
            await client.DB.set(`${M.sender}_PC`, pc);
            await client.DB.set(`${M.sender}_Party`, party);

            await M.reply(`Pokémon ${transferredPokemon.name} transferred from PC to Party successfully!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    },
};
