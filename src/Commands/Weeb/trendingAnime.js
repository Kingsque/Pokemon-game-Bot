const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'trendinganime',
    aliases: ['ta', 'trendani'],
    category: 'weeb',
    exp: 4,
    react: "✅",
    description: 'Gives you the list of trending anime',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.trendinganime`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            const res = await axios.get(`https://api.consumet.org/meta/anilist/trending`);
            const trends = res.data.results;

            for (let i = 0; i < trends.length; i++) {
                let text = '==== *TRENDING ANIME* ====\n\n';
                text += `*Name:* ${trends[i].title.english || trends[i].title.romaji || trends[i].title.native}\n`;
                text += `*Status:* ${trends[i].status}\n`;
                text += `*Rating:* ${trends[i].rating}\n`;
                text += `*Release Date:* ${trends[i].releaseDate}\n`;
                text += `*Genres:* ${trends[i].genres.join(', ')}\n`;
                text += `*Total Episodes:* ${trends[i].totalEpisodes}\n`;
                text += `*Duration:* ${trends[i].duration}\n`;
                text += `*Type:* ${trends[i].type}\n`;
                text += `*Description:* ${trends[i].description || 'Not available'}\n\n========================\n`;

                await client.sendMessage(M.from, {
                    image: {
                        url: trends[i].image
                    },
                    caption: text
                });
            }

            await client.DB.set(`${M.sender}.trendinganime`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error fetching trending anime:', error);
            M.reply('Failed to fetch trending anime.');
            client.log(error, 'red');
        }
    }
};