module.exports = {
    name: 'hangman',
    aliases: ['startgame'],
    category: 'games',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :hangman to start a Hangman game',
    description: 'Start a Hangman game',
    async execute(client, arg, M) {
        // Define the word to guess
        const wordToGuess = "hangman";

        // Initialize variables for Hangman game
        let guessedWord = "_".repeat(wordToGuess.length);
        let remainingAttempts = 6; // Total number of incorrect guesses allowed

        // Hangman visual representation
        const hangmanStages = [
            `
            _______
            |     |
            |     
            |    
            |   
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |    
            |   
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |     |
            |   
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |    /|
            |   
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |    /|\\
            |   
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |    /|\\
            |    /
            |     
            |__________
            `,
            `
            _______
            |     |
            |     O
            |    /|\\
            |    / \\
            |     
            |__________
            `
        ];

        // Function to display Hangman visual
        const displayHangman = (stage) => {
            return "```" + hangmanStages[stage] + "```";
        };

        // Start the Hangman game
        await client.sendMessage(
            M.from,
            {
                body: "Let's play Hangman! Try to guess the word.",
                quoted: M
            }
        );

        // Game loop
        while (remainingAttempts > 0 && guessedWord !== wordToGuess) {
            await client.sendMessage(
                M.from,
                {
                    body: displayHangman(6 - remainingAttempts),
                    quoted: M
                }
            );

            await client.sendMessage(
                M.from,
                {
                    body: `Word: ${guessedWord}\nRemaining Attempts: ${remainingAttempts}`,
                    quoted: M
                }
            );

            // Prompt user to guess a letter
            await client.sendMessage(
                M.from,
                {
                    body: "Guess a letter:",
                    quoted: M
                }
            );

            // Receive user input
            const response = await client.waitForMessage();
            const guessedLetter = response.body.toLowerCase();

            // Check if guessed letter is in the word
            let found = false;
            for (let i = 0; i < wordToGuess.length; i++) {
                if (wordToGuess[i] === guessedLetter) {
                    guessedWord = guessedWord.substring(0, i) + guessedLetter + guessedWord.substring(i + 1);
                    found = true;
                }
            }

            // Update remaining attempts if guessed letter is incorrect
            if (!found) {
                remainingAttempts--;
            }
        }

        // Display game result
        if (guessedWord === wordToGuess) {
            await client.sendMessage(
                M.from,
                {
                    body: `Congratulations! You guessed the word "${wordToGuess}" correctly!`,
                    quoted: M
                }
            );
        } else {
            await client.sendMessage(
                M.from,
                {
                    body: "Sorry, you ran out of attempts. The word was: " + wordToGuess,
                    quoted: M
                }
            );
        }
    }
};
              
