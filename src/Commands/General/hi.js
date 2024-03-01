module.exports = {
    name: 'hi',
    aliases: ['hello'],
    category: 'general',
    exp: 0,
    cool: 4, // Cooldown in seconds
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
        
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
        const now = Math.floor(Date.now() / 1000);

        if (lastSlot !== null && now - lastSlot < cooldownSeconds) {
            const remainingCooldown = cooldownSeconds - (now - lastSlot);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }

        const hello = ['konnichiwa', 'hello', 'hi', 'kya haal?', 'bonjour', 'hola', 'hallo'];
        const hi = hello[Math.floor(Math.random() * hello.length)];
        
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact ? contact.username : 'there';
        
        await client.DB.set(`${M.sender}.${commandName}`, now); // Update cooldown timestamp
        M.reply(`${hi} ${username}. How are you today?`);
    }
}
