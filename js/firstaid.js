const FIRSTAID_SCENARIOS = [
  {
    icon: '🤕',
    desc: '前臂被划伤，伤口持续渗血。',
    options: [
      '用干净纱布/布料直接加压覆盖伤口',
      '先用水冲洗伤口再处理',
      '涂抹药膏后再包扎',
      '用嘴吸出伤口里的血',
    ],
    correct: 0,
    note: '加压止血是控制外部出血的第一动作，冲洗、涂药都会耽误止血时机，更不能用嘴吸伤口。',
  },
  {
    icon: '🦵',
    desc: '小腿外伤，出血量比较大。',
    options: [
      '直接压迫伤口并抬高患肢',
      '原地不动，等救援人员处理',
      '按摩伤口周围促进血液循环',
      '立即用绳子勒紧大腿止血',
    ],
    correct: 0,
    note: '加压包扎+抬高患肢就能控制大部分出血；止血带只在压迫无效、出血无法控制时才使用。',
  },
  {
    icon: '🤕',
    desc: '头皮裂伤，出血较多，但伤者意识清醒。',
    options: [
      '用干净布料直接压迫伤口本身',
      '用力压迫颈部血管',
      '让伤者用力仰头拍打头部',
      '用手指按压太阳穴',
    ],
    correct: 0,
    note: '头部外伤应直接压迫伤口，而不是压迫颈部等远端血管，以免影响脑部供血。',
  },
  {
    icon: '✋',
    desc: '手指被利器割伤，持续滴血。',
    options: [
      '抬高手部，用纱布加压包扎',
      '用力甩手，让血流出来',
      '把冰块直接贴在伤口上',
      '用剪刀把伤口剪开扩创',
    ],
    correct: 0,
    note: '抬高伤肢配合直接加压最有效；甩手、直接冰敷、扩创伤口都是错误做法。',
  },
];

let faIndex = 0;
let faDisabled = [];

function renderFirstaid() {
  const stage = document.getElementById('firstaidStage');
  faDisabled = [];

  if (faIndex >= FIRSTAID_SCENARIOS.length) {
    stage.innerHTML = `
      <div class="quiz-summary">
        <div>4 个情景都处理完了！</div>
        <div class="info-box" style="margin-top:16px;">
          <b>通用原则：</b>直接压迫伤口是控制出血的首选方法，配合抬高患肢；
          止血带是压迫无效时的最后手段；头部伤口只压迫伤口本身。
          <br><br>本展项为科普示意，真实急救请以专业培训和现场指导为准。
        </div>
        <div style="margin-top:20px;">
          <button class="btn primary" onclick="restartFirstaid()">重新体验</button>
        </div>
      </div>`;
    const already = getProgress().firstaid;
    markVisited('firstaid');
    if (!already) showToast('🩹 止血急救情景 完成！');
    updateNavPill();
    return;
  }

  const sc = FIRSTAID_SCENARIOS[faIndex];
  stage.innerHTML = `
    <div class="quiz-progress">情景 ${faIndex + 1} / ${FIRSTAID_SCENARIOS.length}</div>
    <div class="scenario-icon">${sc.icon}</div>
    <div class="quiz-question">${sc.desc}</div>
    <div class="bleed-bar-track"><div class="bleed-bar-fill" id="bleedFill" style="width:100%;"></div></div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">出血程度</div>
    <div class="quiz-options" id="faOptions"></div>
    <div class="quiz-note" id="faNote"></div>
  `;

  const box = document.getElementById('faOptions');
  sc.options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = text;
    btn.onclick = () => pickFirstaid(i, sc);
    box.appendChild(btn);
  });
}

function pickFirstaid(i, sc) {
  const buttons = document.querySelectorAll('#faOptions .quiz-option');
  const note = document.getElementById('faNote');
  const fill = document.getElementById('bleedFill');

  if (i === sc.correct) {
    buttons.forEach((b, idx) => { b.disabled = true; if (idx === i) b.classList.add('correct'); });
    fill.style.width = '0%';
    note.textContent = '✅ 处理正确，出血得到了控制。' + sc.note;
    note.classList.add('show');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn primary';
    nextBtn.style.marginTop = '16px';
    nextBtn.textContent = faIndex + 1 < FIRSTAID_SCENARIOS.length ? '下一个情景 →' : '查看总结 →';
    nextBtn.onclick = () => { faIndex++; renderFirstaid(); };
    document.getElementById('firstaidStage').appendChild(nextBtn);
  } else {
    if (faDisabled.includes(i)) return;
    faDisabled.push(i);
    buttons[i].disabled = true;
    buttons[i].classList.add('wrong');
    fill.style.width = '100%';
    fill.style.filter = 'brightness(1.6)';
    setTimeout(() => { fill.style.filter = ''; }, 300);
    note.textContent = '❌ 这样处理不对，出血情况没有改善，换个答案试试。';
    note.classList.add('show');
  }
}

function restartFirstaid() {
  faIndex = 0;
  renderFirstaid();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderFirstaid();
updateNavPill();
