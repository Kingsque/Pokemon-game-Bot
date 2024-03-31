module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    category: 'economy',
    exp: 7,
    cool: 4,
    react: "✅",
    inevntory: 'Use :inv',
    description: 'Gives you details about your inventory',
    async execute(client, arg, M) {
        const pepper = await client.rpg.get(`${M.sender}.pepperspray`);
        const luck = await client.rpg.get(`${M.sender}.luckpotion`);
        const deck = await client.DB.get(`${M.sender}_Deck`) || []
        const coll = await client.DB.get(`${M.sender}_Collection`) || []
        
        const inventory = await client.rpg.get(M.sender);
        if (!inventory) return M.reply('You have no inventory');

        let text = '🗻 *INVENTORY* 🗻\n\n';
        text += `🌶️ *Pepper Spray:* ${pepper || 0}\n`;
        text += `🧧 *Luck Potion:* ${luck || 0}\n`;
        text += `🎴 *Deck:* ${deck.length || 'None'}\n`;
        text += `♦️ *Collection:* ${coll.length || 'None'}`;

        M.reply(text);
    }
};
