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
            // Define scenes with their respective displays
            const scenes = {
                "rocket_launch": [
                    [
                        "🌍🚀🌍",
                        "🌍🌍🌍",
                        "🌍🌍🌍"
                    ],
                    [
                        "🌍🚀🌍",
                        "🌍🚀🌍",
                        "🌍🌍🌍"
                    ],
                    [
                        "🌍🚀🌍",
                        "🌍🚀🌍",
                        "🌍🚀🌍"
                    ]
                ],
                "rainy_to_clear_sky": [
                    [
                        "🌧️🌧️🌧️",
                        "🌧️🌧️🌧️",
                        "🌧️🌧️🌧️"
                    ],
                    [
                        "🌦️🌦️🌧️",
                        "🌦️🌦️🌧️",
                        "🌧️🌧️🌧️"
                    ],
                    [
                        "⛅⛅🌤️",
                        "⛅⛅🌤️",
                        "🌤️🌤️🌤️"
                    ]
                ],
                "underwater_adventure": [
                    [
                        "🌊🌊🐠🌊🌊",
                        "🌊🐟🐬🐟🌊",
                        "🐚🌊🐳🌊🐚"
                    ],
                    [
                        "🐠🐠🐟🐟🐟",
                        "🐙🐙🐙🐟🐙",
                        "🦑🐙🦑🐙🦑"
                    ],
                    [
                        "🦀🦀🦀🦀🦀",
                        "🐚🐚🐚🐚🐚",
                        "🐡🐡🐡🐡🐡"
                    ]
                ],
                "forest_tranquility": [
                    [
                        "🌲🌲🍃🌲🌲",
                        "🌳🌳🌳🍂🌳",
                        "🌲🌲🍃🌲🌲"
                    ],
                    [
                        "🌿🍃🍂🌳🌳",
                        "🍁🌲🍁🍂🍁",
                        "🌲🌲🌲🌳🌳"
                    ],
                    [
                        "🌰🌰🌰🌰🌰",
                        "🍂🍂🍂🍂🍂",
                        "🦌🦌🦌🦌🦌"
                    ]
                ],
                "space_odyssey": [
                    [
                        "🌌✨🌌🚀🌌",
                        "🚀🌌🌠🌠🚀",
                        "🌌🌌🌌🌌🌌"
                    ],
                    [
                        "🌌🌌🚀🌌🌌",
                        "🚀🌌🌠🌠🚀",
                        "🌌🌌🌌🌌🌌"
                    ],
                    [
                        "🚀🌌🌠🌠🚀",
                        "🌌🌌🚀🌌🌌",
                        "🌌🌌🌌🌌🌌"
                    ]
                ],
                // Add more scenes here...
            };

            // If no argument provided, list all available scenes
            if (!arg) {
                const sceneNames = Object.keys(scenes).join(", ");
                return M.reply(`Available scenes: ${sceneNames}`);
            }

            // If scene provided, display its displays
            if (scenes[arg]) {
                let { key } = await M.reply("🌌 Initiating magical scene...");

                // Display each scene's displays
                scenes[arg].forEach(async (display, index) => {
                    setTimeout(async () => {
                        await client.relayMessage(M.from, {
                            protocolMessage: {
                                key,
                                type: 14,
                                editedMessage: {
                                    conversation: display.join("\n")
                                }
                            }
                        }, {})
                    }, index * 5000); // Delay between each display
                });
            } else {
                return M.reply("Scene not found. Use :magic to check available scenes.");
            }
        } catch (error) {
            console.error('Error in executing magic command:', error);
            M.reply('An error occurred while executing the magic command.');
        }
    }
}
