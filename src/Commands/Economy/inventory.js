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
            let wallet = 0;
            let bank = 0;

            if (economy) {
                pepper = economy.pepperSpray || 0;
                luck = economy.luckPotion || 0;
                pokeballs = economy.pokeball || 0;
                wallet = economy.gem || 0;
                bank = economy.treasury || 0;
            }

            const totalGems = wallet + bank;
            const totalTreasuryValue = bank;

            let text = '🎒 *INVENTORY* 🎒\n\n';
            text += `🌶️ *Pepper Spray:* ${pepper}\n`;
            text += `🍀 *Luck Potion:* ${luck}\n`;
            text += `⚽ *Pokeballs:* ${pokeballs}\n`;
            text += `💰 *Total Gems:* ${totalGems}\n`;
            text += `💼 *Total Treasury Value:* ${totalTreasuryValue}\n`;

            M.reply(text);
        } catch (err) {
            console.error(err);
            M.reply("An error occurred while fetching your inventory.");
        }
    }
};
