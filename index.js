const settings = document.getElementById("settings");
const game = document.getElementById("game");
const results = document.getElementById("results");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const scoreElement = document.getElementById("score");
const clicksElement = document.getElementById("clicks");
const time = document.getElementById("timeLeft");
const finalScoreElement = document.getElementById("final-score");
const finalClicksElement = document.getElementById("final-clicks");
const gameContainer = document.getElementById("game-container");
const square = document.createElement("div");

square.classList.add("square");

let score = 0;
let clicks = 0;
let gameInterval;
let moveTimeout;
let timeLeft = 30;

function getRandomPosition() {
  const containerRect = gameContainer.getBoundingClientRect();
  const maxX =
    containerRect.width -
    (difficulty === "easy" ? 100 : difficulty === "medium" ? 75 : 50);

  const maxY =
    containerRect.height -
    (difficulty === "easy" ? 100 : difficulty === "medium" ? 75 : 50);

  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  };
}

function moveSquare() {
  const difficulty = document.getElementById("difficulty").value;
  const position = getRandomPosition();

  square.style.left = position.x + "px";
  square.style.top = position.y + "px";

  difficulty === "easy"
    ? (square.style.width = "100px") && (square.style.height = "100px")
    : difficulty === "medium"
    ? (square.style.width = "75px") && (square.style.height = "75px")
    : (square.style.width = "50px") && (square.style.height = "50px");

  const timeLimit =
    difficulty === "easy" ? 3000 : difficulty === "medium" ? 2000 : 1000;
  clearTimeout(moveTimeout);

  moveTimeout = setTimeout(() => {
    alert("You missed! Game over.");
    endGame();
  }, timeLimit);
}

function startGame() {
  score = 0;
  clicks = 0;
  timeLeft = 30;
  updateScoreAndClicks();

  settings.classList.add("hidden");
  game.classList.remove("hidden");

  const color = document.getElementById("color").value;
  square.style.backgroundColor = color;
  gameContainer.appendChild(square);

  moveSquare();

  square.addEventListener("click", () => {
    clearTimeout(moveTimeout);
    score++;
    clicks++;
    updateScoreAndClicks();
    moveSquare();
  });

  gameContainer.addEventListener("click", (event) => {
    if (event.target !== square) {
      score--;
      showMissedMessage(event.clientX, event.clientY);
      updateScoreAndClicks();
    }
  });

  gameInterval = setInterval(() => {
    timeLeft--;
    time.innerHTML = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function updateScoreAndClicks() {
  scoreElement.textContent = score;
  clicksElement.textContent = clicks;
}

function endGame() {
  clearInterval(gameInterval);
  clearTimeout(moveTimeout);

  game.classList.add("hidden");
  results.classList.remove("hidden");

  finalScoreElement.textContent = score;
  finalClicksElement.textContent = clicks;

  gameContainer.innerHTML = "";
}

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", () => {
  results.classList.toggle("hidden");
  settings.classList.toggle("hidden");
});

function showMissedMessage(x, y) {
  const message = document.createElement("div");
  message.textContent = "-1";
  message.style.position = "absolute";
  message.style.color = "red";
  message.style.fontSize = "20px";
  message.style.fontWeight = "bold";
  message.style.left = `${x}px`;
  message.style.top = `${y - 200}px`;
  message.style.transform = "translate(-50%, -50%)";
  message.style.pointerEvents = "none";

  gameContainer.appendChild(message);

  setTimeout(() => {
    gameContainer.removeChild(message);
  }, 500);
}
