/* const google = require('googlethis')

module.exports = {
    name: 'imagesearch',
    aliases: ['imgs'],
    category: 'utils',
    exp: 7,
    react: "✅",
    description: 'Searches image from google.com',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const nsfw = (await client.DB.get('nsfw')) || []
        const images = await google.image(arg, { safe: nsfw.includes(M.from) }).catch((err) => {
            return M.reply('Could not find the searched term')
        })
        client.sendMessage(M.from, {
            image: {
                url: images[0].url
            },
            caption: 'Here you go'
        })
    }
} */



const fetch = require('node-fetch');

const apiKey = 'AIzaSyD8yD-Bx4Pb43lKoOKl-mLOdujQWV_wIAs';
const cx = 'e47f554165f6a4137';

module.exports = {
    name: 'getimg',
    aliases: ['searchimg'],
    category: 'utils',
    exp: 1,
    react: "🎶",
    usage: 'Use :getimg <context>',
    description: 'Searches image from google.com',
    cool: 4,
    async execute(client, arg, M) {
        try {
            if (!arg || arg.length === 0) {
                return M.reply('Sorry, you did not provide any search term!');
            }

            const searchTerm = arg.join(' ');
            const url = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&searchType=image&key=${apiKey}&cx=${cx}`;

            const response = await fetch(url);
            const data = await response.json();

            // Check if the response contains valid data
            if (!data.items || data.items.length === 0) {
                return M.reply('Could not find any images for the searched term.');
            }

            // Get the URL of the first image
            const imageUrl = data.items[0].link;

            M.reply('Searching for the image from the web...');

            // Send the image URL as a message
            await client.sendMessage(M.from, {
                image: { url: imageUrl },
                caption: `Here is the result for your searched image (${searchTerm})`
            });
        } catch (error) {
            console.error('Error searching for images:', error);
            M.reply('An error occurred while searching for images.');
        }
    }
};
