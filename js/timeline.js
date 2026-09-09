const MILESTONES = [
  { year: '1950年代', title: '人民防空事业起步', desc: '新中国成立后，各地陆续建立防空组织体系，人民防空工作逐步展开。' },
  { year: '1996年', title: '《人民防空法》通过', desc: '第八届全国人大常委会于1996年10月29日通过《中华人民共和国人民防空法》，自1997年1月1日起施行，人民防空建设从此有了国家层面的法律保障。' },
  { year: '2001年', title: '设立"全民国防教育日"', desc: '《国防教育法》施行后，国家设立全民国防教育日，定为每年9月第三个星期六，是我国第一个以法律形式规定的国防教育主题节日。' },
  { year: '2015年', title: '江苏统一试鸣日确立', desc: '江苏省确定每年9月18日为全省防空警报统一试鸣日，呼应"九一八"历史记忆，警醒社会公众勿忘历史。' },
  { year: '2016年', title: '江苏省民防教育体验馆开馆', desc: '场馆位于南京市建邺区，2016年9月18日首次向公众开放，建在地下空间，寓意人防工程战时防护的特点。' },
  { year: '2022年', title: '体验馆升级改造', desc: '2022年7月28日完成升级改造，形成"一厅六区"布局，新增7D动感影院、核应急救援区等展项，重新对外开放。' },
];

let tlSeen = new Set(JSON.parse(sessionStorage.getItem('tl_seen') || '[]'));
let tlActive = 0;

function renderTimeline() {
  const row = document.getElementById('timelineRow');
  row.innerHTML = '';
  MILESTONES.forEach((m, i) => {
    const dot = document.createElement('button');
    dot.className = 'timeline-dot' + (i === tlActive ? ' active' : '') + (tlSeen.has(i) ? ' seen' : '');
    dot.textContent = m.year;
    dot.onclick = () => selectMilestone(i);
    row.appendChild(dot);
  });
  showDetail(tlActive);
}

function showDetail(i) {
  const m = MILESTONES[i];
  document.getElementById('timelineDetail').innerHTML = `<h3>${m.year} · ${m.title}</h3><p>${m.desc}</p>`;
}

function selectMilestone(i) {
  tlActive = i;
  tlSeen.add(i);
  sessionStorage.setItem('tl_seen', JSON.stringify([...tlSeen]));
  renderTimeline();
  if (tlSeen.size === MILESTONES.length) {
    const already = getProgress().timeline;
    markVisited('timeline');
    if (!already) showToast('🕰️ 国防建设成就时间轴 完成！');
    updateNavPill();
  }
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

selectMilestone(0);
updateNavPill();
