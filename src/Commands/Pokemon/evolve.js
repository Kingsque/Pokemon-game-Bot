// Evolve Command
module.exports = {
    name: "evolve",
    aliases: ["evolve"],
    category: "pokemon",
    description: "Evolve your Pokémon.",
    async execute(client, arg, M) {
        try {
            const nextEvolvedForm = await client.DB.get(`${M.sender}_Evolve`);
            if (!nextEvolvedForm) return M.reply("No evolution details found.");
            if (arg === "--cancel") {
                await client.DB.delete(`${M.sender}_Evolve`);
                return M.reply("Evolution cancelled.");
            } else if (arg === "--confirm") {
                // Retrieve the user's party from the database
                const party = await client.DB.get(`${M.sender}_Party`) || [];
                if (party.length > 0) {
                    // Get the first Pokémon in the party
                    const firstPokemon = party[0];
                    // Update the Pokémon's details with the next evolved form
                    firstPokemon.name = nextEvolvedForm.name;
                    firstPokemon.type = nextEvolvedForm.type;
                    firstPokemon.maxHP = nextEvolvedForm.maxHP;
                    firstPokemon.maxAttack = nextEvolvedForm.maxAttack;
                    firstPokemon.maxDefense = nextEvolvedForm.maxDefense;
                    firstPokemon.maxSpeed = nextEvolvedForm.maxSpeed;
                    firstPokemon.id = nextEvolvedForm.id; // Update the Pokémon's ID
                    // Save the updated Pokémon details
                    await client.DB.set(`${M.sender}_Party`, party);
                    return M.reply(`Your Pokémon has evolved into ${nextEvolvedForm.name}!`);
                }
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while evolving your Pokémon."
            });
        }
    }
};
