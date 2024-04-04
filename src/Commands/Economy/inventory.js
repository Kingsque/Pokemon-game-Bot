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
            const pepper = await client.rpg.get(`${M.sender}.pepperspray`) || 0;
            const luck = await client.rpg.get(`${M.sender}.luckpotion`) || 0;
            const deck = await client.DB.get(`${M.sender}_Deck`) || [];
            const coll = await client.DB.get(`${M.sender}_Collection`) || [];
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            const pc = await client.DB.get(`${M.sender}_PC`) || [];
            const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;
            const bank = await client.credit.get(`${M.sender}.bank`) || 0;
            const pokeballs = await client.rpg.get(`${M.sender}.pokeball`) || 0;
            
            let text = '🗻 *INVENTORY* 🗻\n\n';
            text += `🌶️ *Pepper Spray:* ${pepper}\n`;
            text += `🧧 *Luck Potion:* ${luck}\n`;
            text += `🏀 *Pokeballs:* ${pokeballs}\n`;
            text += `🎴 *Total cards:* ${deck.length + coll.length || 'None'}\n`;
            text += `🎊 *Total pokemons:* ${party.length + pc.length || 'None'}\n`;
            text += `💳 *Credits:* ${wallet + bank}`;
            
            M.reply(text);
        } catch (err) {
            console.error(err);
            M.reply("An error occurred while fetching your inventory.");
        }
    }
};
        
