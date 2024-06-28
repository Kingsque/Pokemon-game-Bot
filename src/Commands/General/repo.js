const axios = require('axios')

module.exports = {
    name: 'repo',
    aliases: ['repo','script'],
    category: 'general',
    react: "🐼",
    usage: '',
    description: 'Fool Kid You think 💬 This bot is a public one ⁉️',
    async execute(client, arg, M) {

         const thumbnailUrls = [
   'https://telegra.ph/file/d9f62603e0c7a7918fae1.jpg',
];

function getRandomThumbnailUrl() {
    const randomIndex = Math.floor(Math.random() * thumbnailUrls.length);
    return thumbnailUrls[randomIndex];
}
  const thumbnailUrl = getRandomThumbnailUrl()

try {
                let repoInfo = await axios.get('*ᴏᴡɴᴇʀ ᴄᴏɴᴛᴀᴄᴛ ɴᴜᴍʙᴇʀ*')
                if (!repoInfo) {
                    return M.reply('Failed to fetch repo information.');
                }
                let repo = repoInfo.data
                let txt = `~*ɪ ᴛ ᴧ ᴄ ʜ ɪ 💬*~\n\n*📜 ʟɪᴄᴇɴꜱᴇ:-* ${repo.license.name}\n*📁 ʀᴇᴘᴏ ꜱɪᴢᴇ:-* ${(repo.size/1024).toFixed(2)} MB\n*📅 ʟᴀꜱᴛ ᴜᴘᴅᴀᴛᴇᴅ:-* ${repo.updated_at}\n*ᴛʜᴀɴᴋ ʏᴏᴜ ᴀʟʟ ғᴏʀ ᴜꜱɪɴɢ ᴍʏ ʙᴏᴛ ᴀɴᴅ ꜱᴜᴘᴘᴏʀᴛɪɴɢ ᴍᴇ...`
      
     await client.sendMessage(M.from, { image : { url : thumbnailUrl} , caption: txt , gifPlayback: true} , {quoted: M})
      }catch(err){
    await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
  }
          
    }
}
