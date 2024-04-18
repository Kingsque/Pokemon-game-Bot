// Learn Command
module.exports = {
    name: "learn",
    aliases: ["learn"],
    category: "pokemon",
    description: "Learn a new move for your Pokémon.",
    async execute(client, arg, M) {
        try {
            const moveDetails = await client.DB.get(`${M.sender}_Move`);
            if (!moveDetails) return M.reply("No move details found.");
            if (arg === "--cancel") {
                await client.DB.delete(`${M.sender}_Move`);
                return M.reply("Move learning cancelled.");
            } else if (arg === "--confirm") {
                // Check if the user's Pokémon already has 4 moves
                const party = await client.DB.get(`${M.sender}_Party`) || [];
                if (party.length > 0) {
                    const firstPokemon = party[0];
                    if (firstPokemon.moves.length >= 4) {
                        return M.reply("Your Pokémon already has 4 moves. Cannot learn a new move.");
                    }
                }
                // Add the move details to the Pokémon's moves
                firstPokemon.moves.push(moveDetails);
                await client.DB.set(`${M.sender}_Party`, party);
                return M.reply(`Move "${moveDetails.name}" learned successfully.`);
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while learning the move."
            });
        }
    }
};
              
