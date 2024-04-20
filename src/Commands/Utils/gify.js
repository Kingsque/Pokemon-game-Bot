const { partyScreen } = require('@shineiichijo/team-preview');

module.exports = {
    name: "party",
    aliases: ["party"],
    exp: 0,
    cool: 4,
    react: "📋",
    category: "pokemon",
    party: 'Use :party',
    description: "View your caught Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];

            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            const data = [];
            let response = `📋 ${M.pushName.trim()}'s Party:\n`;

            for (let i = 0; i < party.length; i++) {
                const pokemon = party[i];
                data.push({
                    name: pokemon.name,
                    hp: pokemon.hp,
                    maxHp: pokemon.maxHp,
                    female: pokemon.female,
                    level: pokemon.level
                });

                response += `${i + 1}. ${pokemon.name}\nLevel: ${pokemon.level}\n\n`;
            }

            const buffer = await client.utils.gifToMp4(await partyScreen(data));

            await client.sendMessage(
                M.from,
                {
                    video: buffer,
                    caption: response,
                    gifPlayback: true
                },
                {
                    quoted: M
                }
            );
        } catch (err) {
            console.error("Error:", err.message);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon party."
            });
        }
    },
};
