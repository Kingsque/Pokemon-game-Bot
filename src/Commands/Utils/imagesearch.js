const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'imagesearch',
    aliases: ['imgs'],
    category: 'utils',
    exp: 7,
    react: "✅",
    description: 'Searches image from google.com',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.imagesearch`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            if (!arg) return M.reply('Sorry, you did not provide any search term!');
            
            // Perform a Google Image search
            const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${arg}&searchType=image&key=YOUR_API_KEY&cx=YOUR_CUSTOM_SEARCH_ENGINE_ID`);
            
            // Check if the response is successful
            if (!response.data || !response.data.items || response.data.items.length === 0) {
                return M.reply('Could not find any images for the searched term.');
            }
            
            // Get the URL of the first image
            const imageUrl = response.data.items[0].link;
            
            // Send the image URL as a message
            client.sendMessage(M.from, {
                image: {
                    url: imageUrl
                },
                caption: 'Here you go'
            });

            await client.DB.set(`${M.sender}.imagesearch`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error searching for images:', error);
            M.reply('An error occurred while searching for images.');
        }
    }
};