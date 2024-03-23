module.exports = {
    name: 'events',
    aliases: ['events'],
    category: 'event',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows the details of cirrent ongoing event',
    async execute(client, arg, M) {
    const mode = await client.event.get(`EVENTS`);

if (mode === 'OFF') {
    return M.reply('🟥No event is going currently!');
}
        let event = `Event`
        
        M.reply(event);
        }
      }
      
