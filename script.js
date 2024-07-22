let currentPlayer = 'X';
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let gameOver = false;
let playAgainstAI = false;

const turnMessage = document.getElementById('turnMessage');
const restartButton = document.getElementById('restartButton');
const backButton = document.getElementById('backButton');
const gameModeSelection = document.getElementById('gameModeSelection');
const boardElement = document.getElementById('board');

function startGame(mode) {
  // Reset board and game state
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  gameOver = false;
  playAgainstAI = (mode === 'ai');
  
  gameModeSelection.style.display = 'none';
  turnMessage.style.display = 'block';
  boardElement.style.display = 'block';
  restartButton.style.display = 'block';
  backButton.style.display = 'block';
  turnMessage.innerText = 'Turn of X';  // Reset the turn message
  
  displayBoard();  // Refresh the board display
}

function displayBoard() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      document.getElementById(`cell${i}${j}`).innerText = board[i][j];
    }
  }
}

function checkWinner() {
  const winningConditions = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return board[a[0]][a[1]];
    }
  }

  // Check for a tie
  if (board.flat().every(cell => cell !== '')) {
    return 'tie';
  }

  return null;
}

function aiMove() {
  if (gameOver) return;

  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === '') {
        availableMoves.push([i, j]);
      }
    }
  }

  if (availableMoves.length === 0) return;

  let [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  board[row][col] = 'O';
  displayBoard();

  let winner = checkWinner();
  if (winner) {
    gameOver = true;
    turnMessage.innerText = winner === 'tie' ? 'It is a tie!' : `Player ${winner} wins!`;
  } else {
    currentPlayer = 'X';
    turnMessage.innerText = `Turn of ${currentPlayer}`;
  }
}

function cellClicked(row, col) {
  if (gameOver || board[row][col] !== '') return;

  board[row][col] = currentPlayer;
  displayBoard();

  let winner = checkWinner();
  if (winner) {
    gameOver = true;
    turnMessage.innerText = winner === 'tie' ? 'It is a tie!' : `Player ${winner} wins!`;
  } else {
    if (playAgainstAI && currentPlayer === 'X') {
      currentPlayer = 'O';
      turnMessage.innerText = `Turn of ${currentPlayer}`;
      setTimeout(aiMove, 100); // Delay AI move for better user experience
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnMessage.innerText = `Turn of ${currentPlayer}`;
    }
  }
}

function restartGame() {
  currentPlayer = 'X';
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameOver = false;
  turnMessage.innerText = 'Turn of X';
  displayBoard();
}

function goBack() {
  gameModeSelection.style.display = 'block';
  turnMessage.style.display = 'none';
  boardElement.style.display = 'none';
  restartButton.style.display = 'none';
  backButton.style.display = 'none';
}

document.querySelectorAll('.mode-button').forEach(button => {
  button.addEventListener('click', (event) => {
    startGame(event.target.dataset.mode);
  });
});

restartButton.addEventListener('click', restartGame);
backButton.addEventListener('click', goBack);
