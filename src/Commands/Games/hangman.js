module.exports = {
  name: 'hangman',
  aliases: ['hangman'],
  category: 'games',
  exp: 8,
  cool: 4,
  react: '✅',
  description: 'Play hangman with another player',
  async execute(client, arg, M) {
    if (!arg) return M.reply("You need to mention another player to start a game of hangman.");

    const opponent = M.mentions[0];
    if (!opponent) return M.reply("You need to mention another player to start a game of hangman.");

    const wordPicker = M.sender;
    const wordGuesser = opponent;

    let word = ""; // Word to guess
    let guessedWord = ""; // Partially guessed word
    let incorrectGuesses = 0; // Incorrect guesses
    let maxIncorrectGuesses = 6; // Maximum incorrect guesses allowed
    let guessedLetters = []; // Guessed letters

    const displayHangman = () => {
      const hangmanStages = [
        `
        ________
        |      |
        |
        |
        |
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |
        |
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |      |
        |
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |     /|
        |
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |     /|\\
        |
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |     /|\\
        |     /
        |
        |
      ==========
      `,
        `
        ________
        |      |
        |      O
        |     /|\\
        |     / \\
        |
        |
      ==========
      `
      ];
      return hangmanStages[incorrectGuesses];
    };

    const displayWord = () => {
      let display = "";
      for (let letter of word) {
        if (guessedLetters.includes(letter)) {
          display += letter + " ";
        } else {
          display += "_ ";
        }
      }
      return display;
    };

    const isGameOver = () => {
      return incorrectGuesses >= maxIncorrectGuesses || !guessedWord.includes("_");
    };

    const updateGuessedWord = () => {
      guessedWord = displayWord();
    };

    const guessLetter = (letter) => {
      if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
        if (!word.includes(letter)) {
          incorrectGuesses++;
        }
        updateGuessedWord();
      }
    };

    await M.reply(`${wordPicker.split("@")[0]} vs ${wordGuesser.split("@")[0]} - Hangman\n${displayHangman()}\n${displayWord()}\n${wordGuesser.split("@")[0]}, guess a letter.`);

    // Logic to start the game and handle guesses
    while (!isGameOver()) {
      const guess = await M.next();
      if (guess && guess.length === 1 && guess.match(/[a-zA-Z]/)) {
        guessLetter(guess.toUpperCase());
        await M.reply(`${displayHangman()}\n${guessedWord}`);
        if (isGameOver()) {
          if (!guessedWord.includes("_")) {
            await M.reply(`${wordGuesser.split("@")[0]} wins! The word was "${word}".`);
          } else {
            await M.reply(`${wordPicker.split("@")[0]} wins! The word was "${word}".`);
          }
        } else {
          await M.reply(`${wordGuesser.split("@")[0]}, guess another letter.`);
        }
      } else {
        await M.reply("Invalid guess. Please enter a single letter.");
      }
    }
  }
};
