module.exports = {
    name: 'hi',
    aliases: ['hello'],
    category: 'general',
    exp: 0,
    react: "🍥",
    description: 'says hi to bot',
    async execute(client, arg, M) {       
        
       const hello = ['konnichiwa', 'hello', 'hi', 'kya haal?', 'sab badiya?'];
        const hi = hello[Math.floor(Math.random() * hello.length)];
        
        M.reply(
             `${hi} ${
                (await client.contact.getContact(M.sender, client)).username
            }. How are you today?`)
    }
}
