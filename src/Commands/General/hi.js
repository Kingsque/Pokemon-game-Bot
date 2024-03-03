module.exports = {
    name: 'hi',
    aliases: ['hello'],
    category: 'general',
    exp: 0,
    cool: 4, // Cooldown in seconds
    react: "🍥",
    description: 'Says hi to the bot.',
    async execute(client, arg, M) { 
        try {

            const hello = ['konnichiwa', 'hello', 'hi', 'kya haal?', 'bonjour', 'hola', 'hallo'];
            const hi = hello[Math.floor(Math.random() * hello.length)];
            
            const contact = await client.contact.getContact(M.sender, client);
            const username = contact && contact.username ? contact.username : 'there';
            M.reply(`${hi} ${username}. How are you today?`);
        } catch (error) {
            console.error('Error in executing hi command:', error);
            M.reply('An error occurred while executing the hi command.');
        }
    }
}
