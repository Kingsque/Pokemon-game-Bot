const axios = require('axios')

module.exports = {
    name: 'repo',
    aliases: ['repo','script'],
    category: 'general',
    react: "🐼",
    usage: '',
    description: 'Fool Kid You think 💬 This bot is a public one ⁉️',
    async execute(client, arg, M) {

         const image = (
   'https://telegra.ph/file/d9f62603e0c7a7918fae1.jpg'
);

try {
                let repoInfo = await axios.get('https://api.github.com/repos/HELLRYZEN/mai_sakurajima')
                if (!repoInfo) {
                    return M.reply('Failed to fetch repo information.');
                }
                let repo = repoInfo.data
                let txt = `~*ɪ ᴛ ᴧ ᴄ ʜ ɪ 💬*~\n\n*📜 ʟɪᴄᴇɴꜱᴇ:-* Mai_Sakurajima-2024\n*📁 ʀᴇᴘᴏ ꜱɪᴢᴇ:-* • 305MB\n*📅 ʟᴀꜱᴛ ᴜᴘᴅᴀᴛᴇᴅ:-* Last updated June 25TH\n*ᴛʜᴀɴᴋ ʏᴏᴜ ᴀʟʟ ғᴏʀ ᴜꜱɪɴɢ ᴍʏ ʙᴏᴛ ᴀɴᴅ ꜱᴜᴘᴘᴏʀᴛɪɴɢ ᴍᴇ...*`
      
     await client.sendMessage(M.from, { image : { url : thumbnailUrl} , caption: txt , gifPlayback: true} , {quoted: M})
      }catch(err){
    await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
  }
          
    }
}
