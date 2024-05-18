const axios = require('axios');
const { generateWAMessageFromContent, proto, generateWAMessage, areJidsSameUser } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'fact',
    aliases: ['ft'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :fact',
    description: 'Sends random facts',
    async execute(client, arg, M) { 
        try {
            const response = await axios.get('https://nekos.life/api/v2/fact');
            const text = `Fact for you: ${response.data.fact}`;
       let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: text
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "RedZeox"
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
                "buttonParamsJson": "{\"display_text\":\"Buttons Example\",\"id\":\"/owner\"}"
              },
              {
                 "name": "cta_url",
                 "buttonParamsJson": "{\"display_text\":\"url\",\"url\":\"https://www.google.com/search?q=Shizo+The+Techie\",\"merchant_url\":\"https://www.google.com/search?q=Shizo+The+Techie\"}"
              }
           ],
          })
        })
    }
  }
}, {})

 client.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
})
        } catch (err) {
            console.error('Error fetching fact:', err);
            M.reply('Error fetching fact. Please try again later.');
        }
    }
};