module.exports = {
    name: 'magic',
    aliases: ['magic'],
    category: 'general',
    exp: 0,
    cool: 20, // Cooldown in seconds
    react: "🍥",
    usage: 'Use :magic to check bot',
    description: 'Says hi to the bot.',
    async execute(client, arg, M) { 
    try {
        // Define the stages of the journey with corresponding emojis
        const journeyStages = [
            { text: "🌌 Journey starting...", delay: 0 },
            { text: "🌍 Spaceship launching from Earth...", delay: 5000 },
            { text: "🚀 Spacecraft reaching the sky...", delay: 10000 },
            { text: "🌠 Entering the depths of space...", delay: 15000 },
            { text: "🪐 Approaching the magical planet...", delay: 20000 },
            // Add more stages as needed
            { text: "🎉 Journey complete! Welcome to the magical planet.", delay: 25000 }
        ];

        // Send initial message to start the journey
        let { key } = await M.reply("🌌 Initiating journey to magical planets...");

        // Simulate journey by editing messages with emojis and descriptive text at intervals
        journeyStages.forEach(async (stage, index) => {
            setTimeout(async () => {
                await client.relayMessage(M.from, {
                    protocolMessage: {
                        key,
                        type: 14,
                        editedMessage: {
                            conversation: stage.text
                        }
                    }
                }, {})
            }, stage.delay);
        });
    } catch (error) {
        console.error('Error in executing hi command:', error);
        M.reply('An error occurred while executing the hi command.');
    }
}
