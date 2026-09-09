function lerp(t, t0, t1, v0, v1) {
  return v0 + (v1 - v0) * (t - t0) / (t1 - t0);
}

function effectiveness(t) {
  if (t >= -24 && t <= 2) return 100;
  if (t > 2 && t <= 4) return lerp(t, 2, 4, 100, 50);
  if (t > 4 && t <= 24) return lerp(t, 4, 24, 50, 5);
  if (t > 24) return 2;
  if (t < -24 && t >= -36) return lerp(t, -36, -24, 20, 100);
  return 15;
}

let sawGood = false;
let sawBad = false;

function timeLabel(t) {
  if (t === 0) return '正是暴露时刻';
  if (t < 0) return `暴露前 ${Math.abs(t)} 小时服用`;
  return `暴露后 ${t} 小时服用`;
}

function pctColor(pct) {
  if (pct >= 80) return '#3ddc97';
  if (pct >= 40) return '#ffb28a';
  return '#ff5d5d';
}

function drawChart(currentT) {
  const canvas = document.getElementById('iodineChart');
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = canvas.clientWidth * dpr);
  const h = (canvas.height = canvas.clientHeight * dpr);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);

  const tMin = -36, tMax = 48;
  const padL = 8 * dpr, padR = 8 * dpr, padT = 10 * dpr, padB = 10 * dpr;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  const xOf = (t) => padL + ((t - tMin) / (tMax - tMin)) * plotW;
  const yOf = (pct) => padT + (1 - pct / 100) * plotH;

  // 网格线
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.lineWidth = 1;
  [0, 25, 50, 75, 100].forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(padL, yOf(p));
    ctx.lineTo(w - padR, yOf(p));
    ctx.stroke();
  });

  // 暴露时刻竖线
  ctx.strokeStyle = 'rgba(255,122,61,.5)';
  ctx.beginPath();
  ctx.moveTo(xOf(0), padT);
  ctx.lineTo(xOf(0), h - padB);
  ctx.stroke();

  // 曲线
  ctx.strokeStyle = '#6fa8ff';
  ctx.lineWidth = 2.4 * dpr;
  ctx.beginPath();
  for (let t = tMin; t <= tMax; t += 1) {
    const x = xOf(t), y = yOf(effectiveness(t));
    if (t === tMin) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 当前点
  const cx = xOf(currentT), cy = yOf(effectiveness(currentT));
  ctx.fillStyle = pctColor(effectiveness(currentT));
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * dpr, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  const t = Number(document.getElementById('iodineSlider').value);
  const pct = Math.round(effectiveness(t));
  document.getElementById('iodineTimeLabel').textContent = timeLabel(t);
  const pctLabel = document.getElementById('iodinePctLabel');
  pctLabel.textContent = `防护效果 ${pct}%`;
  pctLabel.style.color = pctColor(pct);
  drawChart(t);

  if (pct >= 95) sawGood = true;
  if (pct <= 10) sawBad = true;
  if (sawGood && sawBad) {
    const already = getProgress().iodine;
    markVisited('iodine');
    if (!already) showToast('💊 碘片服用时间窗 完成！你已经摸清了防护效果曲线');
    updateNavPill();
  }
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

document.getElementById('iodineSlider').addEventListener('input', update);
window.addEventListener('resize', update);
update();
updateNavPill();
