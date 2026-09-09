const WALL_QUESTIONS = [
  { q: '平时利用人防工程，不得影响其（　　）效能。', options: ['防护', '经济', '通风', '采光'], correct: 0,
    note: '人防工程首要功能是战时防护，平时利用不能牺牲这一点。' },
  { q: '人民防空是（　　）的重要组成部分。', options: ['国防', '民生', '交通', '教育'], correct: 0,
    note: '《中华人民共和国人民防空法》明确这一定位。' },
  { q: '我国的根本大法是（　　）。', options: ['宪法', '民法典', '刑法', '行政法'], correct: 0,
    note: '一切法律法规都不得与宪法相抵触。' },
  { q: '我国的防空体系由野战防空、要地防空和（　　）组成。', options: ['人民防空', '海上防空', '边境防空', '网络防空'], correct: 0,
    note: '三者共同构成国家防空体系。' },
  { q: '人防工程停车位出租的租赁期限不得超过（　　）。', options: ['三年', '十年', '二十年', '一个月'], correct: 0,
    note: '依据《江苏省物业管理条例》第六十六条、第八十九条，超期部分面临行政处罚。' },
  { q: '人民防空任务使命是（　　）、平时服务、应急支援。', options: ['战时防护', '经济建设', '文化宣传', '交通疏导'], correct: 0,
    note: '三句话概括人防工作的核心职责。' },
  { q: '我省防空警报试鸣日是（　　）。', options: ['9月18日', '7月1日', '10月1日', '12月13日'], correct: 0,
    note: '呼应"九一八"历史纪念日，江苏自2015年起每年此日统一试鸣。' },
  { q: '人防工程停车位不得（　　）和附赠。', options: ['出售', '清洗', '照明', '喷涂'], correct: 0,
    note: '人防工程产权归国家所有，车位只能出租使用权，不能买卖。' },
  { q: '《江苏省核事故预防和应急管理条例》规定，核事故预防和应急工作应当坚持（　　）、保护公众、保护环境的原则。',
    options: ['预防为主', '效益优先', '企业自治', '事后补偿'], correct: 0,
    note: '三项原则中，预防为主被放在首位。' },
  { q: '人民防空实行长期准备、重点建设、（　　）的方针。', options: ['平战结合', '军民分离', '科技先行', '分区管理'], correct: 0,
    note: '这是我国人民防空建设的基本方针。' },
  { q: '防空袭警报信号分为几种类型？', options: ['3种', '2种', '4种', '5种'], correct: 0,
    note: '预先警报、空袭警报、解除警报，可去"警报试听台"亲耳分辨。' },
  { q: '在平时，城市发生（　　）等突发性事故时，人员也能利用人防工程做应急防护之用。',
    options: ['火灾、爆炸、危险化学品泄漏', '交通拥堵', '停电检修', '网络故障'], correct: 0,
    note: '人防工程平战结合，也承担城市日常应急避险功能。' },
];

let qIndex = 0;
let correctCount = 0;
let answered = false;

function shuffleOptions(q) {
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { options: idx.map((i) => q.options[i]), correct: idx.indexOf(q.correct) };
}

function renderQuestion() {
  answered = false;
  const stage = document.getElementById('quizStage');
  const total = WALL_QUESTIONS.length;

  if (qIndex >= total) {
    stage.innerHTML = `
      <div class="quiz-summary">
        <div>答题完成！</div>
        <b>${correctCount} / ${total}</b>
        <div style="color:var(--text-dim);font-size:13px;">${
          correctCount === total ? '全对！人防法规摸得很透了' :
          correctCount >= total * 0.7 ? '不错，大部分都答对了' : '还有几个知识点值得再看看'
        }</div>
        <div style="margin-top:20px;">
          <button class="btn primary" onclick="restartQuiz()">重新答题</button>
        </div>
      </div>`;
    const already = getProgress().wall;
    markVisited('wall');
    if (!already) showToast('🧩 法规知识问答墙 完成！');
    updateNavPill();
    return;
  }

  const q = WALL_QUESTIONS[qIndex];
  const shuffled = shuffleOptions(q);
  stage.innerHTML = `
    <div class="quiz-progress">第 ${qIndex + 1} / ${total} 题 · 已答对 ${correctCount}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options" id="quizOptions"></div>
    <div class="quiz-note" id="quizNote"></div>
  `;

  const optionsBox = document.getElementById('quizOptions');
  shuffled.options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = text;
    btn.onclick = () => selectAnswer(i, shuffled.correct, q.note);
    optionsBox.appendChild(btn);
  });
}

function selectAnswer(i, correctIdx, note) {
  if (answered) return;
  answered = true;
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === correctIdx) b.classList.add('correct');
    else if (idx === i) b.classList.add('wrong');
  });
  if (i === correctIdx) correctCount++;

  const noteBox = document.getElementById('quizNote');
  noteBox.textContent = (i === correctIdx ? '✅ 答对了！' : '❌ 答错了，正确答案已高亮。') + ' ' + note;
  noteBox.classList.add('show');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn primary';
  nextBtn.style.marginTop = '16px';
  nextBtn.textContent = qIndex + 1 < WALL_QUESTIONS.length ? '下一题 →' : '查看结果 →';
  nextBtn.onclick = () => { qIndex++; renderQuestion(); };
  document.getElementById('quizStage').appendChild(nextBtn);
}

function restartQuiz() {
  qIndex = 0;
  correctCount = 0;
  renderQuestion();
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

renderQuestion();
updateNavPill();
