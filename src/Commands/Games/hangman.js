module.exports = {
  name: 'hangman',
  aliases: ['hangman'],
  category: 'games',
  exp: 8,
  cool: 4,
  react: '✅',
  description: 'Play hangman alone',
  async execute(client, arg, M) {
    const wordPicker = M.sender;

    const wordList = [
      "HELLO",
      "WORLD",
      "JAVASCRIPT",
      "NODEJS",
      "GITHUB",
      "OPENAI",
      "COMPUTER",
      "PROGRAMMING",
      "HANGMAN"
    ];

    // Choose a random word from the word list
    const word = wordList[Math.floor(Math.random() * wordList.length)];

    let guessedWord = "_".repeat(word.length); // Partially guessed word
    let incorrectGuesses = 0; // Incorrect guesses
    const maxIncorrectGuesses = 6; // Maximum incorrect guesses allowed
    const guessedLetters = []; // Guessed letters

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
      for (let letter of guessedWord) {
        display += letter + " ";
      }
      return display.trim();
    };

    const isGameOver = () => {
      return incorrectGuesses >= maxIncorrectGuesses || !guessedWord.includes("_");
    };

    const updateGuessedWord = () => {
      guessedWord = "";
      for (let i = 0; i < word.length; i++) {
        if (guessedLetters.includes(word[i])) {
          guessedWord += word[i];
        } else {
          guessedWord += "_";
        }
      }
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

    await M.reply(`Hangman\n${displayHangman()}\n${displayWord()}\nGuess a letter.`);

    // Logic to play the game and handle guesses
    while (!isGameOver()) {
      const guess = await M.next();
      if (guess && guess.length === 1 && guess.match(/[a-zA-Z]/)) {
        guessLetter(guess.toUpperCase());
        await M.reply(`${displayHangman()}\n${displayWord()}`);
        if (isGameOver()) {
          if (!guessedWord.includes("_")) {
            await M.reply(`You win! The word was "${word}".`);
          } else {
            await M.reply(`You lose! The word was "${word}".`);
          }
        } else {
          await M.reply(`Guess another letter.`);
        }
      } else {
        await M.reply("Invalid guess. Please enter a single letter.");
      }
    }
  }
};
