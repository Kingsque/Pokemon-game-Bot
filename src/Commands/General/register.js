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
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.register`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
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