module.exports = {
    name: 'gpt',
    aliases: ['ai'],
    category: 'utils',
    exp: 5,
    react: "✅",
    description: 'Let you chat with GPT chat bot',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
    
        try {
            // Check if OpenAI API key is provided
            if (!process.env.WRITE_SONIC) return M.reply('🟥 *You did not provide any API key for usage!*');
            
            // Define user and context
            const user = "918961331275@s.whatsapp.net";
            if (!arg) return M.reply('🟥 *Sorry, you did not provide any term!*');
            
            // Handle specific questions about the bot's creator
            const creatorQuestions = [
                'who made you', 'who is your creator', 'who is your owner',
                'who wrote your code', 'who write your code', 'name of your create',
                'number of your creator', 'no. of your creator', 'no of your creator',
                'creator', 'owner', 'creator name', 'owner name'
            ];
            if (creatorQuestions.includes(arg.toLowerCase())) {
                return await client.sendMessage(
                    M.from,
                    { text: `@${user.split("@")[0]} is my owner`, mentions: [user] },
                    { quoted: M }
                );
            }

            // Handle specific greetings
            const greetings = ['hey', 'hey, how are you', 'hey how are you', 'hey how are you gpt', 'hey gpt', 'hey, how are you gpt'];
            if (greetings.includes(arg.toLowerCase())) {
                return await client.sendMessage(
                    M.from,
                    { text: `Hey! ${(await client.contact.getContact(M.sender, client)).username} how can I help you today.` },
                    { quoted: M }
                );
            }

            // Assuming WriteSonic_gpt is an asynchronous function
            const res = await client.AI.WriteSonic_gpt(arg);
            M.reply(res.response.data.message);
        } catch (err) {
            M.reply(err.toString());
            client.log(err, 'red');
        }
    }
};
