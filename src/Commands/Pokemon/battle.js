module.exports = {
    name: "battle",aliases: ["battle"],
    exp: 0,
    cool: 10,
    react: "⚔️",
    usage: 'Use :battle <@user>',
    category: "pokemon",
    description: "Challenge another user to a Pokémon battle.",
    async execute(client, arg, M) {
        try {
            const opponent = M.mentions.users.first(); // Get mentioned user
            if (!opponent) {
                return M.reply("Please mention a user to challenge to a battle.");
            }

            if (opponent.bot) {
                return M.reply("You can't battle against a bot!");
            }

            // Check if both users have Pokémon
            const userParty = await client.DB.get(`${M.sender}_Party`) || [];
            const opponentParty = await client.DB.get(`${opponent.id}_Party`) || [];

            if (userParty.length === 0 || opponentParty.length === 0) {
                return M.reply("Both you and your opponent need to have Pokémon to battle.");
            }

            // Confirm battle
            await M.reply(`You've challenged ${opponent.username} to a Pokémon battle!`);

            const filter = (response) => {
                return ['battle', 'swap', 'forfeit'].includes(response.content.toLowerCase()) && response.author.id === opponent.id;
            };

            const optionsMsg = await M.reply(`${opponent.username}, do you accept the challenge? Respond with "1" to accept battle, "2" to swap Pokémon, or "3" to forfeit.`);
            const collected = await M.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

            const choice = collected.first().content.toLowerCase();
            if (choice === '1') {
                await simulateBattle(client, M.sender, userParty, opponent, opponentParty, M);
            } else if (choice === '2') {
                await swapPokemon(client, M.sender, userParty, opponent.id, opponentParty, M);
            } else if (choice === '3') {
                await M.reply(`${opponent.username} has forfeited the battle! You win!`);
                return;
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    },
};

async function simulateBattle(client, userId, userParty, opponent, opponentParty, message) {
    // Implement battle logic here
    // This is just a placeholder function
    const userPokemon = userParty[0]; // Assume user's first Pokémon is battling
    const opponentPokemon = opponentParty[0]; // Assume opponent's first Pokémon is battling

    // Simulate battle outcome
    const userWins = Math.random() < 0.5; // 50% chance to win for demonstration purposes

    if (userWins) {
        // Handle user victory
        await message.reply(`You've won the battle against ${opponent.username}!`);
        // Gain experience for user's Pokémon
        const experienceGain = 100; // For demonstration purposes, you can adjust this based on battle difficulty or opponent's level
        userPokemon.level += 1; // Increase Pokémon's level
        await client.DB.set(`${userId}_Party`, userParty); // Update user's party in the database
        await message.reply(`${userPokemon.name} gained ${experienceGain} experience points and leveled up to level ${userPokemon.level}!`);
    } else {
        // Handle user defeat
        await message.reply(`You've lost the battle against ${opponent.username}. Better luck next time!`);
        // Implement logic for Pokémon fainting or other consequences
    }
}

async function swapPokemon(client, userId, userParty, opponentId, opponentParty, message) {
    // Implement Pokémon swapping logic here
    // Display user's party and prompt them to choose a Pokémon to swap
    let reply = `Your party: \n`;
    userParty.forEach((pokemon, index) => {
        reply += `${index + 1}. ${pokemon.name} (Level: ${pokemon.level})\n`;
    });
    reply += `Respond with the number of the Pokémon you want to swap.`;
    await message.reply(reply);

    const filter = (response) => {
        const choice = parseInt(response.content);
        return !isNaN(choice) && choice > 0 && choice <= userParty.length;
    };

    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });
    const choiceIndex = parseInt(collected.first().content) - 1;
    const chosenPokemon = userParty[choiceIndex];

    // Swap Pokémon between user and opponent
    userParty[choiceIndex] = opponentParty[0];
    opponentParty[0] = chosenPokemon;

    // Update user and opponent party in the database
    await client.DB.set(`${userId}_Party`, userParty);
    await client.DB.set(`${opponentId}_Party`, opponentParty);

    await message.reply(`You've swapped your ${chosenPokemon.name} with ${opponent.username}'s ${opponentParty[0].name}. Let the battle continue!`);
}

