const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const configuration = new Configuration({
    apiKey: process.env.openAi
});
const openai = new OpenAIApi(configuration);

/**
 * Generate text using GPT-3.5-turbo model
 * @param {string} text - Input text
 * @returns {Promise<{response: string}>}
 */
const gpt = async (text) => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }]
    });
    return { response: completion.data.choices[0].message.content };
};

/**
 * Generate image based on prompt
 * @param {string} text - Prompt for image generation
 * @returns {Promise<{response: Object}>}
 */
const createImage = async (text) => {
    const results = await openai.createImage({
        prompt: text,
        n: 10,
        size: '1024x1024'
    });
    return { response: results };
};

/**
 * Edit image based on prompt
 * @param {string} text - Prompt for image editing
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<{response: Object}>}
 */
const editImage = async (text, buffer) => {
    const response = await openai.createImageEdit(
        buffer,
        fs.createReadStream('image.png'),
        text,
        2,
        '1024x1024'
    );
    return { response: response };
};

/**
 * Chat using text-davinci-003 model
 * @param {string} text - Input text
 * @returns {Promise<{response: string}>}
 */
const chat = async (text) => {
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: text,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0
    });
    return { response: completion.data.choices[0].text };
};

module.exports = {
    gpt,
    createImage,
    editImage,
    chat
};
