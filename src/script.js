// TODO: remove game over alert

let blockSize = 25;
let totalRow = 18;
let totalCol = 18;
let board;
let context;
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let speedX = 0;
let speedY = 0;
let foodX;
let foodY;
let score = 0;
let highscore = document.getElementById("highscore");
let snakeBody = [];

let gameOver = false;

// score
if (localStorage.getItem("snakescore")) {
  highscore.innerText = localStorage.getItem("snakescore");
} else {
  highscore.innerText = 0;
}

window.onload = function () {
  board = document.getElementById("board");
  board.height = totalRow * blockSize;
  board.width = totalCol * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1200 / 10); // snake speed
};

function update() {
  if (gameOver) {
    return;
  }

  // board
  context.fillStyle = "#23201a";
  context.fillRect(0, 0, board.width, board.height);

  // food
  context.fillStyle = "#792639";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]);
    score += 1;
    document.getElementById("currentscore").innerText = score;
    if (score >= localStorage.getItem("snakescore")) {
      localStorage.setItem("snakescore", score);
    }
    placeFood();
  }

  // snake body grow
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // snake
  context.fillStyle = "#868645";
  snakeX += speedX * blockSize;
  snakeY += speedY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }
  if (
    snakeX < 0 ||
    snakeX > totalCol * blockSize ||
    snakeY < 0 ||
    snakeY > totalRow * blockSize
  ) {
    gameOver = true;
    alert("Game Over");
  }
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      gameOver = true;
      alert("Game Over");
    }
  }
}

// controls
function changeDirection(e) {
  if (e.code == "ArrowUp" && speedY != 1) {
    speedX = 0;
    speedY = -1;
  } else if (e.code == "ArrowDown" && speedY != -1) {
    speedX = 0;
    speedY = 1;
  } else if (e.code == "ArrowLeft" && speedX != 1) {
    speedX = -1;
    speedY = 0;
  } else if (e.code == "ArrowRight" && speedX != -1) {
    speedX = 1;
    speedY = 0;
  }
}

function placeFood() {
  foodX = Math.floor(Math.random() * totalCol) * blockSize;
  foodY = Math.floor(Math.random() * totalRow) * blockSize;
}

// Restart
let restart = document
  .getElementById("restart")
  .addEventListener("click", function () {
    location.reload();
  });
