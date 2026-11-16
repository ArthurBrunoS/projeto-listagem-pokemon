"use strict";
function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;
}
if (typeof module !== "undefined" && module.exports) module.exports = { intersects };
if (typeof document !== "undefined") {
  const board = document.querySelector(".game-board");
  const mario = document.querySelector(".mario");
  const pipe = document.querySelector(".pipe");
  const startButton = document.getElementById("start");
  const jumpButton = document.getElementById("jump");
  const pauseButton = document.getElementById("pause");
  const status = document.getElementById("game-status");
  const scoreText = document.getElementById("score");
  const bestText = document.getElementById("best");
  let state = "ready";
  let score = 0;
  let best = 0;
  let y = 0;
  let velocity = 0;
  let pipeX = 0;
  let lastTime = null;
  let frame;
  try {
    const saved = Number(localStorage.getItem("mario-best"));
    best = Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
  } catch { /* The game works without browser storage. */ }
  bestText.textContent = best;

  function draw() {
    mario.style.bottom = y + "px";
    pipe.style.left = pipeX + "px";
    scoreText.textContent = score;
  }
  function finish() {
    state = "over";
    cancelAnimationFrame(frame);
    mario.src = "./images/game-over.png";
    jumpButton.disabled = true;
    pauseButton.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Jogar novamente";
    status.textContent = "Fim de jogo! Você fez " + score + " ponto(s).";
    if (score > best) {
      best = score;
      bestText.textContent = best;
      try { localStorage.setItem("mario-best", String(best)); } catch { /* Optional persistence. */ }
    }
  }
  function tick(time) {
    if (state !== "running") return;
    const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, .035);
    lastTime = time;
    velocity -= 1900 * dt;
    y = Math.max(0, y + velocity * dt);
    if (y === 0) velocity = 0;
    pipeX -= Math.min(420, 240 + score * 8) * dt;
    if (pipeX < -50) {
      score++;
      pipeX = board.clientWidth + 100;
    }
    draw();
    const player = { x: 34, y: y + 5, width: 44, height: 65 };
    const obstacle = { x: pipeX + 5, y: 0, width: 40, height: 65 };
    if (intersects(player, obstacle)) { finish(); return; }
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (state === "running" || state === "paused") return;
    cancelAnimationFrame(frame);
    score = 0;
    y = 0;
    velocity = 0;
    lastTime = null;
    pipeX = board.clientWidth + 100;
    mario.src = "./images/mario.gif";
    state = "running";
    startButton.disabled = true;
    jumpButton.disabled = false;
    pauseButton.disabled = false;
    pauseButton.textContent = "Pausar";
    status.textContent = "Jogo iniciado. Pule os obstáculos!";
    draw();
    board.focus();
    frame = requestAnimationFrame(tick);
  }
  function jump() {
    if (state === "running" && y === 0) velocity = 690;
  }
  function togglePause() {
    if (state === "running") {
      state = "paused";
      cancelAnimationFrame(frame);
      jumpButton.disabled = true;
      pauseButton.textContent = "Continuar";
      status.textContent = "Jogo pausado.";
    } else if (state === "paused") {
      state = "running";
      lastTime = null;
      jumpButton.disabled = false;
      pauseButton.textContent = "Pausar";
      status.textContent = "Jogo retomado.";
      frame = requestAnimationFrame(tick);
    }
  }
  startButton.addEventListener("click", start);
  jumpButton.addEventListener("click", jump);
  pauseButton.addEventListener("click", togglePause);
  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest("input, textarea, select, button, a")) return;
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      if (event.repeat) return;
      if (state === "ready" || state === "over") start();
      else jump();
    }
    if (event.code === "KeyP" && !event.repeat) togglePause();
  });
  window.addEventListener("blur", () => { if (state === "running") togglePause(); });
}
