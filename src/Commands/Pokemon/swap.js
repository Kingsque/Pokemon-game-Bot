module.exports = {
    name: "swap",
    aliases: ["swap"],
    exp: 0,
    cool: 4,
    react: "🔄",
    category: "pokemon",
    description: "Swap Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length < 2) {
                return M.reply("You need at least two Pokémon in your Party to swap!");
            }

            const [index1, index2] = arg.split("|").map(num => parseInt(num) - 1);
            if (isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0 || index1 >= party.length || index2 >= party.length) {
                return M.reply("Please provide valid indices of Pokémon to swap.");
            }

            [party[index1], party[index2]] = [party[index2], party[index1]]; // Swap Pokémon
            await client.DB.set(`${M.sender}_Party`, party);

            await M.reply(`Pokémon swapped successfully!`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    },
};
