function titleFor(count) {
  const total = EXHIBITS.length;
  if (count === total) return '🏅 金牌民防体验官';
  if (count >= Math.ceil(total * 0.7)) return '🎖️ 民防体验官';
  if (count >= Math.ceil(total * 0.4)) return '🔰 民防体验见习生';
  return '🚩 民防新手参观者';
}

function todayLabel() {
  const d = new Date();
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}

function drawCertificate() {
  const canvas = document.getElementById('certCanvas');
  const dpr = window.devicePixelRatio || 1;
  const cw = 900, ch = 680;
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = '100%';
  canvas.style.aspectRatio = `${cw} / ${ch}`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const progress = getProgress();
  const count = progressCount();
  const name = (document.getElementById('nameInput').value || '').trim() || '这位参观者';

  const grad = ctx.createLinearGradient(0, 0, cw, ch);
  grad.addColorStop(0, '#0e1f36');
  grad.addColorStop(1, '#070f1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  ctx.strokeStyle = 'rgba(111,168,255,.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, cw - 40, ch - 40);
  ctx.strokeStyle = 'rgba(255,122,61,.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, cw - 60, ch - 60);

  const font = '"PingFang SC","Microsoft YaHei",sans-serif';
  ctx.textAlign = 'center';

  ctx.fillStyle = '#9fb3cc';
  ctx.font = `16px ${font}`;
  ctx.fillText('江苏省民防体验馆 · 虚拟体验证书', cw / 2, 68);

  ctx.fillStyle = '#eaf1fb';
  ctx.font = `bold 38px ${font}`;
  ctx.fillText('民 防 体 验 官 证 书', cw / 2, 118);

  ctx.font = `20px ${font}`;
  ctx.fillStyle = '#eaf1fb';
  ctx.fillText(`兹证明「${name}」完成本次虚拟民防体验馆参观`, cw / 2, 166);

  ctx.font = `bold 34px ${font}`;
  ctx.fillStyle = '#ffb28a';
  ctx.fillText(titleFor(count), cw / 2, 224);

  ctx.font = `16px ${font}`;
  ctx.fillStyle = '#6fa8ff';
  ctx.fillText(`完成度 ${count} / ${EXHIBITS.length} 个展项`, cw / 2, 256);

  ctx.textAlign = 'left';
  ctx.font = `13px ${font}`;
  const cols = [70, 340, 610];
  const rows = Math.ceil(EXHIBITS.length / 3);
  const startY = 284, lineH = 28;
  EXHIBITS.forEach((ex, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const x = cols[col];
    const y = startY + row * lineH;
    const done = !!progress[ex.id];
    ctx.fillStyle = done ? '#3ddc97' : '#5b6b82';
    ctx.fillText(`${done ? '✓' : '✗'} ${ex.icon} ${ex.name}`, x, y);
  });

  ctx.textAlign = 'center';
  ctx.font = `15px ${font}`;
  ctx.fillStyle = '#9fb3cc';
  ctx.fillText(`参观日期：${todayLabel()}`, cw / 2, 600);

  ctx.font = `12px ${font}`;
  ctx.fillStyle = '#5b6b82';
  ctx.fillText('素材来源：本次参观现场核实的人民防空法规 / 医学急救常识整理', cw / 2, 635);
}

function downloadCert() {
  const canvas = document.getElementById('certCanvas');
  const link = document.createElement('a');
  link.download = '民防体验官证书.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function renderRemaining() {
  const progress = getProgress();
  const missing = EXHIBITS.filter((ex) => !progress[ex.id]);
  const box = document.getElementById('remainingBox');
  const links = {
    wall: 'exhibits/wall.html', timeline: 'exhibits/timeline.html', siren: 'exhibits/siren.html',
    evacuate: 'exhibits/evacuate.html', fire: 'exhibits/fire.html', earthquake: 'exhibits/earthquake.html',
    triangle: 'exhibits/triangle.html', cpr: 'exhibits/cpr.html', sequence: 'exhibits/sequence.html',
    firstaid: 'exhibits/firstaid.html', iodine: 'exhibits/iodine.html', radiation: 'exhibits/radiation.html',
    equipment: 'exhibits/equipment.html', home: 'exhibits/home.html', backpack: 'exhibits/backpack.html',
  };
  if (missing.length === 0) {
    box.innerHTML = '<p style="text-align:center;color:var(--success);">全部展项都已完成，恭喜！</p>';
    return;
  }
  box.innerHTML = `<p style="text-align:center;color:var(--text-dim);margin-bottom:14px;">还有 ${missing.length} 个展项没体验，去解锁更高称号：</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
      ${missing.map((ex) => `<a class="btn" href="${links[ex.id]}">${ex.icon} ${ex.name}</a>`).join('')}
    </div>`;
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

document.getElementById('nameInput').addEventListener('input', drawCertificate);
window.addEventListener('resize', drawCertificate);

drawCertificate();
renderRemaining();
updateNavPill();
