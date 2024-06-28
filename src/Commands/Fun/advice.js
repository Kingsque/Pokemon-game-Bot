const axios = require('axios');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'Advice',
    aliases: ['advice','adv'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "📢",
    usage: 'Use :Advice',
    description: 'Sends random Advice',
    async execute(client, arg, M) { 
        try {
            const response = await axios.get('https://api.adviceslip.com/advice');
            const text = `*📚 Advice for you:-*\n> ${response.data.slip.advice}`;
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
            title: "Advice From Web 💟",
            subtitle: "",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Next Advice 📚\",\"id\":\"-adv\"}"
              }
           ],
          })
        })
    }
  }
}, {})

await client.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
})
        } catch (err) {
            console.error('Error fetching Advice:', err);
            M.reply('Error fetching Advice. Please try again later.');
        }
    }
};
