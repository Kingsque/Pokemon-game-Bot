module.exports = {
    name: 'poke',
    aliases: ['pokeinfo'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :info',
    description: 'Get bot information',
    async execute(client, arg, M) {
        const getGroups = await client.groupFetchAllParticipating();
        const groups = Object.entries(getGroups).map((entry) => entry[1]);
        const groupCount = groups.length;
        const pad = (s) => (s < 10 ? '0' : '') + s;
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / (60 * 60));
            const minutes = Math.floor((seconds % (60 * 60)) / 60);
            const secs = Math.floor(seconds % 60);
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        };
        const uptime = formatTime(process.uptime());
        const usersCount = await client.DB.get(`data`) || []
        const usersCounts = usersCount.length
        const modCount = client.mods.length;
        const website = 'coming soon...';
        
        let text = `(¬‿¬) *${process.env.NAME}'s info*\n\n`;
        text += `💠 *UPTIME:* ${uptime}\n`;
        text += `💠 *USERS:* ${usersCounts || 0}\n`;
        text += `💠 *COMMANDS:* ${client.cmd.size}\n`;
        text += `💠 *Groups:* ${groupCount}\n`;
        text += `💠 *Mods:* ${modCount}\n`;
        text += `💠 *Website:* ${website}`;

        // Fetch Pokemon move details
        const pokemonName = arg; // Pokemon name passed as argument to the command
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            const moves = data.moves.slice(0, 2); // Extracting the first two moves

            let moveDetails = "Here are the first two moves of " + pokemonName + ":\n";
            for (const move of moves) {
                const moveName = move.move.name;
                const moveUrl = move.move.url;
                const moveDataResponse = await fetch(moveUrl);
                const moveData = await moveDataResponse.json();
                const movePower = moveData.power;
                const moveAccuracy = moveData.accuracy;
                const movePP = moveData.pp;
                const moveType = moveData.type.name;
                const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

                moveDetails += `
Name: ${moveName}
Power: ${movePower}
Accuracy: ${moveAccuracy}
PP: ${movePP}
Type: ${moveType}
Description: ${moveDescription}
`;
            }

            text += "\n\n" + moveDetails; // Append move details to the existing text
        } catch (error) {
            console.error("Error:", error);
        }

         await client.sendMessage(
          M.from,
          {
            image: { url: "https://i.ibb.co/tPhb428/Aurora.jpg" },
            caption: text
          },
          {
            quoted: M
          }
        );
    }
};
                  
