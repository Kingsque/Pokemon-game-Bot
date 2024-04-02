module.exports = {
    name: "swap",
    aliases: ["swap"],
    exp: 0,
    cool: 4,
    react: "🔄",
    usage: 'Use :swap <pokemon_index_1> <pokemon_index_2>',
    category: "pokemon",
    description: "Swap Pokémon within your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length < 2) {
                return M.reply("You need at least two Pokémon in your party to swap.");
            }

module.exports = {
    name: "swap",
    aliases: ["swap"],
    exp: 0,
    cool: 4,
    react: "🔄",
    usage: 'Use :swap <pokemon_index_1> <pokemon_index_2>',
    category: "pokemon",
    description: "Swap Pokémon within your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length < 2) {
                return M.reply("You need at least two Pokémon in your party to swap.");
            }
            
            if (!arg[0] || isNaN(arg[0]) || arg[0].includes("-") || arg[0].includes("+") || (party.length - parseInt(arg[0])) < 0) {
        M.reply("Please provide a valid first card index.");
        return;
    }

    if (!arg[1] || isNaN(arg[1]) || arg[1].includes("-") || arg[1].includes("+") || (party.length - parseInt(arg[1])) < 0) {
        M.reply("Please provide a valid second card index.");
        return;
    }
            const index1 = parseInt(arg[0]) - 1;
            const index2 = parseInt(arg[1]) - 1;

            const temp = party[index1];
            party[index1] = party[index2];
            party[index2] = temp;

            await client.DB.set(`${M.sender}_Party`, party);
            
            await M.reply(`🔄 Successfully swapped ${party[index1].name} and ${party[index2].name} in your party!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while swapping Pokémon."
            });
        }
    },
};

            
            const index1 = parseInt(arg[0]) - 1;
            const index2 = parseInt(arg[1]) - 1;

            const temp = party[index1];
            party[index1] = party[index2];
            party[index2] = temp;

            await client.DB.set(`${M.sender}_Party`, party);
            
            await M.reply(`🔄 Successfully swapped ${party[index1].name} and ${party[index2].name} in your party!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while swapping Pokémon."
            });
        }
    },
};
