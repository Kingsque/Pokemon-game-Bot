module.exports = {
    name: 'magic',
    aliases: ['magic'],
    category: 'general',
    exp: 0,
    cool: 20, // Cooldown in seconds
    react: "🍥",
    usage: 'Use :magic to check bot',
    description: 'Experience a magical journey.',
    async execute(client, arg, M) { 
        try {
            // Define the stages of the journey with corresponding emojis and patterns
            const journeyStages = [
                { pattern: [
                    "🌍🚀🌍",
                    "🌍🌍🌍",
                    "🌍🌍🌍"
                  ], delay: 0 },
                { pattern: [
                    "🌍🚀🌍",
                    "🌍🚀🌍",
                    "🌍🌍🌍"
                  ], delay: 5000 },
                { pattern: [
                    "🌍🚀🌍",
                    "🌍🚀🌍",
                    "🌍🚀🌍"
                  ], delay: 10000 },
                { pattern: [
                    "🌍🚀🌍",
                    "🚀🚀🚀",
                    "🌍🚀🌍"
                  ], delay: 15000 },
                { pattern: [
                    "🚀🚀🚀",
                    "🚀🚀🚀",
                    "🚀🚀🚀"
                  ], delay: 20000 },
                { pattern: [
                    "🚀🚀🚀",
                    "🚀🌌🚀",
                    "🚀🚀🚀"
                  ], delay: 25000 }
            ];

            // Send initial message to start the journey
            let { key } = await M.reply("🌌 Initiating journey to magical planets...");

            // Simulate journey by editing messages with emojis and patterns at intervals
            journeyStages.forEach(async (stage, index) => {
                setTimeout(async () => {
                    await client.relayMessage(M.from, {
                        protocolMessage: {
                            key,
                            type: 14,
                            editedMessage: {
                                conversation: stage.pattern.join("\n")
                            }
                        }
                    }, {})
                }, stage.delay);
            });
        } catch (error) {
            console.error('Error in executing magic command:', error);
            M.reply('An error occurred while executing the magic command.');
        }
    }
}
