import "./style.css";

//cavas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let $score = document.querySelector("span");


const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
let num = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

const board = createBoard(BOARD_HEIGHT, BOARD_WIDTH)

const PIECE = [
  [[1, 1, 1, 1]],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
];

const piece = {
  position: { x: 5, y: 5 },
  shape: [[1, 1]],
};

context.scale(BLOCK_SIZE, BLOCK_SIZE);

function createBoard(height, width){
   return Array(height).fill().map(() => Array(width).fill(0))
}

// game loop
let droopCounter = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  droopCounter += deltaTime;

  if (droopCounter > 1000) {
    piece.position.y++;
    droopCounter = 0;

    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      rowtoRemove();
    }
  }
  drawn();
  window.requestAnimationFrame(update);
}

function drawn() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "red";
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (event.key === "ArrowRight") {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
  if (event.key === "ArrowDown") {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      rowtoRemove();
    }
  }
  if (event.key === "ArrowUp") {
    const rotated = [];

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];

      for (let j = 0; j < piece.shape.length; j++) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    }

    const previusShape = piece.shape;
    piece.shape = rotated;
    if (checkCollision()) {
      piece.shape = previusShape;
    }
  }
});

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;
  piece.shape = PIECE[Math.floor(Math.random() * PIECE.length)];
  //gameover
  if (checkCollision()) {
    window.alert("GAME OVER!! SORRY");
    board.forEach((row) => row.fill(0));
  }
}

function rowtoRemove() {
  const rowsToRemove = [];

  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y);
    }
  });

  rowsToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    num += 10
    $score.innerText = num;
  });
}

const $section = document.querySelector('section');
$section.addEventListener('click', () => {
  update();

//audio
$section.remove()
const audio = new window.Audio('./tetris.mp3');
audio.volume = 0.5;
audio.play();
})

