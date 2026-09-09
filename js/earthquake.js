const TOTAL_EQ_ROUNDS = 3;
let eqRound = 0;
let eqAlertTime = null;
let eqWaitTimer = null;
let eqRoundActive = false;
let eqTimes = [];

function startEqTest() {
  document.getElementById('eqStartBtn').style.display = 'none';
  document.getElementById('eqRestartBtn').style.display = 'none';
  document.getElementById('eqBanner').classList.remove('show', 'good', 'bad');
  eqRound = 0;
  eqTimes = [];
  document.getElementById('eqRounds').textContent = '';
  nextEqRound();
}

function nextEqRound() {
  eqRound++;
  if (eqRound > TOTAL_EQ_ROUNDS) return finishEq();
  document.getElementById('eqActionBtn').disabled = true;
  document.getElementById('eqAlert').textContent = '';
  document.getElementById('eqStatus').textContent = `第 ${eqRound}/${TOTAL_EQ_ROUNDS} 轮 · 监测中，保持警觉…`;
  eqRoundActive = false;
  const delay = 1500 + Math.random() * 2500;
  eqWaitTimer = setTimeout(triggerEqAlert, delay);
}

function triggerEqAlert() {
  eqRoundActive = true;
  eqAlertTime = performance.now();
  document.getElementById('eqStatus').textContent = '警报已触发！';
  document.getElementById('eqAlert').textContent = '⚠️ 地震预警！';
  document.querySelector('.stage').classList.add('shaking');
  document.getElementById('eqActionBtn').disabled = false;
}

function eqAction() {
  if (!eqRoundActive) {
    showToast('还没响警报呢，别抢跑，等警报出现再避险');
    return;
  }
  eqRoundActive = false;
  const reaction = performance.now() - eqAlertTime;
  eqTimes.push(reaction);
  document.querySelector('.stage').classList.remove('shaking');
  document.getElementById('eqActionBtn').disabled = true;
  document.getElementById('eqAlert').textContent = `✅ 用时 ${(reaction / 1000).toFixed(2)} 秒`;
  document.getElementById('eqRounds').textContent =
    `已完成 ${eqTimes.length}/${TOTAL_EQ_ROUNDS} 轮：` + eqTimes.map((t) => (t / 1000).toFixed(2) + 's').join(' / ');
  setTimeout(nextEqRound, 1200);
}

function finishEq() {
  const avg = eqTimes.reduce((a, b) => a + b, 0) / eqTimes.length / 1000;
  const banner = document.getElementById('eqBanner');
  banner.classList.add('show');
  const good = avg <= 2.5;
  banner.classList.toggle('good', good);
  banner.classList.toggle('bad', !good);
  banner.textContent = avg <= 1.5
    ? `⚡ 平均反应 ${avg.toFixed(2)} 秒，教科书级避险速度！`
    : avg <= 2.5
      ? `平均反应 ${avg.toFixed(2)} 秒，不错，继续保持`
      : `平均反应 ${avg.toFixed(2)} 秒，再快一点，黄金反应时间很短暂`;

  document.getElementById('eqStatus').textContent = '测试完成';
  document.getElementById('eqActionBtn').disabled = true;
  document.getElementById('eqRestartBtn').style.display = 'inline-flex';

  const already = getProgress().earthquake;
  markVisited('earthquake');
  if (!already) showToast('🏚️ 地震反应速度挑战 完成！');
  updateNavPill();
}

function restartEq() {
  startEqTest();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

document.getElementById('eqActionBtn').disabled = true;
updateNavPill();
