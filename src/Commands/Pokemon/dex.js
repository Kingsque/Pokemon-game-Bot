module.exports = {
    name: "dex",
    aliases: ["dex"],
    exp: 0,
    cool: 4,
    react: "📚",
    category: "pokemon",
    usage: 'Use :dex',
    description: "View your total Pokémon caught by you",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            const party = await client.DB.get(`${M.sender}_Party`) || [];

            if (pc.length === 0 && party.length === 0) {
                return M.reply("📭 Your Pokémon collection is empty!");
            }
          let pushName = M.pushName.trim();
        if (pushName.split(' ').length === 1) {
          pushName = `${pushName} san`;
        }
            
            let response = `*Aurora Pokedex*\n⬛*Username:*${M.pushName}*\n🔑TOTAL POKEMON: ${party.length + pc.length}\n🔮pokemons\n`
            pc.concat(party).forEach((pokemon, index) => {
                response += `${index + 1}) ${pokemon.name}\n`;
            });

        await client.sendMessage(
          M.from,
          {
            image: { url: "https://i.ibb.co/v3S5zFg/Aurora-dex.jpg" },
            caption: response
          },
          {
            quoted: M
          }
        );
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon collection."
            });
        }
    },
};
