module.exports = {
    name: 'gpt',
    aliases: ['gpt'],
    category: 'utils',
    exp: 5,
    react: "✅",
    description: 'Let you chat with GPT chat bot',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        try {
            const configuration = new Configuration({
                apiKey: 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,
            });
            const openai = new OpenAIApi(configuration);

            if (!process.env.openAi) {
                return M.reply("Our AI API is not working now, please wait!");
            }
            if (!arg) {
                return M.reply('Provide a query!');
            }

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            async function generateResponse(prompt, retries = 2) {
                try {
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: prompt }],
                    });

                    console.log("API Key:", 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);

                    return completion.data.choices[0].message.content.trim();
                } catch (error) {
                    if (error.response && error.response.status === 429 && retries > 0) {
                        const retryAfter = error.response.headers["retry-after"] * 1000 || 5000;
                        M.reply(`Rate limit exceeded. Retrying in ${retryAfter / 1000} seconds...`);
                        await sleep(retryAfter);
                        return generateResponse(prompt, retries - 1);
                    } else {
                        console.error(error);
                        return "Error occurred while generating response - API usage limit exceeded or wrong API key.";
                    }
                }
            }

            const response = await generateResponse(arg);
            return M.reply(response);
        } catch (err) {
            M.reply(err.toString());
            client.log(err, 'red');
        }
    }
};
