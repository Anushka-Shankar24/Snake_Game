// =========================
// GAME ELEMENTS
// =========================

const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const gameOverScreen = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");

const restartButton = document.getElementById("restartButton");
const newGameButton = document.getElementById("newGameButton");


// =========================
// GAME SETTINGS
// =========================

const tileSize = 20;
const tileCount = canvas.width / tileSize;

// 🐍 Snake Speed
// Higher number = slower speed
const gameSpeed = 180;


// =========================
// GAME VARIABLES
// =========================

let snake;
let food;

let direction;
let nextDirection;

let score;

let highScore =
  Number(localStorage.getItem("snakeHighScore")) || 0;

let gameRunning = false;
let gameLoop;


// =========================
// SHOW HIGH SCORE
// =========================

highScoreElement.textContent = highScore;


// =========================
// START GAME
// =========================

function startGame() {

  snake = [
    {
      x: 10,
      y: 10
    }
  ];

  direction = {
    x: 1,
    y: 0
  };

  nextDirection = {
    x: 1,
    y: 0
  };

  score = 0;

  gameRunning = true;

  scoreElement.textContent = score;

  gameOverScreen.classList.add("hidden");

  createFood();

  clearInterval(gameLoop);

  // 🐍 Game speed = 180
  gameLoop = setInterval(
    updateGame,
    gameSpeed
  );

  drawGame();
}


// =========================
// UPDATE GAME
// =========================

function updateGame() {

  if (!gameRunning) {
    return;
  }

  direction = nextDirection;


  // Create new snake head

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };


  // =========================
  // WALL COLLISION
  // =========================

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) {

    endGame();

    return;
  }


  // =========================
  // SNAKE COLLISION
  // =========================

  for (
    let i = 0;
    i < snake.length;
    i++
  ) {

    if (
      head.x === snake[i].x &&
      head.y === snake[i].y
    ) {

      endGame();

      return;
    }
  }


  // Add new head

  snake.unshift(head);


  // =========================
  // FOOD COLLISION
  // =========================

  if (
    head.x === food.x &&
    head.y === food.y
  ) {

    score++;

    scoreElement.textContent = score;

    updateHighScore();

    createFood();

  } else {

    // Remove tail

    snake.pop();
  }


  drawGame();
}


// =========================
// DRAW GAME
// =========================

function drawGame() {

  // Clear canvas

  ctx.fillStyle = "#020617";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawGrid();

  drawFood();

  drawSnake();
}


// =========================
// DRAW GRID
// =========================

function drawGrid() {

  ctx.strokeStyle =
    "rgba(148, 163, 184, 0.08)";

  ctx.lineWidth = 1;


  // Vertical lines

  for (
    let x = 0;
    x <= canvas.width;
    x += tileSize
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(
      x,
      canvas.height
    );

    ctx.stroke();
  }


  // Horizontal lines

  for (
    let y = 0;
    y <= canvas.height;
    y += tileSize
  ) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(
      canvas.width,
      y
    );

    ctx.stroke();
  }
}


// =========================
// DRAW SNAKE
// =========================

