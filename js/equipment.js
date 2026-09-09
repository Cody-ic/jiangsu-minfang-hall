const GEAR = [
  { id: 'siren', icon: '📯 防空警报器', desc: '发出预先警报、空袭警报、解除警报信号，提示大家进入或解除防护状态' },
  { id: 'mask', icon: '😷 防毒面具', desc: '过滤有毒气体和放射性沾染颗粒，保护佩戴者的呼吸道' },
  { id: 'stretcher', icon: '🩺 急救担架', desc: '转运受伤或无法自行行走的伤员' },
  { id: 'radio', icon: '📻 对讲机', desc: '在通信中断时保持现场人员之间的协调联络' },
  { id: 'aed', icon: '⚡ AED自动体外除颤仪', desc: '对心脏骤停患者进行电击除颤急救' },
  { id: 'axe', icon: '🪓 破拆救援工具', desc: '破拆障碍物，开辟疏散和救援通道' },
];

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pickedIcon = null;
let matchedCount = 0;

function renderMatch() {
  const iconsCol = document.getElementById('matchIcons');
  const descsCol = document.getElementById('matchDescs');
  iconsCol.innerHTML = '';
  descsCol.innerHTML = '';

  shuffleArr(GEAR).forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'match-item';
    btn.textContent = item.icon;
    btn.dataset.id = item.id;
    btn.onclick = () => pickIcon(item.id, btn);
    iconsCol.appendChild(btn);
  });

  shuffleArr(GEAR).forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'match-item';
    btn.textContent = item.desc;
    btn.dataset.id = item.id;
    btn.onclick = () => pickDesc(item.id, btn);
    descsCol.appendChild(btn);
  });
}

function pickIcon(id, el) {
  if (el.classList.contains('matched')) return;
  document.querySelectorAll('#matchIcons .match-item').forEach((b) => b.classList.remove('picked'));
  el.classList.add('picked');
  pickedIcon = { id, el };
}

function pickDesc(id, el) {
  if (el.classList.contains('matched') || !pickedIcon) return;
  if (pickedIcon.id === id) {
    pickedIcon.el.classList.remove('picked');
    pickedIcon.el.classList.add('matched');
    pickedIcon.el.disabled = true;
    el.classList.add('matched');
    el.disabled = true;
    matchedCount++;
    document.getElementById('matchProgress').textContent = `已配对 ${matchedCount} / ${GEAR.length}`;
    pickedIcon = null;
    if (matchedCount === GEAR.length) finishMatch();
  } else {
    el.classList.add('flash-wrong');
    pickedIcon.el.classList.add('flash-wrong');
    setTimeout(() => {
      el.classList.remove('flash-wrong');
      pickedIcon.el.classList.remove('flash-wrong', 'picked');
      pickedIcon = null;
    }, 450);
  }
}

function finishMatch() {
  document.getElementById('matchBanner').classList.add('show');
  const already = getProgress().equipment;
  markVisited('equipment');
  if (!already) showToast('🧰 民防装备认一认 完成！');
  updateNavPill();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderMatch();
updateNavPill();
