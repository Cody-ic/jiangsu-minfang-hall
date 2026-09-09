const SEQ_STEPS = [
  '判断现场安全，确保自身不再身处危险',
  '轻拍双肩呼喊，判断意识和呼吸',
  '拨打120呼救（或指定他人拨打）',
  '立即开始胸外按压（心肺复苏）',
  '如现场有AED，尽快取来使用',
];

let seqPool = [];
let seqSelected = [];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initSeq() {
  seqPool = shuffleArray(SEQ_STEPS.map((text, idx) => ({ text, idx })));
  seqSelected = [];
  document.getElementById('seqBanner').classList.remove('show', 'good', 'bad');
  document.getElementById('seqAnswerBox').style.display = 'none';
  renderSeq();
  updateNavPill();
}

function renderSeq() {
  const pool = document.getElementById('seqPool');
  pool.innerHTML = '';
  seqPool.forEach((item) => {
    const chip = document.createElement('div');
    chip.className = 'seq-chip';
    chip.textContent = item.text;
    chip.onclick = () => pickSeq(item);
    pool.appendChild(chip);
  });

  const selected = document.getElementById('seqSelected');
  selected.innerHTML = '';
  seqSelected.forEach((item, i) => {
    const chip = document.createElement('div');
    chip.className = 'seq-chip';
    chip.innerHTML = `<span class="num">${i + 1}</span>${item.text}`;
    selected.appendChild(chip);
  });

  document.getElementById('seqSubmitBtn').disabled = seqSelected.length !== SEQ_STEPS.length;
}

function pickSeq(item) {
  seqPool = seqPool.filter((i) => i !== item);
  seqSelected.push(item);
  renderSeq();
}

function undoSeq() {
  if (seqSelected.length === 0) return;
  const last = seqSelected.pop();
  seqPool.push(last);
  renderSeq();
}

function resetSeq() {
  initSeq();
}

function submitSeq() {
  let correct = 0;
  document.querySelectorAll('#seqSelected .seq-chip').forEach((chip, i) => {
    const isRight = seqSelected[i].idx === i;
    chip.classList.add(isRight ? 'correct' : 'wrong');
    if (isRight) correct++;
  });

  const banner = document.getElementById('seqBanner');
  banner.classList.add('show');
  const good = correct === SEQ_STEPS.length;
  banner.classList.toggle('good', good);
  banner.classList.toggle('bad', !good);
  banner.textContent = good
    ? `🎉 全部排对了！${correct}/${SEQ_STEPS.length}`
    : `排对了 ${correct}/${SEQ_STEPS.length} 步，正确顺序见下方解析`;

  const answerBox = document.getElementById('seqAnswerBox');
  answerBox.style.display = 'block';
  answerBox.innerHTML = '<b>正确顺序：</b><br>' + SEQ_STEPS.map((s, i) => `${i + 1}. ${s}`).join('<br>');

  document.getElementById('seqSubmitBtn').disabled = true;

  const already = getProgress().sequence;
  markVisited('sequence');
  if (!already) showToast('🔀 急救步骤排序 完成！');
  updateNavPill();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

initSeq();
