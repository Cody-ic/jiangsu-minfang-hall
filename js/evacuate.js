const MAZE = [
  '#########',
  '#P..#..X#',
  '#.#...#.#',
  '#.#.#.#.#',
  '#...#...#',
  '#.#...#E#',
  '#########',
];

let grid = MAZE.map((row) => row.split(''));
let player = findStart();
let startTime = null;
let timerInterval = null;
let won = false;
let hazardHits = 0;

function findStart() {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'P') return { r, c };
    }
  }
  return { r: 1, c: 1 };
}

function renderGrid() {
  const container = document.getElementById('evacGrid');
  container.style.gridTemplateColumns = `repeat(${grid[0].length}, 38px)`;
  container.innerHTML = '';
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const ch = grid[r][c];
      const cell = document.createElement('div');
      cell.className = 'evac-cell';
      if (ch === '#') cell.classList.add('wall');
      else if (ch === 'X') { cell.classList.add('hazard'); cell.textContent = '🔥'; }
      else if (ch === 'E') { cell.classList.add('exit'); cell.textContent = '🚪'; }
      cell.dataset.r = r;
      cell.dataset.c = c;
      container.appendChild(cell);
    }
  }
  drawPlayer();
}

function drawPlayer() {
  document.querySelectorAll('.evac-cell').forEach((el) => {
    const r = Number(el.dataset.r), c = Number(el.dataset.c);
    if (r === player.r && c === player.c) {
      if (!el.classList.contains('exit')) el.textContent = '🧍';
    } else {
      const ch = grid[r][c];
      el.textContent = ch === 'X' ? '🔥' : ch === 'E' ? '🚪' : '';
    }
  });
  updateFog();
}

function updateFog() {
  const size = 38, gap = 3, pad = 6;
  const x = pad + player.c * (size + gap) + size / 2;
  const y = pad + player.r * (size + gap) + size / 2;
  const fog = document.getElementById('evacFog');
  fog.style.setProperty('--fog-x', x + 'px');
  fog.style.setProperty('--fog-y', y + 'px');
}

function tryMove(dr, dc) {
  if (won) return;
  if (!startTime) startTimer();
  const nr = player.r + dr, nc = player.c + dc;
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;
  const ch = grid[nr][nc];
  if (ch === '#') return;
  player = { r: nr, c: nc };
  if (ch === 'X') {
    hazardHits++;
    flashHazard();
  }
  drawPlayer();
  if (ch === 'E') win();
}

function flashHazard() {
  const stage = document.querySelector('.stage');
  stage.style.boxShadow = '0 0 0 3px rgba(255,93,93,.6) inset';
  setTimeout(() => { stage.style.boxShadow = ''; }, 200);
  showToast('😷 呛到浓烟了，尽快远离火源方向');
}

function startTimer() {
  startTime = performance.now();
  timerInterval = setInterval(() => {
    const secs = ((performance.now() - startTime) / 1000).toFixed(1);
    document.getElementById('evacTimer').textContent = `用时 ${secs} 秒`;
  }, 100);
}

function win() {
  won = true;
  clearInterval(timerInterval);
  const secs = ((performance.now() - startTime) / 1000).toFixed(1);
  const banner = document.getElementById('evacBanner');
  banner.classList.add('show', 'good');
  banner.textContent = hazardHits === 0
    ? `🎉 完美逃生！用时 ${secs} 秒，全程没有呛到浓烟`
    : `🎉 成功逃生！用时 ${secs} 秒，中途呛到 ${hazardHits} 次浓烟`;

  const already = getProgress().evacuate;
  markVisited('evacuate');
  if (!already) showToast('🚪 浓烟疏散逃生 完成！');
  updateNavPill();
}

function resetGame() {
  player = findStart();
  won = false;
  hazardHits = 0;
  startTime = null;
  clearInterval(timerInterval);
  document.getElementById('evacTimer').textContent = '用时 0.0 秒';
  const banner = document.getElementById('evacBanner');
  banner.classList.remove('show', 'good');
  drawPlayer();
}

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
    w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1],
  };
  if (map[e.key]) {
    e.preventDefault();
    tryMove(map[e.key][0], map[e.key][1]);
  }
});

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderGrid();
updateNavPill();
