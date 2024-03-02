const { getAudioUrl } = require('google-tts-api');
const languages = require('bing-translate-api/src/lang.json');
const ms = require('parse-ms');

module.exports = {
    name: 'texttospeech',
    aliases: ['tts'],
    category: 'utils',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Text to speech',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.tts`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            // Determine the text and language from the argument or quoted message
            const message = M.quoted ? M.quoted.message.conversation : arg;
            const language = arg.split('-')[1] || 'en';
            await client.DB.set(`${M.sender}.tts`, Date.now());

            // Validate the language
            if (!Object.keys(languages).includes(language)) {
                return M.reply(
                    'Speech for ' +
                    language +
                    ' is unavailable\n\n' +
                    'AVAILABLE LANGUAGE\n\n```' +
                    Object.keys(languages).join('```, ')
                );
            }

            // Generate audio URL
            const url = await getAudioUrl(message.split('-')[0], {
                lang: language,
                slow: false,
                host: 'https://translate.google.com'
            });

            // Send the audio file
            await client.sendMessage(
                M.from,
                {
                    audio: {
                        url
                    },
                    mimetype: 'audio/mpeg',
                    fileName: language + '.m4a'
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error('Error in texttospeech command:', error);
            await M.reply('An error occurred while processing the command.');
        }
    }
};