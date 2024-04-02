module.exports = {
    name: "dex",
    aliases: ["dex"],
    exp: 0,
    cool: 4,
    react: "📚",
    category: "pokemon",
    usage: 'Use :dex',
    description: "View all Pokémon in your collection (PC + Party)",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            const party = await client.DB.get(`${M.sender}_Party`) || [];

            if (pc.length === 0 && party.length === 0) {
                return M.reply("📭 Your Pokémon collection is empty!");
            }

            let response = `*Aurora Pokedex*\n⬛*Username:*${M.sender.username}*\n🔑TOTAL POKEMON: ${party.length + pc.length}\n🔮pokemons\n`
            pc.concat(party).forEach((pokemon, index) => {
                response += `${index + 1}) ${pokemon.name}\n`;
            });

            await M.reply(response);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon collection."
            });
        }
    },
};
