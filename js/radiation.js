const touched = new Set();

function computeIndex() {
  const dist = Number(document.getElementById('distSlider').value);
  const shield = Number(document.getElementById('shieldSelect').value);
  const time = Number(document.getElementById('timeSlider').value);
  const BASE = 200;
  return (BASE * time) / (dist * dist) * shield;
}

function zoneFor(index) {
  if (index < 10) return { label: '安全', color: '#3ddc97' };
  if (index < 100) return { label: '注意', color: '#ffb28a' };
  return { label: '高风险', color: '#ff5d5d' };
}

function update() {
  document.getElementById('distLabel').textContent = document.getElementById('distSlider').value;
  document.getElementById('timeLabel').textContent = document.getElementById('timeSlider').value;

  const index = computeIndex();
  const zone = zoneFor(index);
  const display = index >= 1000 ? Math.round(index).toLocaleString() : index.toFixed(1);

  const valueEl = document.getElementById('radValue');
  valueEl.textContent = display;
  valueEl.style.color = zone.color;
  const zoneEl = document.getElementById('radZone');
  zoneEl.textContent = `（${zone.label}）`;
  zoneEl.style.color = zone.color;

  const barPct = Math.min(100, (Math.log10(index + 1) / Math.log10(10000)) * 100);
  const bar = document.getElementById('radBar');
  bar.style.width = barPct + '%';
  bar.style.background = zone.color;

  checkDone();
}

function checkDone() {
  if (touched.size === 3) {
    const already = getProgress().radiation;
    markVisited('radiation');
    if (!already) showToast('☢️ 辐射安全三原则 完成！');
    updateNavPill();
  }
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

document.getElementById('distSlider').addEventListener('input', () => { touched.add('dist'); update(); });
document.getElementById('shieldSelect').addEventListener('change', () => { touched.add('shield'); update(); });
document.getElementById('timeSlider').addEventListener('input', () => { touched.add('time'); update(); });

update();
updateNavPill();
