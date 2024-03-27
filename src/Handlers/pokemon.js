const axios = require('axios');
const cron = require("node-cron");
const { Message } = require("./Message");

module.exports = PokeHandler = async (client, m) => {
    try {
        let wilds = await client.DB.get('wild');
        const wild = wilds || [];

        for (let i = 0; i < wild.length; i++) {
            const jid = wild[i];

            if (wild.includes(jid)) {
                cron.schedule('*/10 * * * *', async () => {
                    try {
                        const id = Math.floor(Math.random() * 1025);
                        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                        const pokemon = response.data;

                        const name = pokemon.name; 
                        const types = pokemon.types.map(type => type.type.name); 
                        const image = pokemon.sprites.other['official-artwork'].front_default; 
                        const level = Math.floor(Math.random() * (30 - 15) + 15);

                        console.log(`Spawned: ${pokemon.name} in ${jid}`);
                        await client.DB.set(`${jid}.pokemon`, `${pokemon.name}`);

                        const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Type(s): ${types.join(', ')}* \n\n *🀄ʟevel = 「 ${level} 」* \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >* \n\n *「 ɢᴇᴛ ᴛʜɪꜱ ᴘᴏᴋᴇᴍᴏɴ ɪɴ ʏᴏᴜʀ ᴅᴇꭗ 」*`;

                        await client.sendMessage(jid, {
                            image: {
                                url: image,
                            },
                            caption: message,
                        });

                    } catch (err) {
                        console.log(err);
                        await client.sendMessage(jid, {
                            text: `Error occurred while spawning Pokémon.`
                        });
                    }
                });
            }

            cron.schedule('*/5 * * * *', async () => {
                await client.DB.delete(`${jid}.pokemon`);
                console.log(`Pokemon deleted after 5 minutes`);
            });
        }
    } catch (error) {
        console.error("Error in PokeHandler:", error);
    }
};
  
