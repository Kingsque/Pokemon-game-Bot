const fetch = require('node-fetch');
const { shizobtn1, shizobtn1img, shizobtn1gif, shizobtn2 } = require('../../shizofunc.js');

module.exports = {
    name: 'couplepfp',
    aliases: ['pfp'],
    category: 'fun',
    exp: 5,
    cool: 20,
    react: "🌸",
    usage: 'Use: !slot <amount>',
    description: 'Bets the given amount of credits in a slot machine',
    async execute(client, arg, M) {
        try {
            let response = await fetch('https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json');
            let data = await response.json();
            let cita = data[Math.floor(Math.random() * data.length)];
            
            let cowoResponse = await fetch(cita.cowo);
            let cowi = await cowoResponse.buffer();
            await client.sendMessage(M.from, { image: cowi, caption: 'for him' }, { quoted: M });
            
            let ceweResponse = await fetch(cita.cewe);
            let ciwi = await ceweResponse.buffer();
            await client.sendMessage(M.from, { image: ciwi, caption: 'for her' }, { quoted: M });
            await shizobtn1img(client, M.from, message, "Next Pair 🍂🌼", "-pfp", "𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻");
        } catch (error) {
            console.error(error);
            await client.sendMessage(M.from, { text: 'An error occurred while fetching images.' }, { quoted: M });
        }
    }
};
