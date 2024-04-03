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
   const words = ['output', 'proves', 'javas', 'human', 'game'];
   const maxAttempts = 6;
   const usedLetters = [];
   let currentWord = '';
   let attempts = 0;

   const getRandomWord = () => {
     const randomIndex = Math.floor(Math.random() * words.length);
     return words[randomIndex];
   };

   const updateCurrentWord = (word, letter) => {
     let newWord = '';
     for (let i = 0; i < word.length; i++) {
       if (word[i] === letter) {
         newWord += letter;
       } else if (currentWord[i] !== '_') {
         newWord += currentWord[i];
       } else {
         newWord += '_';
       }
     }
     return newWord;
   };

   const displayHangman = (incorrectLetters) => {
     const hangmanParts = [
       ' ________     \n|        |    \n|             \n|             \n|             \n|             ',
       ' ________     \n|        |    \n|        O    \n|             \n|             \n|             ',
       ' ________     \n|        |    \n|        O    \n|        |    \n|             \n|             ',
       ' ________     \n|        |    \n|        O    \n|       /|    \n|             \n|             ',
       ' ________     \n|        |    \n|        O    \n|       /|\\  \n|             \n|             ',
       ' ________     \n|        |    \n|        O    \n|       /|\\  \n|       /     \n|             ',
       ' ________     \n|        |    \n|        O    \n|       /|\\  \n|       / \\  \n|             '
     ];

     const hangmanIndex = Math.min(incorrectLetters.length, maxAttempts) - 1;
     return hangmanParts[hangmanIndex];
   };

   const isGameOver = () => {
     return attempts >= maxAttempts || currentWord.indexOf('_') === -1;
   };

   const startGame = () => {
     currentWord = getRandomWord().toLowerCase();
     attempts = 0;
     usedLetters.length = 0;
     M.reply('Let\'s play hangman! The word has been chosen. Start guessing letters!');
     M.reply(`\`${currentWord.replace(/./g, '_ ')}\``);
   };

   const processGuess = (guess) => {
     if (!guess || guess.length !== 1 || !guess.match(/[a-z]/i)) {
       M.reply('Please provide a single letter as your guess.');
       return;
     }

     const letter = guess.toLowerCase();
     if (usedLetters.includes(letter)) {
       M.reply(`The letter \`${letter}\` has already been used. Please guess another letter.`);
       return;
     }

     usedLetters.push(letter);

     if (currentWord.includes(letter)) {
       currentWord = updateCurrentWord(currentWord, letter);
       M.reply(`Good guess! The letter \`${letter}\` is in the word.`);
       M.reply(`\`${currentWord.replace(/./g, '_ ')}\``);
     } else {
       attempts++;
       M.reply(`Oops! The letter \`${letter}\` is not in the word.`);
       M.reply(`\`${currentWord.replace(/./g, '_ ')}\``);
       M.reply(`Letters used: \`${usedLetters.join(', ')}\``);
       M.reply(`${displayHangman(usedLetters)}`);
     }

     if (isGameOver()) {
       M.reply('Game over!');
       M.reply(`The word was \`${currentWord}\`.`);
     }
   };

   if (!arg || arg.toLowerCase() === 'start') {
     startGame();
   } else {
     processGuess(arg);
   }
 }
};
