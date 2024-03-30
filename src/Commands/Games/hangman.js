const hangmanGames = {};

module.exports = {
    name: 'hangman',
    aliases: ['hangman'],
    category: 'games',
    exp: 8,
    cool: 4,
    react: '✅',
    description: 'Play hangman game to win gold',
    async execute(client, arg, M) {
        const commands = arg.split(' ');

        if (commands[0] === 'start') {
            const word = commands.slice(1).join(' ').toLowerCase(); // Get the word to guess
            const hangmanGame = {
                word: word,
                guessedLetters: [],
                attempts: 6, // Number of attempts
                hangmanState: [
                    '______\n|    |\n|\n|\n|\n|',
                    '______\n|    |\n|    O\n|\n|\n|',
                    '______\n|    |\n|    O\n|    |\n|\n|',
                    '______\n|    |\n|    O\n|   /|\n|\n|',
                    '______\n|    |\n|    O\n|   /|\\\n|\n|',
                    '______\n|    |\n|    O\n|   /|\\\n|   /\n|',
                    '______\n|    |\n|    O\n|   /|\\\n|   / \\\n|'
                ],
                status: 'ongoing' // Status of the game
            };
            hangmanGames[M.sender] = hangmanGame; // Store the game for the user
            M.reply('Hangman game started! Use :hangman guess [letter/word] to play.');
        } else if (commands[0] === 'guess') {
            const hangmanGame = hangmanGames[M.sender];
            if (!hangmanGame || hangmanGame.status !== 'ongoing') {
                return M.reply('No active hangman game. Start one using :hangman start [word].');
            }
            const guess = commands.slice(1).join(' ').toLowerCase(); // Get the guessed letter or word
            if (guess.length === 0) {
                return M.reply('Please provide a letter or word to guess.');
            }
            if (guess.length === 1) { // Guessing a letter
                hangmanGame.guessedLetters.push(guess);
                // Update attempts or check if game is won
                if (!hangmanGame.word.includes(guess)) {
                    hangmanGame.attempts--;
                    if (hangmanGame.attempts === 0) {
                        hangmanGame.status = 'lost';
                        return M.reply(`You lost! The word was ${hangmanGame.word}.`);
                    }
                } else {
                    if (hangmanGame.word.split('').every(letter => hangmanGame.guessedLetters.includes(letter))) {
                        hangmanGame.status = 'won';
                        // Handle win and award gold
                        const goldReward = 100; // Example reward
                        try {
                            await client.rpg.add(`${M.sender}.gold`, goldReward);
                            return M.reply(`Congratulations! You won! You guessed the word ${hangmanGame.word}. You earned ${goldReward} gold.`);
                        } catch (error) {
                            console.error('Error awarding gold:', error);
                            return M.reply('There was an error awarding gold. Please try again later.');
                        }
                    }
                }
            } else { // Guessing the whole word
                if (guess === hangmanGame.word) {
                    hangmanGame.status = 'won';
                    // Handle win and award gold
                    const goldReward = 100; // Example reward
                    try {
                        await client.rpg.add(`${M.sender}.gold`, goldReward);
                        return M.reply(`Congratulations! You won! You guessed the word ${hangmanGame.word}. You earned ${goldReward} gold.`);
                    } catch (error) {
                        console.error('Error awarding gold:', error);
                        return M.reply('There was an error awarding gold. Please try again later.');
                    }
                } else {
                    hangmanGame.attempts--;
                    if (hangmanGame.attempts === 0) {
                        hangmanGame.status = 'lost';
                        return M.reply(`You lost! The word was ${hangmanGame.word}.`);
                    }
                }
            }
        } else if (commands[0] === 'end') {
            const hangmanGame = hangmanGames[M.sender];
            if (!hangmanGame || hangmanGame.status !== 'ongoing') {
                return M.reply('No active hangman game to end.');
            }
            delete hangmanGames[M.sender];
            return M.reply('Hangman game ended.');
        } else {
            M.reply('Invalid hangman command. Use :hangman start, :hangman guess [letter/word], or :hangman end.');
        }
    }
};
          
