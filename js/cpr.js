const CPR_TARGET = 15;
let timestamps = [];
let finished = false;

function tap() {
  if (finished) return;
  const now = performance.now();
  timestamps.push(now);
  beatAnimation();
  document.getElementById('tapCounter').textContent = `已按压 ${timestamps.length} / ${CPR_TARGET}`;
  if (timestamps.length >= CPR_TARGET) finish();
}

function beatAnimation() {
  const heart = document.getElementById('heart');
  heart.classList.add('beat');
  setTimeout(() => heart.classList.remove('beat'), 90);
}

function finish() {
  finished = true;
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) intervals.push(timestamps[i] - timestamps[i - 1]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = Math.round(60000 / avg);
  document.getElementById('bpmValue').innerHTML = `${bpm}<span> 次/分钟</span>`;

  const banner = document.getElementById('resultBanner');
  banner.classList.add('show');
  if (bpm >= 100 && bpm <= 120) {
    banner.classList.add('good');
    banner.classList.remove('bad');
    banner.textContent = `👍 ${bpm} 次/分钟，正好落在成人心肺复苏标准频率 100–120 次/分钟范围内！`;
  } else if (bpm < 100) {
    banner.classList.add('bad');
    banner.classList.remove('good');
    banner.textContent = `${bpm} 次/分钟，偏慢了，标准是 100–120 次/分钟，再快一点试试`;
  } else {
    banner.classList.add('bad');
    banner.classList.remove('good');
    banner.textContent = `${bpm} 次/分钟，偏快了，标准是 100–120 次/分钟，稍微放慢一些`;
  }

  const already = getProgress().cpr;
  markVisited('cpr');
  if (!already) showToast('🫀 心肺复苏训练台 完成！');
  updateNavPill();
}

function resetCpr() {
  timestamps = [];
  finished = false;
  document.getElementById('tapCounter').textContent = `已按压 0 / ${CPR_TARGET}`;
  document.getElementById('bpmValue').innerHTML = '--<span> 次/分钟</span>';
  const banner = document.getElementById('resultBanner');
  banner.classList.remove('show', 'good', 'bad');
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    tap();
  }
});

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

updateNavPill();
