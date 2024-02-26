module.exports = {
  name: 'noticeboard',
  aliases: ['notice','nb'],
  category: 'general',
  exp: 5,
  react: "✅",
  description: 'This is noteboard. You can check here about updates.',
  async execute(client, arg, M) {

  const notice = await client.DB.get(`notice`)
  const notic = await client.DB.get(`notic`)
  const noti = await client.DB.get(`noti`)
const not = await client.DB.get(`not`)
const no = await client.DB.get(`no`)
const n = await client.DB.get(`n`)

   let text = `📛NOTICEBOARD📛\n\n1) ${notice}\n\n2) ${notic}\n\n3) ${noti}\n\n4) ${not}\n\n5) ${no}\n\n6) ${n}.`
   
    M.reply(text)
    }
  } 
