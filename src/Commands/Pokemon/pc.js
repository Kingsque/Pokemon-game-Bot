module.exports = {
    name: "pc",
    aliases: ["pc"],
    exp: 0,
    cool: 4,
    react: "📋",
    category: "pokemon",
    description: "View your caught Pokémon in your PC",
    async execute(client, arg, M) {
        try {
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            if (pc.length === 0) {
                return M.reply("📭 Your Pokémon collection is empty!");
            }

            let response = "📋 Your Pokémon Collection (PC):\n";
            pc.forEach((pokemon, index) => {
                response += `${index + 1}. ${pokemon.name} (Level: ${pokemon.level})\n`;
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
