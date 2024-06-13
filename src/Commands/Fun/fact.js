const axios = require('axios');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'fact',
    aliases: ['ft'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "🍥",
    usage: 'Use :fact',
    description: 'Sends random facts',
    async execute(client, arg, M) { 
        try {
            const response = await axios.get('https://nekos.life/api/v2/fact');
            const text = `Fact for you: ${response.data.fact}`;
            
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
            text: "© ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡"
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
                "buttonParamsJson": "{\"display_text\":\"Next Fact\",\"id\":\"/-fact\"}"
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
            console.error('Error fetching fact:', err);
            M.reply('Error fetching fact. Please try again later.');
        }
    }
};
