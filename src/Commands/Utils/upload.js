const axios = require('axios')
const {uploadByBuffer} = require('telegraph-uploader')

module.exports = {
    name: 'upload',
    aliases: ['tourl'],
    category: 'utils',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :upload attched to a gif/image/video (media limit 5mb)',
    description: 'Translates a text to a specific language',
    async execute(client, arg, M) {
if (!M.hasSupportedMediaMessage && !M.quoted?.hasSupportedMediaMessage)
            return M.reply('Provide an image/gif/video by captioning it as a message or by quoting it')
        let buffer
        if (M.hasSupportedMediaMessage) buffer = await M.downloadMediaMessage(M.message.message)
        else if (M.quoted && M.quoted.hasSupportedMediaMessage) buffer = await M.downloadMediaMessage(M.quoted.message)
        try {
            const result = await uploadByBuffer(buffer)
            return (await M.reply(`*Media Uploaded To Telegraph* \n\n*Link:* ${result.link}`))
        } catch (error) {
            return (await M.reply('An error occurred. Try again later'))
        }
    }
}
  
