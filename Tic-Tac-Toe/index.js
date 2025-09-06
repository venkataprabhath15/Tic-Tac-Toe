let buttons = document.querySelectorAll('.box');
let resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];

const gameContainer = document.querySelector('.game');
let currentWinLine = null;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            drawWinLine(winningCombo);
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        // reDrawWinLine() is not strictly needed here because the win line is drawn immediately after the win
        return;
    }

    if (!board.includes('')) {
        alert('Game ended in a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function drawWinLine(combo, animate = true) {
  const game = document.querySelector(".game");
  const rect = game.getBoundingClientRect();
  const boxRects = combo.map(i => buttons[i].getBoundingClientRect());

  const start = {
    x: boxRects[0].left + boxRects[0].width / 2 - rect.left,
    y: boxRects[0].top + boxRects[0].height / 2 - rect.top
  };

  const end = {
    x: boxRects[2].left + boxRects[2].width / 2 - rect.left,
    y: boxRects[2].top + boxRects[2].height / 2 - rect.top
  };

  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

  // remove old line if exists
  if (currentWinLine && currentWinLine.line) {
    currentWinLine.line.remove();
  }

  const line = document.createElement("div");
  line.classList.add("win-line");
  game.appendChild(line);

  // ✅ use pixels, not %
  line.style.left = `${start.x}px`;
  line.style.top = `${start.y}px`;
  line.style.transform = `rotate(${angle}deg)`;

  if (animate) {
    line.style.width = "0px";
    requestAnimationFrame(() => {
      line.style.width = `${length}px`;
    });
  } else {
    line.style.width = `${length}px`;
  }

  currentWinLine = { combo, line };
}


// Function to redraw the win line without animation
function reDrawWinLine() {
    if (currentWinLine) {
        drawWinLine(currentWinLine.combo, false);
    }
}

function handleBoxClick(e) {
    const clickedBox = e.target;
    const boxIndex = Array.from(buttons).indexOf(clickedBox);
    if (board[boxIndex] !== '' || !gameActive) return;

    board[boxIndex] = currentPlayer;
    clickedBox.textContent = currentPlayer;
    handleResultValidation();
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];

    buttons.forEach(button => {
        button.textContent = '';
    });

    if (currentWinLine && currentWinLine.line) {
        currentWinLine.line.remove();
        currentWinLine = null;
    }
}

buttons.forEach(button => {
    button.addEventListener('click', handleBoxClick);
});

resetButton.addEventListener('click', resetGame);

// Use ResizeObserver to reliably redraw the win line
const resizeObserver = new ResizeObserver(() => {
    reDrawWinLine();
});

resizeObserver.observe(gameContainer);