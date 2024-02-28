const ms = require('parse-ms');

module.exports = {
    name: 'hi',
    aliases: ['hello'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "🍥",
    description: 'says hi to bot',
    async execute(client, arg, M) { 
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.hi`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        const hello = ['konnichiwa', 'hello', 'hi', 'kya haal?', 'bonjour', 'hola', 'hallo'];
        const hi = hello[Math.floor(Math.random() * hello.length)];
        
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact ? contact.username : 'there';
        
        M.reply(`${hi} ${username}. How are you today?`);
        await client.DB.set(`${M.sender}.hi`, Date.now());
    }
}