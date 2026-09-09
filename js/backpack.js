const ITEMS = [
  { id: 'water', icon: '💧', name: '饮用水', tier: 'essential' },
  { id: 'idcard', icon: '📇', name: '身份证件', tier: 'essential' },
  { id: 'meds', icon: '💊', name: '常用药品', tier: 'essential' },
  { id: 'flashlight', icon: '🔦', name: '手电筒', tier: 'essential' },
  { id: 'whistle', icon: '📯', name: '口哨', tier: 'essential' },
  { id: 'powerbank', icon: '🔋', name: '充电宝', tier: 'useful' },
  { id: 'radio', icon: '📻', name: '收音机', tier: 'useful' },
  { id: 'coat', icon: '🧥', name: '保暖衣物', tier: 'useful' },
  { id: 'cash', icon: '💵', name: '现金', tier: 'useful' },
  { id: 'makeup', icon: '💄', name: '化妆品', tier: 'low' },
  { id: 'console', icon: '🎮', name: '游戏机', tier: 'low' },
  { id: 'heels', icon: '👠', name: '高跟鞋', tier: 'low' },
];

const CAPACITY = 6;
let selected = new Set();

function renderItems() {
  const grid = document.getElementById('itemGrid');
  grid.innerHTML = '';
  ITEMS.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'item-card' + (selected.has(item.id) ? ' selected' : '');
    card.innerHTML = `<span class="icon">${item.icon}</span>${item.name}`;
    card.onclick = () => toggleItem(item.id);
    grid.appendChild(card);
  });
  document.getElementById('slotsLabel').textContent = `已装 ${selected.size} / ${CAPACITY}`;
}

function toggleItem(id) {
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (selected.size >= CAPACITY) {
      showToast('背包已经装满啦，先拿出一件再装新的');
      return;
    }
    selected.add(id);
  }
  renderItems();
}

function submitPack() {
  if (selected.size === 0) {
    showToast('先选几件物资再打包吧');
    return;
  }
  const essentialItems = ITEMS.filter((i) => i.tier === 'essential');
  const usefulItems = ITEMS.filter((i) => i.tier === 'useful');
  const lowItems = ITEMS.filter((i) => i.tier === 'low');

  const gotEssential = essentialItems.filter((i) => selected.has(i.id));
  const missedEssential = essentialItems.filter((i) => !selected.has(i.id));
  const gotUseful = usefulItems.filter((i) => selected.has(i.id));
  const gotLow = lowItems.filter((i) => selected.has(i.id));

  let verdict;
  if (gotEssential.length === essentialItems.length) verdict = '🎒 满分应急包！核心物资一件不少。';
  else if (gotEssential.length >= 3) verdict = '基本合格，但还差几件核心应急物资。';
  else verdict = '⚠️ 危险！核心应急物资严重不足，真遇到状况会很被动。';

  const box = document.getElementById('packResult');
  box.style.display = 'block';
  box.innerHTML = `
    <div class="line"><b>${verdict}</b></div>
    <div class="line">✅ 命中核心物资：${gotEssential.length}/${essentialItems.length}${gotEssential.length ? '（' + gotEssential.map((i) => i.icon + i.name).join('、') + '）' : ''}</div>
    ${missedEssential.length ? `<div class="line">❌ 漏掉的核心物资：${missedEssential.map((i) => i.icon + i.name).join('、')}</div>` : ''}
    <div class="line">➕ 额外实用物资：${gotUseful.length}/${usefulItems.length}${gotUseful.length ? '（' + gotUseful.map((i) => i.icon + i.name).join('、') + '）' : ''}</div>
    ${gotLow.length ? `<div class="line">🤔 选进了优先级较低的物品：${gotLow.map((i) => i.icon + i.name).join('、')}，紧急情况下可以先舍弃。</div>` : ''}
  `;

  const already = getProgress().backpack;
  markVisited('backpack');
  if (!already) showToast('🎒 应急背包打包挑战 完成！');
  updateNavPill();
}

function resetPack() {
  selected = new Set();
  document.getElementById('packResult').style.display = 'none';
  renderItems();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderItems();
updateNavPill();
