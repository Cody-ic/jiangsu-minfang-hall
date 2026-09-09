const HOME_CARDS = [
  { id: 'gas', icon: '⚠️', name: '燃气灶忘记关火', hazard: true },
  { id: 'outlet', icon: '🔌', name: '一个插座板接了七八个大功率电器', hazard: true },
  { id: 'balcony', icon: '📦', name: '阳台堆满杂物，挡住逃生通道', hazard: true },
  { id: 'microwave', icon: '🥫', name: '微波炉里放金属饭盒加热', hazard: true },
  { id: 'candle', icon: '🕯️', name: '蜡烛就放在窗帘旁边', hazard: true },
  { id: 'smokeAlarm', icon: '🔔', name: '定期检查烟雾报警器电池', hazard: false },
  { id: 'extinguisher', icon: '🧯', name: '厨房里备了一个灭火器', hazard: false },
  { id: 'exitSign', icon: '🚪', name: '安全出口标志清晰、通道畅通', hazard: false },
  { id: 'checkExt', icon: '✅', name: '灭火器定期年检，压力正常', hazard: false },
  { id: 'railing', icon: '🪟', name: '阳台护栏牢固，定期检查', hazard: false },
];

let homeSelected = new Set();

function renderHome() {
  const grid = document.getElementById('homeGrid');
  grid.innerHTML = '';
  HOME_CARDS.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'item-card' + (homeSelected.has(c.id) ? ' selected' : '');
    card.innerHTML = `<span class="icon">${c.icon}</span>${c.name}`;
    card.onclick = () => {
      if (homeSelected.has(c.id)) homeSelected.delete(c.id);
      else homeSelected.add(c.id);
      renderHome();
    };
    grid.appendChild(card);
  });
}

function submitHome() {
  const hazards = HOME_CARDS.filter((c) => c.hazard);
  const found = hazards.filter((c) => homeSelected.has(c.id));
  const missed = hazards.filter((c) => !homeSelected.has(c.id));
  const falseAlarms = HOME_CARDS.filter((c) => !c.hazard && homeSelected.has(c.id));

  let verdict;
  if (found.length === hazards.length && falseAlarms.length === 0) verdict = '🏠 全部找对！这个家你来守护很放心。';
  else if (found.length >= 3) verdict = '不错，找到了大部分隐患，再仔细看看还有没有漏网之鱼。';
  else verdict = '⚠️ 漏掉的隐患有点多，居家安全意识还要加强。';

  const box = document.getElementById('homeResult');
  box.style.display = 'block';
  box.innerHTML = `
    <div class="line"><b>${verdict}</b></div>
    <div class="line">✅ 找到隐患：${found.length}/${hazards.length}${found.length ? '（' + found.map((c) => c.icon + c.name).join('、') + '）' : ''}</div>
    ${missed.length ? `<div class="line">❌ 漏掉的隐患：${missed.map((c) => c.icon + c.name).join('、')}</div>` : ''}
    ${falseAlarms.length ? `<div class="line">🤔 这些其实没问题，误报了：${falseAlarms.map((c) => c.icon + c.name).join('、')}</div>` : ''}
  `;

  const already = getProgress().home;
  markVisited('home');
  if (!already) showToast('🏠 居家安全找茬 完成！');
  updateNavPill();
}

function resetHome() {
  homeSelected = new Set();
  document.getElementById('homeResult').style.display = 'none';
  renderHome();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderHome();
updateNavPill();
