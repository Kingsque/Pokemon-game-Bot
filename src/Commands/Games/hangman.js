module.exports = {
  name: 'hangman',
  aliases: ['hm'],
  category: 'games',
  exp: 0,
  cool: 4,
  react: "✅",
  usage: 'Use :hangman start to start a Hangman game',
  description: 'Start or play a Hangman game',
  async execute(client, arg, M) {
    const words = ['output', 'proves', 'javas', 'human', 'game'];
    const maxAttempts = 6;
    let currentWord = '';
    let maskedWord = '';
    let attempts = 0;
    const usedLetters = new Set();

    const getRandomWord = () => {
      const randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex];
    };

    const generateMaskedWord = (word, letters) => {
      return word.replace(/\w/g, letter => (letters.has(letter) ? letter : '_'));
    };

    const displayHangman = (incorrectAttempts) => {
      const hangmanParts = [
        ' ________     \n|        |    \n|             \n|             \n|             \n|             ',
        ' ________     \n|        |    \n|        O    \n|             \n|             \n|             ',
        ' ________     \n|        |    \n|        O    \n|        |    \n|             \n|             ',
        ' ________     \n|        |    \n|        O    \n|       /|    \n|             \n|             ',
        ' ________     \n|        |    \n|        O    \n|       /|\\  \n|             \n|             ',
        ' ________     \n|        |    \n|        O    \n|       /|\\  \n|       /     \n|             ',
        ' ________     \n|        |    \n|        O    \n|       /|\\  \n|       / \\  \n|             '
      ];

      return hangmanParts.slice(0, incorrectAttempts).join('\n');
    };

    const isGameOver = () => {
      return attempts >= maxAttempts || maskedWord === currentWord;
    };

    const startGame = () => {
      currentWord = getRandomWord();
      maskedWord = generateMaskedWord(currentWord, usedLetters);
      attempts = 0;
      usedLetters.clear();
      M.reply('Let\'s play Hangman! The word has been chosen. Start guessing letters!');
      M.reply(`${maskedWord}\n\nTo make a guess, use the command: \`hangman guess <letter>\``);
    };

    const processGuess = (guess) => {
      if (!guess || guess.length !== 1 || !/[a-z]/i.test(guess)) {
        M.reply('Please provide a single letter as your guess.');
        return;
      }

      const letter = guess.toLowerCase();
      if (usedLetters.has(letter)) {
        M.reply(`The letter \`${letter}\` has already been used. Please guess another letter.`);
        return;
      }

      usedLetters.add(letter);

      if (currentWord.includes(letter)) {
        maskedWord = generateMaskedWord(currentWord, usedLetters);
        if (maskedWord === currentWord) {
          M.reply(`Congratulations! You won! The word was \`${currentWord}\`.`);
        } else {
          M.reply(`Good guess! The letter \`${letter}\` is in the word.`);
          M.reply(`${maskedWord}`);
        }
      } else {
        attempts++;
        M.reply(`Oops! The letter \`${letter}\` is not in the word.`);
        M.reply(`${displayHangman(attempts)}`);
        if (attempts >= maxAttempts) {
          M.reply(`Game over! You've used all your attempts. The word was \`${currentWord}\`.`);
        }
      }
    };

    if (!arg || arg.toLowerCase() === 'start') {
      startGame();
    } else if (arg.toLowerCase() === 'guess') {
      M.reply('To make a guess, provide a letter after the `guess` command. For example: `hangman guess a`.');
    } else if (arg.toLowerCase().startsWith('guess ')) {
      const guess = arg.toLowerCase().slice(6); // Extract the guessed letter
      processGuess(guess);
    }
  }
};
            
