let flameId = 0;
let flames = {};
let score = 0;
let spreadCount = 0;
let spawnTimer = null;
let countdownTimer = null;
let timeLeft = 20;
let gameActive = false;
const MAX_FLAMES = 14;
const ROUND_SECONDS = 20;
const FLAME_LIFESPAN = 2400;

function startFire() {
  document.getElementById('fireIntro').style.display = 'none';
  document.getElementById('fireGame').style.display = 'block';
  document.getElementById('fireBanner').classList.remove('show', 'good', 'bad');
  document.getElementById('fireResetBtn').style.display = 'none';

  score = 0;
  spreadCount = 0;
  timeLeft = ROUND_SECONDS;
  flames = {};
  document.getElementById('fireScore').textContent = score;
  document.getElementById('fireSpread').textContent = spreadCount;
  document.getElementById('fireTime').textContent = timeLeft;
  document.getElementById('fireStage').innerHTML = '';
  gameActive = true;

  spawnFlame();
  spawnFlame();
  spawnTimer = setInterval(() => { if (gameActive) spawnFlame(); }, 900);
  countdownTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('fireTime').textContent = Math.max(timeLeft, 0);
    if (timeLeft <= 0) endSpawning();
  }, 1000);
}

function spawnFlame() {
  const stage = document.getElementById('fireStage');
  if (Object.keys(flames).length >= MAX_FLAMES) return;
  const id = 'f' + (flameId++);
  const x = 8 + Math.random() * 84;
  const y = 10 + Math.random() * 78;
  const el = document.createElement('div');
  el.className = 'flame';
  el.textContent = '🔥';
  el.style.left = x + '%';
  el.style.top = y + '%';
  el.onclick = () => extinguish(id);
  stage.appendChild(el);

  const timeout = setTimeout(() => spread(id), FLAME_LIFESPAN);
  flames[id] = { el, timeout };
}

function extinguish(id) {
  const f = flames[id];
  if (!f) return;
  clearTimeout(f.timeout);
  f.el.remove();
  delete flames[id];
  score++;
  document.getElementById('fireScore').textContent = score;
}

function spread(id) {
  const f = flames[id];
  if (!f) return;
  f.el.remove();
  delete flames[id];
  spreadCount++;
  document.getElementById('fireSpread').textContent = spreadCount;
  if (gameActive) {
    spawnFlame();
    spawnFlame();
  }
}

function endSpawning() {
  gameActive = false;
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  setTimeout(finishRound, 1500);
}

function finishRound() {
  const remaining = Object.keys(flames).length;
  Object.values(flames).forEach((f) => { clearTimeout(f.timeout); f.el.remove(); });
  flames = {};

  const banner = document.getElementById('fireBanner');
  banner.classList.add('show');
  const good = score >= 8 && spreadCount <= 3;
  banner.classList.toggle('good', good);
  banner.classList.toggle('bad', !good);
  banner.textContent = good
    ? `🎉 干得漂亮！扑灭 ${score} 处火源，只蔓延了 ${spreadCount} 处。`
    : `扑灭了 ${score} 处，蔓延了 ${spreadCount} 处，还有 ${remaining} 处没处理完 —— 灭火要快、准、稳。`;

  document.getElementById('fireResetBtn').style.display = 'inline-flex';

  const already = getProgress().fire;
  markVisited('fire');
  if (!already) showToast('🧯 灭火挑战 完成！');
  updateNavPill();
}

function resetFire() {
  document.getElementById('fireGame').style.display = 'none';
  document.getElementById('fireIntro').style.display = 'block';
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

updateNavPill();
