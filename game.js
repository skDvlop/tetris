'use strict';

const COLS = 10;
const ROWS = 20;
let BLOCK_SIZE = 30;
const DESKTOP_BLOCK_SIZE = 30;
const MIN_BLOCK_SIZE = 14;
const BASE_DROP_INTERVAL = 800;
const MIN_DROP_INTERVAL = 120;
const LEVEL_INTERVAL_MS = 30000;
const DROP_INTERVAL_STEP = 55;

const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };

const COLORS = {
  I: '#38bdf8',
  O: '#facc15',
  T: '#c084fc',
  S: '#4ade80',
  Z: '#f87171',
  J: '#60a5fa',
  L: '#fb923c',
};

const SHAPES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
  ],
  O: [
    [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  ],
  T: [
    [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
  ],
  S: [
    [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
  ],
  Z: [
    [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
  ],
  J: [
    [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
  ],
  L: [
    [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
  ],
};

const TYPES = Object.keys(SHAPES);

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const statusEl = document.getElementById('status');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const musicBtn = document.getElementById('music-btn');

let board = createBoard();
let currentPiece = null;
let score = 0;
let level = 1;
let gameState = 'idle';
let lastDropTime = 0;
let gameStartTime = 0;
let pausedAt = 0;
let totalPausedMs = 0;

function getDropInterval(lvl) {
  return Math.max(MIN_DROP_INTERVAL, BASE_DROP_INTERVAL - (lvl - 1) * DROP_INTERVAL_STEP);
}

function getElapsedPlayTime() {
  if (gameState === 'idle' || gameState === 'gameover') return 0;
  const now = gameState === 'paused' ? pausedAt : performance.now();
  return now - gameStartTime - totalPausedMs;
}

function updateLevelFromTime() {
  const nextLevel = 1 + Math.floor(getElapsedPlayTime() / LEVEL_INTERVAL_MS);
  if (nextLevel !== level) {
    level = nextLevel;
    levelEl.textContent = String(level);
  }
}

function resetLevelState() {
  level = 1;
  levelEl.textContent = '1';
  gameStartTime = performance.now();
  totalPausedMs = 0;
  pausedAt = 0;
}

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomType() {
  return TYPES[Math.floor(Math.random() * TYPES.length)];
}

function createPiece(type) {
  return { type, rotation: 0, x: 3, y: 0 };
}

function getMatrix(piece) {
  return SHAPES[piece.type][piece.rotation % SHAPES[piece.type].length];
}

function isValid(piece, offsetX, offsetY, rotation) {
  const matrix = SHAPES[piece.type][rotation % SHAPES[piece.type].length];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!matrix[row][col]) continue;
      const x = piece.x + col + offsetX;
      const y = piece.y + row + offsetY;
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && board[y][x]) return false;
    }
  }
  return true;
}

function lockPiece(piece) {
  const matrix = getMatrix(piece);
  const color = COLORS[piece.type];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!matrix[row][col]) continue;
      const x = piece.x + col;
      const y = piece.y + row;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        board[y][x] = color;
      }
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== null)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(null));
      cleared++;
      row++;
    }
  }
  if (cleared > 0) {
    score += LINE_SCORES[cleared] || cleared * 100;
    scoreEl.textContent = String(score);
  }
}

function spawnPiece() {
  currentPiece = createPiece(randomType());
  if (!isValid(currentPiece, 0, 0, currentPiece.rotation)) {
    currentPiece = null;
    setGameOver();
  }
}

function movePiece(dx, dy) {
  if (!currentPiece || gameState !== 'playing') return false;
  if (isValid(currentPiece, dx, dy, currentPiece.rotation)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    return true;
  }
  return false;
}

function rotatePiece() {
  if (!currentPiece || gameState !== 'playing') return;
  const nextRotation = (currentPiece.rotation + 1) % SHAPES[currentPiece.type].length;
  if (isValid(currentPiece, 0, 0, nextRotation)) {
    currentPiece.rotation = nextRotation;
  }
}

function hardDrop() {
  if (!currentPiece || gameState !== 'playing') return;
  while (movePiece(0, 1)) {
    // 바닥까지 한 번에 이동
  }
  lockPiece(currentPiece);
  clearLines();
  spawnPiece();
  lastDropTime = performance.now();
}

function softDropStep() {
  if (!movePiece(0, 1)) {
    lockPiece(currentPiece);
    clearLines();
    spawnPiece();
  }
}

