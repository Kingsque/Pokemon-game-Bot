const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'getgif',
    aliases: ['gify'],
    category: 'utils',
    exp: 7,
    react: "✅",
    description: 'Searches for a gif',
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
        const lastSlot = await client.DB.get(`${M.sender}.getgif`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');
            
            const response = await axios.get(`https://g.tenor.com/v1/search?q=${arg}&key=LIVDSRZULELA&limit=8`);
            
            if (!response.data || !response.data.results || response.data.results.length === 0) {
                return M.reply('No gifs found.');
            }
            
            const randomIndex = Math.floor(Math.random() * response.data.results.length);
            const gifUrl = response.data.results[randomIndex]?.media[0]?.mp4?.url;

            if (!gifUrl) {
                return M.reply('Failed to retrieve gif URL.');
            }

            client.sendMessage(
                M.from,
                {
                    video: {
                        url: gifUrl
                    },
                    caption: 'Here you go',
                    gifPlayback: true
                },
                {
                    quoted: M
                }
            );

            await client.DB.set(`${M.sender}.getgif`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error fetching gif:', error);
            M.reply('An error occurred while fetching the gif.');
        }
    }
};