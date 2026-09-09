let audioCtx = null;
let analyser = null;
let scheduledOscs = [];
let rafId = null;
const played = new Set(JSON.parse(sessionStorage.getItem('siren_played') || '[]'));

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function stopAll() {
  scheduledOscs.forEach((o) => { try { o.stop(); } catch (e) {} });
  scheduledOscs = [];
  if (rafId) cancelAnimationFrame(rafId);
}

function scheduleBeep(startTime, duration, freqFrom, freqTo, opts = {}) {
  const osc = audioCtx.createOscillator();
  osc.type = opts.type || 'sine';
  osc.frequency.setValueAtTime(freqFrom, startTime);
  if (freqTo && freqTo !== freqFrom) {
    osc.frequency.linearRampToValueAtTime(freqTo, startTime + duration);
  }

  if (opts.vibrato) {
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = opts.vibratoRate || 4.5;
    lfoGain.gain.value = opts.vibratoDepth || 18;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(startTime);
    lfo.stop(startTime + duration + 0.02);
    scheduledOscs.push(lfo);
  }

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.22, startTime + 0.04);
  gain.gain.setValueAtTime(0.22, Math.max(startTime + 0.04, startTime + duration - 0.04));
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(gain).connect(analyser);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
  scheduledOscs.push(osc);
}

function drawLoop() {
  const canvas = document.getElementById('waveform');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = canvas.clientWidth * dpr);
  const h = (canvas.height = canvas.clientHeight * dpr);
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 2 * dpr;
  ctx.strokeStyle = '#6fa8ff';
  ctx.beginPath();
  const slice = w / data.length;
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128.0;
    const y = (v * h) / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += slice;
  }
  ctx.stroke();
  rafId = requestAnimationFrame(drawLoop);
}

function setActiveButton(type) {
  ['btnPre', 'btnRaid', 'btnClear'].forEach((id) => document.getElementById(id).classList.remove('primary', 'accent'));
  if (type === 'pre') document.getElementById('btnPre').classList.add('primary');
  if (type === 'raid') document.getElementById('btnRaid').classList.add('accent');
  if (type === 'clear') document.getElementById('btnClear').classList.add('primary');
}

function markButtonPlayed(type) {
  const map = { pre: 'btnPre', raid: 'btnRaid', clear: 'btnClear' };
  const btn = document.getElementById(map[type]);
  if (!btn.textContent.includes('✓')) btn.textContent += ' ✓';
}

function playPattern(type) {
  ensureAudio();
  stopAll();
  setActiveButton(type);
  const t0 = audioCtx.currentTime + 0.05;
  let total = 0;

  if (type === 'pre') {
    for (let i = 0; i < 3; i++) {
      scheduleBeep(t0 + i * 1.8, 1.2, 500, 850, { type: 'sine', vibrato: true, vibratoRate: 4.5, vibratoDepth: 20 });
    }
    total = 3 * 1.8;
  } else if (type === 'raid') {
    for (let i = 0; i < 8; i++) scheduleBeep(t0 + i * 0.7, 0.35, 920, null, { type: 'sawtooth' });
    total = 8 * 0.7;
  } else if (type === 'clear') {
    scheduleBeep(t0, 3, 600, null, { type: 'sine' });
    total = 3;
  }

  drawLoop();
  setTimeout(() => { if (rafId) cancelAnimationFrame(rafId); }, total * 1000 + 300);

  if (!played.has(type)) {
    played.add(type);
    sessionStorage.setItem('siren_played', JSON.stringify([...played]));
    markButtonPlayed(type);
    checkDone();
  }
}

function checkDone() {
  if (played.size === 3) {
    const already = getProgress().siren;
    markVisited('siren');
    document.getElementById('doneBanner').classList.add('show');
    if (!already) showToast('📢 防空警报试听台 完成！三种信号都听过了');
    updateNavPill();
  }
}

function updateNavPill() {
  const pill = document.getElementById('progressPill');
  if (pill) pill.textContent = `${progressCount()} / ${EXHIBITS.length} 已体验`;
}

played.forEach(markButtonPlayed);
if (played.size === 3) document.getElementById('doneBanner').classList.add('show');
updateNavPill();
