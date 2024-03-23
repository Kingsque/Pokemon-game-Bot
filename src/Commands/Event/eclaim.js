module.exports = {
  name: 'eredeem',
  aliases: ['ebuy'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'event',
  description: 'Claim the card',
  async execute(client, arg, M) {
  const mode = await client.event.get(`EVENTS`);

if (mode === 'OFF') {
    return M.reply('🟥No event is going currently!');
}
  
  M.reply('hi')
  
  }
 }
