/* 全站共享：展项进度管理（localStorage） */
const EXHIBITS = [
  { id: 'wall',       name: '法规知识问答墙',     icon: '🧩' },
  { id: 'timeline',   name: '国防建设成就时间轴', icon: '🕰️' },
  { id: 'siren',      name: '防空警报试听台',     icon: '📢' },
  { id: 'evacuate',   name: '浓烟疏散逃生',       icon: '🚪' },
  { id: 'fire',       name: '灭火挑战',           icon: '🧯' },
  { id: 'earthquake', name: '地震反应速度挑战',   icon: '🏚️' },
  { id: 'triangle',   name: '地震避险选位',       icon: '🔺' },
  { id: 'cpr',        name: '心肺复苏训练台',     icon: '🫀' },
  { id: 'sequence',   name: '急救步骤排序',       icon: '🔀' },
  { id: 'firstaid',   name: '止血急救情景',       icon: '🩹' },
  { id: 'iodine',     name: '碘片服用时间窗',     icon: '💊' },
  { id: 'radiation',  name: '辐射安全三原则',     icon: '☢️' },
  { id: 'equipment',  name: '民防装备认一认',     icon: '🧰' },
  { id: 'home',       name: '居家安全找茬',       icon: '🏠' },
  { id: 'backpack',   name: '应急背包打包',       icon: '🎒' },
];

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('mf_progress')) || {};
  } catch (e) {
    return {};
  }
}

function markVisited(id) {
  const p = getProgress();
  p[id] = true;
  localStorage.setItem('mf_progress', JSON.stringify(p));
}

function progressCount() {
  const p = getProgress();
  return EXHIBITS.filter((e) => p[e.id]).length;
}

function resetProgress() {
  localStorage.removeItem('mf_progress');
  location.reload();
}

/* 小提示条：展项完成时弹出的轻量反馈 */
function showToast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.remove('show');
  // reflow 以便重复触发动画
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2600);
}
