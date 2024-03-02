const TD = require('better-tord');
const ms = require('parse-ms');

module.exports = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    cool: 4,
    react: "✅",
    description: 'Gives you truth or dare.',
    async execute(client, arg, message) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.td`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        if (!arg) return message.reply('Please specify "truth" or "dare"!');
        
        const availableOptions = ['truth', 'dare'];
        const option = arg.trim().toLowerCase();

        if (!availableOptions.includes(option)) {
            return message.reply(`Invalid option. Please choose from:\n${availableOptions.join(', ')}`);
        }
        await client.DB.set(`${M.sender}.td`, Date.now());

        try {
            const result = option === 'truth' ? await TD.get_truth() : await TD.get_dare();
            message.reply(`Here's your ${option}: ${result}`);
        } catch (error) {
            console.error('Error fetching truth or dare:', error);
            message.reply('Sorry, I couldn\'t fetch a truth or dare at the moment. Please try again later.');
        }
    }
};