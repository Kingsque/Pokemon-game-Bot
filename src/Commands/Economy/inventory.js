// Inventory Command
module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    category: 'economy',
    exp: 7,
    cool: 4,
    react: "✅",
    usage: 'Use :inv',
    description: 'Gives you details about your inventory',
    async execute(client, arg, M) {
        try {
            const userId = M.sender;
            const economy = await client.econ.findOne({ userId });

            let pepper = 0;
            let luck = 0;
            let pokeballs = 0;

            if (economy) {
                pepper = economy.pepperSpray || 0;
                luck = economy.luckPotion || 0;
                pokeballs = economy.pokeball || 0;
            }

            let text = '🎒 *INVENTORY* 🎒\n\n';
            text += `🌶️ *Pepper Spray:* ${pepper}\n`;
            text += `🍀 *Luck Potion:* ${luck}\n`;
            text += `⚽ *Pokeballs:* ${pokeballs}\n`;
            // Add other inventory items here if needed

            M.reply(text);
        } catch (err) {
            console.error(err);
            M.reply("An error occurred while fetching your inventory.");
        }
    }
};
