const ms = require('parse-ms');

module.exports = {
    name: 'register',
    aliases: ['registry'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Register their names for any competitions',
    async execute(client, arg, M) {
    
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        
        if (arg === 'me') {
            const tournament = await client.DB.get('tournament');
            await client.DB.push('tournament-users', M.sender); 
            await client.DB.set(`${M.sender}.register`, Date.now());
            return M.reply('You are registered for the tournament');
        } else {
            return M.reply('Use `:register me` to register in the tournament');
        }
    }
};