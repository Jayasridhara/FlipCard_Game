document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.reload(); 
  });

  const symbols = ['♥', '♠', '♣', '♦', '★', '◼', '☀', '☾'];
  let cards = [...symbols, ...symbols];
  cards = cards.sort(() => 0.5 - Math.random());

  const gameBoard = document.getElementById('gameBoard');
  const flippedDisplay = document.getElementById('flippedList');
  const matchedDisplay = document.getElementById('matchedList');

  const gameState = {
    flippedCards: [],
    matchedPairs: [],
    totalMatches: 0,
     moves: 0 
  };
let infoDiv=document.querySelector('.info');
const movesPara = document.createElement('p');
movesPara.innerHTML = '<strong>Moves:</strong> <span id="moveCounter">0</span>';
infoDiv.appendChild(movesPara);

  function updateDisplay() {
    // Show flipped symbols
    flippedDisplay.textContent = gameState.flippedCards.map(c => c.symbol).join(', ') || 'None';

    // Show matched pairs
    if (gameState.matchedPairs.length === 0) {
      matchedDisplay.textContent = 'None';
    } else {
      matchedDisplay.textContent = gameState.matchedPairs.map(pair => pair.join(' & ')).join(' | ');
    }
  }
  function showWinScreen() {
  const winOverlay = document.createElement('div');
  winOverlay.className = 'win-screen';
  winOverlay.innerHTML = `
    <div class="win-message">
      <h2>🎉 You Won!</h2>
      <p>You found all matches in <strong>${gameState.moves}</strong> moves!</p>
      <button onclick="window.location.reload()">🔄 Play Again</button>
    </div>
  `;
  document.body.appendChild(winOverlay);
}

  function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">⬜</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card, symbol, index));
    return card;
  }

  function flipCard(card, symbol, index) {
    if (card.classList.contains('flipped') || gameState.flippedCards.length === 2) return;

    card.classList.add('flipped');
    gameState.flippedCards.push({ card, symbol, index });

    updateDisplay();

    if (gameState.flippedCards.length === 2) {
      const [first, second] = gameState.flippedCards;
      gameState.moves += 1;
      document.getElementById('moveCounter').textContent = gameState.moves;

      if (first.symbol === second.symbol) {
        gameState.totalMatches += 1;
        gameState.matchedPairs.push([first.symbol, second.symbol]);
        gameState.flippedCards = [];
        updateDisplay();

       if (gameState.totalMatches === symbols.length) {
          setTimeout(() => showWinScreen(), 700);
      }

      } else {
        setTimeout(() => {
          first.card.classList.remove('flipped');
          second.card.classList.remove('flipped');
          gameState.flippedCards = [];
          updateDisplay();
        }, 1000);
      }
    }
  }

  cards.forEach((symbol, index) => {
    const card = createCard(symbol, index);
    gameBoard.appendChild(card);
  });

  updateDisplay(); // Initialize info panel
