module.exports = {
    name: 'event',
    aliases: ['event'],
    exp: 0,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Bans the taged user',
    async execute(client, arg, M) {

  if ( arg === 'on') {
    await client.event.set(`EVENTS`, 'ON');
    M.reply(`Events has been started`);
  } else if ( arg === 'off') {
    await client.event.set(`EVENTS`, 'OFF');
    M.reply(`Events has been turned off`);
  } else return M.reply('Use :event on or off')
    }
}                        
