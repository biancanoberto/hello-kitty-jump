document.addEventListener('DOMContentLoaded', () => {
  const mario = document.querySelector('.mario');
  const pipe = document.querySelector('.pipe');
  const scoreDisplay = document.getElementById('score');
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const gameBoard = document.querySelector('.game-board');
  const bgMusic = document.getElementById('bg-music');
  const hitSound = document.getElementById('hit-sound');
  const muteBtn = document.getElementById('mute-btn');

  let score = 0;
  let highScore = parseInt(localStorage.getItem('highScore')) || 0;
  let isGameOver = false;
  let isMuted = false;
  let pipePosition = 900;
  let pipeSpeed = 16;
  let scoreInterval;
  let gameFrame;

  hitSound.loop = false;

  function jump() {
    if (!mario.classList.contains('jump')) {
      mario.classList.add('jump');
      setTimeout(() => mario.classList.remove('jump'), 800);
    }
  }

  function gameOver() {
    if (isGameOver) return;
    isGameOver = true;

    clearInterval(scoreInterval);
    cancelAnimationFrame(gameFrame);

    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }

    setTimeout(() => {
      alert(`game over!\nSua pontuação: ${score}\nRecorde: ${highScore}`);
      resetGame();
    }, 100);
  }

  function gameLoop() {
    if (isGameOver) return;

    pipePosition -= pipeSpeed;
    if (pipePosition < -100) pipePosition = 900;
    pipe.style.left = pipePosition + 'px';

    const marioBottom = parseInt(window.getComputedStyle(mario).bottom);
    if (pipePosition < 150 && pipePosition > 50 && marioBottom <= 80) {
      gameOver();
      return;
    }

    gameFrame = requestAnimationFrame(gameLoop);
  }

  function handleKeydown(e) {
    if (e.code === 'Space' || e.key === ' ') jump();
  }

  function handleTouch() {
    jump();
  }

  function startGame() {
    isGameOver = false;
    clearInterval(scoreInterval);
    cancelAnimationFrame(gameFrame);

    score = 0;
    scoreDisplay.textContent = score;
    pipePosition = 900;
    pipe.style.left = pipePosition + 'px';
    pipeSpeed = 16;

    startScreen.style.display = 'none';
    gameBoard.style.display = 'block';

    bgMusic.currentTime = 0;
    bgMusic.play();

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchstart', handleTouch);

    scoreInterval = setInterval(() => {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;
        if (score % 100 === 0) pipeSpeed += 1;
      }
    }, 10);

    gameFrame = requestAnimationFrame(gameLoop);
  }

  function resetGame() {
    isGameOver = false;
    gameBoard.style.display = 'none';
    startScreen.style.display = 'flex';
    pipePosition = 900;
    pipe.style.left = pipePosition + 'px';
    clearInterval(scoreInterval);
    cancelAnimationFrame(gameFrame);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    hitSound.pause();
    hitSound.currentTime = 0;
  }

  startBtn.addEventListener('click', startGame);

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    hitSound.muted = isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });
});
