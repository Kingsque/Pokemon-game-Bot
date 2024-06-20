const TD = require('better-tord');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'shinjitsu',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    cool: 4,
    react: "🎯",
    usage: 'Use: Shinjitsu for truth or dare',
    description: 'Gives you truth or dare.',
    async execute(client, arg, M) {
        if (!arg) {
            const imageMessage = await prepareWAMessageMedia({ image: { url: "https://telegra.ph/file/d1eaee5deb630cb4f20f0.jpg" }}, { upload: client.waUploadToServer });

                let msg = generateWAMessageFromContent(M.from, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `choose from the below list`
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
                "buttonParamsJson": "{\"display_text\":\"Truth\",\"id\":\"-td truth\"}"
              },
                                       {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Dare\",\"id\":\"-td dare\"}"
              } 
                                    ],
                                })
                            })
                        }
                    }
                }, {});
        }
        const availableOptions = ['truth', 'dare'];
        const option = arg.trim().toLowerCase();
        try {
            const result = option === 'truth' ? await TD.get_truth() : await TD.get_dare();
            M.reply(`Here's your ${option}: ${result}`);
        } catch (error) {
            console.error('Error fetching truth or dare:', error);
            M.reply('Sorry, I couldn\'t fetch a truth or dare at the moment. Please try again later.');
        }
    }
};
