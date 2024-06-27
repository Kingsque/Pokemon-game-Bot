const axios = require('axios');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'advice',
    aliases: ['ad'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "📢",
    usage: 'Use :fact',
    description: 'Sends random facts',
    async execute(client, arg, M) { 
        try {
            const response = await axios.get('https://api.adviceslip.com/advice');
            const text = `*📚 Advice For You:-*\n> ${response.data.slip.advice}`;
            
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
            title: "",
            subtitle: "",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Next One 🎐\",\"id\":\"-ad\"}"
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
