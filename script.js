const blockSize = 25;
const totalRows = 18;
const totalColumns = 18;
const moveInterval = 120;

let board;
let context;
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let speedX = 0;
let speedY = 0;
let nextSpeedX = 0;
let nextSpeedY = 0;
let foodX;
let foodY;
let score = 0;
let snakeBody = [];
let previousSnake = [[snakeX, snakeY]];
let currentSnake = [[snakeX, snakeY]];
let lastMoveTime = performance.now();
let gameOver = false;

const highscore = document.getElementById("highscore");
const currentScore = document.getElementById("currentscore");
const gameOverScreen = document.getElementById("game-over");

highscore.innerText = localStorage.getItem("snakescore") || 0;

window.addEventListener("load", () => {
  board = document.getElementById("board");
  board.height = totalRows * blockSize;
  board.width = totalColumns * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keydown", changeDirection);
  setInterval(updateGame, moveInterval);
  requestAnimationFrame(drawGame);
});

function updateGame() {
  if (gameOver || (nextSpeedX === 0 && nextSpeedY === 0)) return;

  speedX = nextSpeedX;
  speedY = nextSpeedY;
  previousSnake = currentSnake.map((segment) => [...segment]);

  const oldHead = [snakeX, snakeY];
  snakeX += speedX * blockSize;
  snakeY += speedY * blockSize;
  snakeBody.unshift(oldHead);

  if (snakeX === foodX && snakeY === foodY) {
    score += 1;
    currentScore.innerText = score;

    const savedHighscore = Number(localStorage.getItem("snakescore")) || 0;
    if (score > savedHighscore) {
      localStorage.setItem("snakescore", score);
      highscore.innerText = score;
    }

    placeFood();
  } else {
    snakeBody.pop();
  }

  currentSnake = [[snakeX, snakeY], ...snakeBody];
  lastMoveTime = performance.now();

  const hitWall =
    snakeX < 0 ||
    snakeX >= board.width ||
    snakeY < 0 ||
    snakeY >= board.height;
  const hitBody = snakeBody.some(
    ([bodyX, bodyY]) => snakeX === bodyX && snakeY === bodyY,
  );

  if (hitWall || hitBody) endGame();
}

function drawGame(timestamp) {
  context.fillStyle = "#23201a";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "#792639";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  const progress = gameOver
    ? 1
    : Math.min((timestamp - lastMoveTime) / moveInterval, 1);

  context.fillStyle = "#868645";
  currentSnake.forEach(([x, y], index) => {
    const [oldX, oldY] = previousSnake[index] ||
      previousSnake[previousSnake.length - 1] || [x, y];
    const drawX = oldX + (x - oldX) * progress;
    const drawY = oldY + (y - oldY) * progress;
    context.fillRect(drawX, drawY, blockSize, blockSize);
  });

  requestAnimationFrame(drawGame);
}

function changeDirection(event) {
  const directions = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };
  const direction = directions[event.code];

  if (!direction || gameOver) return;
  event.preventDefault();

  const [newSpeedX, newSpeedY] = direction;
  if (newSpeedX === -speedX && newSpeedY === -speedY) return;

  nextSpeedX = newSpeedX;
  nextSpeedY = newSpeedY;
}

function placeFood() {
  do {
    foodX = Math.floor(Math.random() * totalColumns) * blockSize;
    foodY = Math.floor(Math.random() * totalRows) * blockSize;
  } while (
    (foodX === snakeX && foodY === snakeY) ||
    snakeBody.some(([x, y]) => x === foodX && y === foodY)
  );
}

function endGame() {
  gameOver = true;
  gameOverScreen.hidden = false;
}

document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});