function tickDrop(timestamp) {
  if (gameState !== 'playing') return;
  updateLevelFromTime();
  const interval = getDropInterval(level);
  if (timestamp - lastDropTime >= interval) {
    softDropStep();
    lastDropTime = timestamp;
  }
}

function updatePauseButton() {
  if (gameState === 'playing') {
    pauseBtn.disabled = false;
    pauseBtn.textContent = '게임 일시정지';
    pauseBtn.classList.remove('is-paused');
  } else if (gameState === 'paused') {
    pauseBtn.disabled = false;
    pauseBtn.textContent = '게임 재개';
    pauseBtn.classList.add('is-paused');
  } else {
    pauseBtn.disabled = true;
    pauseBtn.textContent = '게임 일시정지';
    pauseBtn.classList.remove('is-paused');
  }
}

function drawCell(x, y, color) {
  const px = x * BLOCK_SIZE;
  const py = y * BLOCK_SIZE;
  ctx.fillStyle = color;
  ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, 4);
}

function drawBoard() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let row = 0; row <= ROWS; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * BLOCK_SIZE);
    ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
    ctx.stroke();
  }
  for (let col = 0; col <= COLS; col++) {
    ctx.beginPath();
    ctx.moveTo(col * BLOCK_SIZE, 0);
    ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    ctx.stroke();
  }

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        drawCell(col, row, board[row][col]);
      }
    }
  }
}

function drawPiece(piece) {
  const matrix = getMatrix(piece);
  const color = COLORS[piece.type];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!matrix[row][col]) continue;
      const x = piece.x + col;
      const y = piece.y + row;
      if (y >= 0) {
        drawCell(x, y, color);
      }
    }
  }
}

