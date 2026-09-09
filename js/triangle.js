const SPOTS = {
  spotTable: { correct: true, note: '✅ 正确！靠近坚固的桌子蹲下，用桌面遮挡头颈，双手抓牢桌腿，是目前普遍推荐的室内避险方式。' },
  spotDoor: { correct: false, note: '❌ 站在门框下并不比其他地方更安全，现代建筑的门框结构未必比室内其他位置更牢固，容易被人流和坠物冲击。' },
  spotWindow: { correct: false, note: '❌ 靠近窗户很危险，晃动中玻璃可能破裂飞溅，应尽量远离窗户、镜子等易碎物品。' },
  spotCenter: { correct: false, note: '❌ 空旷地面正中央没有任何遮挡物，头部容易被坠落物砸伤，不如靠近坚固家具蹲下。' },
};

function initTriangle() {
  Object.keys(SPOTS).forEach((id) => {
    document.getElementById(id).addEventListener('click', () => pickSpot(id));
  });
  updateNavPill();
}

function pickSpot(id) {
  const info = SPOTS[id];
  const el = document.getElementById(id);
  const banner = document.getElementById('triBanner');
  banner.classList.add('show');

  if (info.correct) {
    document.querySelectorAll('.room-spot').forEach((s) => { s.disabled = true; });
    el.classList.add('correct');
    banner.classList.add('good');
    banner.classList.remove('bad');
    banner.textContent = info.note;

    const already = getProgress().triangle;
    markVisited('triangle');
    if (!already) showToast('🔺 地震避险选位 完成！');
    updateNavPill();
  } else {
    el.classList.add('wrong');
    banner.classList.add('bad');
    banner.classList.remove('good');
    banner.textContent = info.note;
  }
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

initTriangle();
