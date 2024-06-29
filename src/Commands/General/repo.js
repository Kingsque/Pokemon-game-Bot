const axios = require('axios');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'Repo',
    aliases: ['repo','script'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "👿",
    usage: 'Use :- Hahaha Leave it!!! ',
    description: 'Fool Kid You think 💬 This bot is a public one ⁉',
    async execute(client, arg, M) {

        const getGroups = await client.groupFetchAllParticipating();
        const groups = Object.entries(getGroups).map((entry) => entry[1]);
        const groupCount = groups.length;
        const pad = (s) => (s < 10 ? '0' : '') + s;
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / (60 * 60));
            const minutes = Math.floor((seconds % (60 * 60)) / 60);
            const secs = Math.floor(seconds % 60);
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        };
        const uptime = formatTime(process.uptime());
        const usersCount = await client.DB.get(`data`) || []
        const usersCounts = usersCount.length
        const modCount = client.mods.length;
        const website = 'coming soon...';
        
        let text = `*┌───────────❀̥˚─┈ ⳹*\n`;
        text += `*│ɪ ᴛ ᴧ ᴄ ʜ ɪ ❤️*\n`;
        text += `*│🏮 ʀᴇᴘᴏ ꜱɪᴢᴇ:-* • 305MB\n`;
        text += `*│👥 ᴜꜱᴇʀ:-* ${usersCounts || 0}\n`;
        text += `*│🗃️ ʟᴀꜱᴛ ᴜᴘᴅᴀᴛᴇᴅ:-* June 25TH\n`;
        text += `*│💽 ᴛʜᴀɴᴋ ʏᴏᴜ ᴀʟʟ ғᴏʀ ᴜꜱɪɴɢ*\n`;
        text += `*│ᴍʏ ʙᴏᴛ ᴀɴᴅ ꜱᴜᴘᴘᴏʀᴛɪɴɢ ᴍᴇ...*\n`;
        text += `*│❤️ ᴏᴡɴᴇʀ:-* @ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ\n`;
        text += `*└❀̥˚───────────────┈ ⳹*`;

        const imageMessage = await prepareWAMessageMedia({ image: { url: "https://telegra.ph/file/18697b6f6d1e1b9bb45e9.jpg" }}, { upload: client.waUploadToServer });
 
  let msg = generateWAMessageFromContent(M.from, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `${text}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
             ...imageMessage,
            title: "",
            subtitle: "",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Bot Owner 📬\",\"id\":\"-owner\"}"
              }
           ],
          })
        })
    }
  }
}, {})

await client.sendMessage(
          M.from,
          {
            image: { url: "" },
            caption: text
          },
          {
            quoted: M
          }
        );
    }
}; 
