module.exports = {
name: 'rule',
aliases: ['rules'],
category: 'general',
exp: 15,
cool: 4,
react: "✅",
usage: 'Use :rule',
description: 'Here you can get the rules of our bot ehivh is made to be maintained and breaking rules have punishments.',
async execute(client, arg, M) {

  const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

  const text = ''
  text += `👑Rules👑\n`
  text += `1) *No spam in bot*\n`
  text += `2) *Don't send unnecessary things to the bot*\n`
  text += `3) *Don't fight or use slang in our official groups*\n`
  text += `4) *Any rule breaking may result in a ban*\n`
  text += `5) *In one auction one user can only win a single card*\n`
  text += `6) *Dont use by for searching any insulting or nudify or controversial matter*\n`
  text += `7) *Dont call the bot or send spam messages in the bits DM*\n`
  await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
       }
      } 
