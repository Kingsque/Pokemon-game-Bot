module.exports = {
    name: 'register',
    aliases: ['registry'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Register their names for any competitions',
    async execute(client, arg, M) {
        
        if (arg === 'me') {
            const tournament = await client.DB.get('tournament');
            await client.DB.push('tournament-users', M.sender); 
            return M.reply('You are registered for the tournament');
        } else {
            return M.reply('Use `:register me` to register in the tournament');
        }
    }
};