function drawOverlay(text) {
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f1f5f9';
  const fontSize = Math.max(16, Math.floor(canvas.width / 12));
  ctx.font = `bold ${fontSize}px Segoe UI, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function showStartOverlay(label) {
  startBtn.textContent = label;
  startBtn.disabled = false;
  startOverlay.hidden = false;
}

function hideStartOverlay() {
  startOverlay.hidden = true;
}

function canStartGame() {
  const api = window.TetrisAPI;
  if (api?.isBackendMode() && !api.isLoggedIn()) {
    setStatus('로그인 필요');
    return false;
  }
  return true;
}

window.updateGameAuthState = function updateGameAuthState() {
  if (gameState === 'idle' || gameState === 'gameover') {
    showStartOverlay(gameState === 'gameover' ? 'Restart' : 'Start');
  }
  if (gameState === 'idle') {
    setStatus('대기 중');
  }
};

window.resetGameForLogout = function resetGameForLogout() {
  if (gameState === 'playing' || gameState === 'paused') {
    TetrisMusic.stop();
  }
  board = createBoard();
  currentPiece = null;
  score = 0;
  scoreEl.textContent = '0';
  gameState = 'idle';
  resetLevelState();
  lastDropTime = 0;
  setStatus('대기 중');
  updatePauseButton();
  updateMusicButton();
  showStartOverlay('Start');
  render();
};

window.onGameAreaShown = function onGameAreaShown() {
  scheduleResize();
};

function render() {
  drawBoard();
  if (currentPiece) {
    drawPiece(currentPiece);
  }
  if (gameState === 'gameover') {
    drawOverlay('게임 오버');
  }
}

function gameLoop(timestamp) {
  tickDrop(timestamp);
  render();
  requestAnimationFrame(gameLoop);
}

function setStatus(text) {
  statusEl.textContent = text;
}

function updateMusicButton() {
  if (TetrisMusic.isEnabled()) {
    musicBtn.textContent = '음악 끄기';
    musicBtn.classList.remove('is-off');
    musicBtn.setAttribute('aria-pressed', 'true');
  } else {
    musicBtn.textContent = '음악 켜기';
    musicBtn.classList.add('is-off');
    musicBtn.setAttribute('aria-pressed', 'false');
  }
}

function toggleMusic() {
  TetrisMusic.toggle(gameState === 'playing');
  updateMusicButton();
}

function startGame() {
  if (!canStartGame()) return;

  board = createBoard();
  score = 0;
  scoreEl.textContent = '0';
  gameState = 'playing';
  resetLevelState();
  lastDropTime = performance.now();
  setStatus('플레이 중');
  hideStartOverlay();
  TetrisMusic.start();
  updatePauseButton();
  spawnPiece();
  render();
}

function pauseGame() {
  if (gameState !== 'playing') return;
  pausedAt = performance.now();
  gameState = 'paused';
  setStatus('일시 정지');
  TetrisMusic.pause();
  updatePauseButton();
  render();
}

function resumeGame() {
  if (gameState !== 'paused') return;
  totalPausedMs += performance.now() - pausedAt;
  gameState = 'playing';
  lastDropTime = performance.now();
  setStatus('플레이 중');
  TetrisMusic.start();
  updatePauseButton();
  render();
}

function togglePause() {
  if (gameState === 'playing') {
    pauseGame();
  } else if (gameState === 'paused') {
    resumeGame();
  }
}

function setGameOver() {
  gameState = 'gameover';
  setStatus('게임 오버');
  TetrisMusic.stop();
  updatePauseButton();
  showStartOverlay('Restart');
  render();

  const api = window.TetrisAPI;
  if (api?.isBackendMode() && api.isLoggedIn()) {
    void api.submitPlay(score, level).then(() => {
      if (typeof window.refreshHighScore === 'function') {
        return window.refreshHighScore();
      }
      return null;
    }).catch(() => {
      setStatus('게임 오버 (기록 저장 실패)');
    });
  }
}

function restartGame() {
  if (gameState === 'idle' || gameState === 'gameover') {
    if (!canStartGame()) return;
    startGame();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (gameState === 'idle' || gameState === 'gameover') {
      restartGame();
    }
    return;
  }

  if (event.key === 'p' || event.key === 'P') {
    togglePause();
    return;
  }

  if (gameState !== 'playing') return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
      event.preventDefault();
      movePiece(1, 0);
      break;
    case 'ArrowDown':
      event.preventDefault();
      softDropStep();
      lastDropTime = performance.now();
      break;
    case 'ArrowUp':
      event.preventDefault();
      rotatePiece();
      break;
    case ' ':
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
  render();
});

startBtn.addEventListener('click', restartGame);
pauseBtn.addEventListener('click', togglePause);
musicBtn.addEventListener('click', toggleMusic);

function isMobileLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function isLandscapeMobile() {
  return window.matchMedia('(max-width: 900px) and (orientation: landscape)').matches;
}

function getViewportHeight() {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

function resizeCanvas() {
  const header = document.querySelector('.header');
  const panel = document.querySelector('.game__panel');
  const headerHeight = header ? header.offsetHeight : 0;
  const panelHeight = panel && !isLandscapeMobile() ? panel.offsetHeight : 0;
  const padding = isMobileLayout() ? 20 : 48;
  const viewportHeight = getViewportHeight();
  const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;

  let maxBoardWidth;
  let maxBoardHeight;

  if (isLandscapeMobile()) {
    maxBoardHeight = viewportHeight - headerHeight - padding;
    maxBoardWidth = Math.min(viewportWidth * 0.58, (maxBoardHeight / ROWS) * COLS);
    maxBoardHeight = (maxBoardWidth / COLS) * ROWS;
  } else if (isMobileLayout()) {
    maxBoardWidth = Math.min(viewportWidth - padding * 2, 360);
    const availableHeight = viewportHeight - headerHeight - panelHeight - padding * 3;
    maxBoardHeight = Math.min((maxBoardWidth / COLS) * ROWS, Math.max(availableHeight, 200));
    maxBoardWidth = (maxBoardHeight / ROWS) * COLS;
  } else {
    maxBoardWidth = COLS * DESKTOP_BLOCK_SIZE;
    maxBoardHeight = ROWS * DESKTOP_BLOCK_SIZE;
  }

  const blockW = maxBoardWidth / COLS;
  const blockH = maxBoardHeight / ROWS;
  BLOCK_SIZE = Math.max(MIN_BLOCK_SIZE, Math.floor(Math.min(blockW, blockH)));

  canvas.width = COLS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;
  render();
}

let resizeTimer;
function scheduleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 100);
}

window.addEventListener('resize', scheduleResize);
window.addEventListener('orientationchange', scheduleResize);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scheduleResize);
}

window.addEventListener('load', scheduleResize);

resizeCanvas();
setStatus('대기 중');
updatePauseButton();
updateMusicButton();
showStartOverlay('Start');
render();
requestAnimationFrame(gameLoop);
