module.exports = {
 name: 'rps',
 aliases: ['rps'],
 category: 'games',
 react: "✅",
 exp: 12,
 cool: 4,
 description: 'Play a game of Rock Paper Scissors against the bot',
 async execute(client, arg, M) { 

  const participant = await client.DB.get('game') || [];
      if (!participant.includes(M.from)) {
        return M.reply(`To use rpg commands, join the games group by using ${client.prefix}support`);
      }
   const choices = ['rock', 'paper', 'scissors'];
   const playerChoice = arg.toLowerCase();
   const botChoice = choices[Math.floor(Math.random() * choices.length)];

   if (!playerChoice) {
     return M.reply('Please provide your choice (rock, paper, or scissors).');
   }

   if (!choices.includes(playerChoice)) {
     return M.reply('Please provide a valid choice (rock, paper, or scissors).');
   }

   let result = '';

   if (playerChoice === botChoice) {
     result = 'It\'s a draw!';
   } else if (
     (playerChoice === 'rock' && botChoice === 'scissors') ||
     (playerChoice === 'paper' && botChoice === 'rock') ||
     (playerChoice === 'scissors' && botChoice === 'paper')
   ) {
     result = 'You win!';
   } else {
     result = 'You lose!';
   }

   // Add emoji corresponding to each choice
   const emojis = {
     rock: '🪨',
     paper: '📄',
     scissors: '✂️'
   };

   M.reply(`You chose ${playerChoice} ${emojis[playerChoice]}, I chose ${botChoice} ${emojis[botChoice]}. ${result}`);
 }
};