function drawSnake() {

  snake.forEach(
    (segment, index) => {

      const x =
        segment.x * tileSize;

      const y =
        segment.y * tileSize;


      // Snake head

      if (index === 0) {

        ctx.fillStyle = "#22d3ee";

      } else {

        // Snake body

        ctx.fillStyle = "#06b6d4";
      }


      // Snake body shape

      ctx.beginPath();

      ctx.roundRect(
        x + 2,
        y + 2,
        tileSize - 4,
        tileSize - 4,
        5
      );

      ctx.fill();


      // =========================
      // SNAKE EYES
      // =========================

      if (index === 0) {

        ctx.fillStyle = "#020617";

        let eyeX1;
        let eyeY1;

        let eyeX2;
        let eyeY2;


        // Moving right

        if (direction.x === 1) {

          eyeX1 = x + 14;
          eyeY1 = y + 6;

          eyeX2 = x + 14;
          eyeY2 = y + 14;

        }

        // Moving left

        else if (direction.x === -1) {

          eyeX1 = x + 6;
          eyeY1 = y + 6;

          eyeX2 = x + 6;
          eyeY2 = y + 14;

        }

        // Moving up

        else if (direction.y === -1) {

          eyeX1 = x + 6;
          eyeY1 = y + 6;

          eyeX2 = x + 14;
          eyeY2 = y + 6;

        }

        // Moving down

        else {

          eyeX1 = x + 6;
          eyeY1 = y + 14;

          eyeX2 = x + 14;
          eyeY2 = y + 14;
        }


        // First eye

        ctx.beginPath();

        ctx.arc(
          eyeX1,
          eyeY1,
          2,
          0,
          Math.PI * 2
        );

        ctx.fill();


        // Second eye

        ctx.beginPath();

        ctx.arc(
          eyeX2,
          eyeY2,
          2,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }
  );
}


// =========================
// DRAW FOOD
// =========================

function drawFood() {

  const centerX =
    food.x * tileSize + tileSize / 2;

  const centerY =
    food.y * tileSize + tileSize / 2;


  // Food glow

  ctx.shadowColor = "#f43f5e";
  ctx.shadowBlur = 15;


  // Food

  ctx.fillStyle = "#f43f5e";

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    7,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Remove shadow

  ctx.shadowBlur = 0;


  // Food leaf

  ctx.fillStyle = "#22c55e";

  ctx.beginPath();

  ctx.ellipse(
    centerX + 5,
    centerY - 7,
    4,
    2,
    -0.5,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


// =========================
// CREATE FOOD
// =========================

function createFood() {

  let validPosition = false;


  while (!validPosition) {

    food = {

      x: Math.floor(
        Math.random() * tileCount
      ),

      y: Math.floor(
        Math.random() * tileCount
      )
    };


    // Make sure food doesn't appear
    // inside the snake

    validPosition =
      !snake.some(
        segment =>
          segment.x === food.x &&
          segment.y === food.y
      );
  }
}


// =========================
// CHANGE DIRECTION
// =========================

function changeDirection(
  newDirection
) {

  if (!gameRunning) {
    return;
  }


  // UP

  if (
    newDirection === "up" &&
    direction.y !== 1
  ) {

    nextDirection = {
      x: 0,
      y: -1
    };
  }


  // DOWN

  else if (
    newDirection === "down" &&
    direction.y !== -1
  ) {

    nextDirection = {
      x: 0,
      y: 1
    };
  }


  // LEFT

  else if (
    newDirection === "left" &&
    direction.x !== 1
  ) {

    nextDirection = {
      x: -1,
      y: 0
    };
  }


  // RIGHT

  else if (
    newDirection === "right" &&
    direction.x !== -1
  ) {

    nextDirection = {
      x: 1,
      y: 0
    };
  }
}


// =========================
// KEYBOARD CONTROLS
// =========================

document.addEventListener(
  "keydown",
  function (event) {

    const key = event.key;


    // Prevent browser scrolling

    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
      ].includes(key)
    ) {

      event.preventDefault();
    }


    if (key === "ArrowUp") {

      changeDirection("up");

    }

    else if (key === "ArrowDown") {

      changeDirection("down");

    }

    else if (key === "ArrowLeft") {

      changeDirection("left");

    }

    else if (key === "ArrowRight") {

      changeDirection("right");
    }
  }
);


// =========================
// MOBILE CONTROLS
// =========================

const controlButtons =
  document.querySelectorAll(
    ".control-btn"
  );


controlButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function () {

        const directionName =
          this.dataset.direction;

        changeDirection(
          directionName
        );
      }
    );
  }
);


// =========================
// GAME OVER
// =========================

function endGame() {

  gameRunning = false;

  clearInterval(gameLoop);

  finalScoreElement.textContent =
    score;

  gameOverScreen.classList.remove(
    "hidden"
  );
}


// =========================
// HIGH SCORE
// =========================

function updateHighScore() {

  if (score > highScore) {

    highScore = score;

    highScoreElement.textContent =
      highScore;

    localStorage.setItem(
      "snakeHighScore",
      highScore
    );
  }
}


// =========================
// RESTART BUTTON
// =========================

restartButton.addEventListener(
  "click",
  startGame
);


newGameButton.addEventListener(
  "click",
  startGame
);


// =========================
// START GAME
// =========================

startGame();