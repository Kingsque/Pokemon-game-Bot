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

            const index1 = parseInt(arg[0]) - 1;
            const index2 = parseInt(arg[1]) - 1;
            
            if (isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0 || index1 >= party.length || index2 >= party.length) {
                return M.reply("Invalid Pokémon index.");
            }

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
