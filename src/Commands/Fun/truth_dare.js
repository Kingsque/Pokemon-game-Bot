const TD = require('better-tord');
const { shizobtn1, shizobtn1img, shizobtn1gif, shizobtn2 } = require('../../shizofunc.js')

module.exports = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    cool: 4,
    react: "🎯",
    usage: 'Use :td truth or dare',
    description: 'Gives you truth or dare.',
    async execute(client, arg, M) {
        if (!arg) return shizobtn2(client, M.from, 'choose from the below list:-', 'Truth', '-td truth', 'Dare', '-td dare', '𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻')
        const availableOptions = ['truth', 'dare'];
        const option = arg.trim().toLowerCase();
        try {
            const result = option === 'truth' ? await TD.get_truth() : await TD.get_dare();
            M.reply(`Here's your ${option}: ${result}`);
        } catch (error) {
            console.error('Error fetching truth or dare:', error);
            M.reply('Sorry, I couldn\'t fetch a truth or dare at the moment. Please try again later.');
            
            await client.sendMessage(
            M.from,
            {
                image: { url: "https://i.ibb.co/Ldd8bp7/1057308.jpg" },
                caption: text
            },
            {
                quoted: M
            }
        )
    }
}};
