module.exports = {
  name: 'tictactoe',
  aliases: ['tictactoe'],
  category: 'games',
  exp: 8,
  cool: 4,
  react: '✅',
  description: 'Play tic-tac-toe with another player',
  async execute(client, arg, M) {
    if (!arg) return M.reply("You need to mention another player to start a game of tic-tac-toe.");

    const opponent = M.mentions[0];
    if (!opponent) return M.reply("You need to mention another player to start a game of tic-tac-toe.");

    const player1 = M.sender;
    const player2 = opponent;
    const players = [player1, player2];
    let currentPlayerIndex = 0;
    let winner = null;

    const board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];

    const displayBoard = () => {
      let boardStr = "```\n";
      for (let row of board) {
        boardStr += row.join(' | ') + "\n";
        boardStr += "---------\n";
      }
      boardStr += "```";
      return boardStr;
    };

    const checkWin = () => {
      // Check rows
      for (let i = 0; i < 3; i++) {
        if (board[i][0] !== ' ' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
          return board[i][0];
        }
      }
      // Check columns
      for (let i = 0; i < 3; i++) {
        if (board[0][i] !== ' ' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
          return board[0][i];
        }
      }
      // Check diagonals
      if (board[0][0] !== ' ' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0];
      }
      if (board[0][2] !== ' ' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2];
      }
      // Check for tie
      if (!board.flat().includes(' ')) {
        return 'tie';
      }
      return null;
    };

    const switchPlayer = () => {
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    };

    const isValidMove = (row, col) => {
      return row >= 0 && row < 3 && col >= 0 && col < 3 && board[row][col] === ' ';
    };

    const makeMove = (row, col) => {
      if (isValidMove(row, col)) {
        board[row][col] = currentPlayerIndex === 0 ? 'X' : 'O';
        return true;
      }
      return false;
    };

    const currentPlayer = () => {
      return players[currentPlayerIndex];
    };

    await M.reply(`${player1.split("@")[0]} vs ${player2.split("@")[0]} - Tic Tac Toe\n${displayBoard()}\n${currentPlayer().split("@")[0]}, make your move by specifying row and column (e.g., :tictactoe 1 1 for the center)`);

    while (!winner) {
      const [rowStr, colStr] = arg.split(' ');
      const row = parseInt(rowStr) - 1;
      const col = parseInt(colStr) - 1;

      if (makeMove(row, col)) {
        winner = checkWin();
        if (winner === 'tie') {
          await M.reply(`It's a tie!\n${displayBoard()}`);
          break;
        } else if (winner) {
          await M.reply(`Player ${winner} wins!\n${displayBoard()}`);
          break;
        }
        switchPlayer();
        await M.reply(`${displayBoard()}\n${currentPlayer().split("@")[0]}, it's your turn.`);
      } else {
        await M.reply("Invalid move. Try again.");
      }
    }
  }
};
          
