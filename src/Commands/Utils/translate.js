const { translate } = require('bing-translate-api');
const languages = require('bing-translate-api/src/lang.json');
const ms = require('parse-ms');

module.exports = {
    name: 'translate',
    aliases: ['tl'],
    category: 'utils',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Translates a text to a specific language',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.translate`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            // Determine the text and language from the argument or quoted message
            const message = M.quoted ? M.quoted.message.conversation : arg;
            const language = arg.split('-')[1] || 'en';
            await client.DB.set(`${M.sender}.translate`, Date.now());

            // Validate the language
            if (!Object.keys(languages).includes(language)) {
                return M.reply(
                    'Translation for ' +
                    language +
                    ' is unavailable\n\n' +
                    'AVAILABLE LANGUAGE\n\n```' +
                    Object.keys(languages).join('```, ')
                );
            }

            // Translate the message to the specified language
            const translationResult = await translate(message.split('-')[0], null, language);
            const translatedText = translationResult.translation;

            // Send the translated text
            await M.reply(translatedText);
        } catch (error) {
            console.error('Error in translate command:', error);
            await M.reply('An error occurred while processing the command.');
        }
    }
};