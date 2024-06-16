const TD = require('better-tord');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    cool: 4,
    react: "✅",
    usage: 'Use :td truth or dare',
    description: 'Gives you truth or dare.',
    async execute(client, arg, M) {
        if (!arg) {
        let msg = generateWAMessageFromContent(M.from, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `choose from the below list:-`
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
                "buttonParamsJson": "{\"display_text\":\"Truth\",\"id\":\":td truth\"}"
              },
                {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Dare\",\"id\":\":td dare\"}"
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
        }
        
        const availableOptions = ['truth', 'dare'];
        const option = arg.trim().toLowerCase();

        if (!availableOptions.includes(option)) {
            return M.reply(`Invalid option. Please choose from:\n${availableOptions.join(', ')}`);
        }

        try {
            const result = option === 'truth' ? await TD.get_truth() : await TD.get_dare();
            M.reply(`Here's your ${option}: ${result}`);
        } catch (error) {
            console.error('Error fetching truth or dare:', error);
            M.reply('Sorry, I couldn\'t fetch a truth or dare at the moment. Please try again later.');
        }
    }
};
