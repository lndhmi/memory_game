document.addEventListener('DOMContentLoaded', () => {
  const images = [
    { id: 1, image: "images/cloud.png" },
    { id: 2, image: "images/heart.png" },
    { id: 3, image: "images/flower.png" },
    { id: 4, image: "images/egg.png" },
    { id: 5, image: "images/icecream.png" },
    { id: 6, image: "images/rainbow.png" },
    { id: 7, image: "images/sun.png" },
    { id: 8, image: "images/mushroom.png" },
  ];

  const difficultySettings = {
    "fac": { cards: 8, time: 35, columns: 4 },
    "moy": { cards: 12, time: 40, columns: 4 },
    "dif": { cards: 16, time: 45, columns: 4 },
    "aucun": { cards: 16, time: 0, columns: 4 }
  };

  const difficulty = localStorage.getItem("difficulty") || "moy";
  const settings = difficultySettings[difficulty];

  let cardArray = [...images.slice(0, settings.cards / 2), ...images.slice(0, settings.cards / 2)];
  cardArray.sort(() => Math.random() - 0.5);

  const gameBoard = document.querySelector(".memory-game");
  gameBoard.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;

  let moveCount = 0;
  let timerInterval;
  let timerStarted = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matches = 0;
  let timerRemaining = settings.time;
  let gameOver = false;

  const encouragementText = document.getElementById("encouragement");

  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById("timer").textContent = `Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function initializeTimer() {
    if (settings.time > 0) {
      timerRemaining = settings.time;
      updateTimerDisplay(timerRemaining);
    } else {
      document.getElementById("timer").textContent = "";
    }
  }

  function initializeMoveCount() {
    moveCount = 0;
    document.getElementById("moveCounter").textContent = `Moves: ${moveCount}`;
  }

  function createCard(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;
    cardElement.innerHTML = ` 
      <div class="front-face"><img src="${card.image}" alt="Card Image"></div>
      <div class="back-face"><img src="images/back.jpg" alt="Card Image"></div>
    `;
    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  }

  cardArray.forEach(createCard);

  function flipCard() {
    if (gameOver || lockBoard || (settings.time > 0 && timerRemaining <= 0)) return;
    if (this === firstCard) return;

    if (!timerStarted) {
      startTimer();
      timerStarted = true;
    }

    this.classList.add("flip");

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;
    updateMoveCounter();
    checkForMatch();
  }

  function updateMoveCounter() {
    moveCount++;
    document.getElementById("moveCounter").textContent = `Moves: ${moveCount}`;
  }

  function updateEncouragement(isMatch) {
    if (gameOver) return;

    encouragementText.textContent = isMatch
      ? "Bravo !"
      : "Dommage, ne baissez pas les bras !";

    if (matches >= cardArray.length / 2 - 1) {
      encouragementText.textContent = "Vous y êtes presque !";
    }
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? disableCards() : unflipCards();
    updateEncouragement(isMatch);
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
    matches++;

    if (matches === cardArray.length / 2) {
      stopTimer();
      gameOver = true;
      encouragementText.textContent = "";
      showEndMessage(true);
    }
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }

  function startTimer() {
    if (settings.time === 0) return;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        lockBoard = true;
        gameOver = true;
        encouragementText.textContent = "";
        showEndMessage(false);
      } else {
        timerRemaining--;
        updateTimerDisplay(timerRemaining);
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function resetGame() {
    moveCount = 0;
    matches = 0;
    gameOver = false;
    encouragementText.textContent = "";
    cardArray.sort(() => Math.random() - 0.5);

    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }

    cardArray.forEach(createCard);
    updateMoveCounter();
    initializeTimer();
    timerStarted = false;
    [firstCard, secondCard, lockBoard] = [null, null, false];

    document.querySelector(".winning-message").classList.remove("show");
    document.querySelector(".losing-message").classList.remove("show");
  }

  function showEndMessage(isWin) {
    const messageBox = isWin
      ? document.querySelector(".winning-message")
      : document.querySelector(".losing-message");

    messageBox.textContent = isWin ? "Vous avez gagné !" : "Vous avez perdu !";

    // Ajouter bouton d'enregistrement
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "jeu.php";

    const usernameInput = document.createElement("input");
    usernameInput.type = "hidden";
    usernameInput.name = "username";
    usernameInput.value = localStorage.getItem("playerName");

    const moveInput = document.createElement("input");
    moveInput.type = "hidden";
    moveInput.name = "moves";
    moveInput.value = moveCount;

    const timeInput = document.createElement("input");
    timeInput.type = "hidden";
    timeInput.name = "time";
    const currentTimeText = document.getElementById("timer").textContent.replace("Time: ", "");
    timeInput.value = currentTimeText;

    const difficultyInput = document.createElement("input");
    difficultyInput.type = "hidden";
    difficultyInput.name = "difficulty";
    difficultyInput.value = localStorage.getItem("difficulty"); // Ajouter la difficulté ici

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn";
    submitBtn.textContent = "Enregistrer le score";

    form.appendChild(usernameInput);
    form.appendChild(moveInput);
    form.appendChild(timeInput);
    form.appendChild(difficultyInput); // Ajouter la difficulté au formulaire
    form.appendChild(submitBtn);

    messageBox.appendChild(form);
    messageBox.classList.add("show");
  }

  document.getElementById("resetButton").addEventListener("click", resetGame);
  document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "index.php";
  });

  initializeTimer();
  initializeMoveCount();
  
});

document.getElementById("showScoresBtn").addEventListener("click", () => {
  const difficulty = localStorage.getItem("difficulty") || "moy"; // Par défaut si vide
  window.location.href = `classement.php?difficulty=${difficulty}`;
});
























    

