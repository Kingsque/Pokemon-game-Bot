module.exports = {
  name: 'rules',
  aliases: ['stuffs','matters'],
  category: 'general',
  exp: 5,
  react: "✅",
  description: 'This is rules of our bot.',
  async execute(client, arg, M) {

  const notice = await client.DB.get(`rules`)
  const notic = await client.DB.get(`rules2`)
  const noti = await client.DB.get(`rules3`)
const not = await client.DB.get(`rukes4`)
const no = await client.DB.get(`rules5`)
const n = await client.DB.get(`rules6`)

   let text = `📛REGULATIONS📛\n\n1) ${notice}\n\n2) ${notic}\n\n3) ${noti}\n\n4) ${not}\n\n5) ${no}\n\n6) ${n}.`
   
    M.reply(text)
    }
  } 
