
// ---- STATE ----
let loginAttempts = 0;
let currentSlide = 'login';
let faceScanned = false;
let fpScanned = false;
let evidenceMode = 'unknown'; // 'evidence' ya 'no-evidence' — slide 3 pe set hoga
let sessionSeconds = 28800;

// ---- LOGIN FLOW ----
function verifyCredentials() {
  const dept = document.getElementById('dept-id').value.trim();
  const pass = document.getElementById('dept-pass').value.trim();

  if (dept === 'police1234' && pass === 'po1234') {
    document.getElementById('dot-1').classList.add('done');
    document.getElementById('dot-2').classList.add('active');
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    document.getElementById('step-2').style.animation = 'slideIn 0.4s ease';
  } else {
    loginAttempts++;
    document.getElementById('cred-error').style.display = 'block';
    const dots = ['att-1','att-2','att-3'];
    if (loginAttempts <= 3) {
      document.getElementById(dots[loginAttempts-1]).classList.add('used');
    }
    if (loginAttempts >= 3) {
      document.getElementById('cred-error').textContent = '🔒 ACCOUNT LOCKED — MAXIMUM ATTEMPTS REACHED';
      document.querySelector('#step-1 .btn-primary').disabled = true;
      document.querySelector('#step-1 .btn-primary').style.opacity = '0.4';
    }
    setTimeout(() => {
      if (loginAttempts < 3) document.getElementById('cred-error').style.display = 'none';
    }, 3000);
  }
}

function verifyOTP() {
  const otp = document.getElementById('otp-input').value.trim();
  if (otp === '009988') {
    document.getElementById('dot-2').classList.add('done');
    document.getElementById('dot-3').classList.add('active');
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
    document.getElementById('step-3').style.animation = 'slideIn 0.4s ease';
  } else {
    document.getElementById('otp-error').style.display = 'block';
    setTimeout(() => { document.getElementById('otp-error').style.display = 'none'; }, 3000);
  }
}

function enterSystem() {
  document.getElementById('slide-login').style.display = 'none';
  document.getElementById('main-nav').style.display = 'block';
  // Case A aur B dono hidden rehenge jab tak slide 3 pe decision na ho
  document.getElementById('case-a-content').style.display = 'none';
  document.getElementById('case-b-content').style.display = 'none';
  goSlide(1);
  startSessionTimer();
}

// ---- SESSION TIMER ----
function startSessionTimer() {
  setInterval(() => {
    sessionSeconds--;
    const h = Math.floor(sessionSeconds/3600).toString().padStart(2,'0');
    const m = Math.floor((sessionSeconds%3600)/60).toString().padStart(2,'0');
    const s = (sessionSeconds%60).toString().padStart(2,'0');
    document.getElementById('session-timer').innerHTML = `SESSION: <span>${h}:${m}:${s}</span>`;
  }, 1000);
}

// ---- SLIDE NAVIGATION ----
function goSlide(n) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById('slide-' + n).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));
  document.getElementById('nav-' + n).classList.add('active-nav');
  window.scrollTo(0,0);

  // Slide 4 pe: evidenceMode ke hisaab se sirf ek case dikhao
  if (n === 4) {
    if (evidenceMode === 'no-evidence') {
      switchCase('b');
    } else {
      // 'evidence' ya 'unknown' dono mein Case A dikhao (default)
      switchCase('a');
    }
  }

  // Slide 5 pe: evidenceMode ke hisaab se sirf ek report dikhao
  if (n === 5) {
    if (evidenceMode === 'no-evidence') {
      // Case B — suspect list only, no confirmed suspect, no arrest warrant
      document.getElementById('rep-a').classList.remove('active');
      document.getElementById('rep-b').classList.add('active');
      document.getElementById('rep-a-indicator').style.display = 'none';
      document.getElementById('rep-b-indicator').style.display = 'block';
    } else {
      // Case A (evidence ya unknown default) — confirmed suspect, arrest warrant allowed
      document.getElementById('rep-a').classList.add('active');
      document.getElementById('rep-b').classList.remove('active');
      document.getElementById('rep-a-indicator').style.display = 'block';
      document.getElementById('rep-b-indicator').style.display = 'none';
    }
  }
}
// ---- VERIFICATION ANIMATION (Slide 2) ----
function showVerifyAnimation() {
  const steps = [
    {id:'vs-1', delay:600},
    {id:'vs-2', delay:1400},
    {id:'vs-3', delay:2200},
    {id:'vs-4', delay:3000},
    {id:'vs-5', delay:3800},
  ];
  const prog = document.getElementById('verify-progress');
  let p = 0;
  const pInt = setInterval(() => { p = Math.min(p+2,100); prog.style.width = p + '%'; if(p>=100) clearInterval(pInt); }, 50);

  steps.forEach((s,i) => {
    setTimeout(() => {
      if(i > 0) { document.getElementById(steps[i-1].id).classList.remove('active'); document.getElementById(steps[i-1].id).classList.add('done'); document.getElementById(steps[i-1].id).querySelector('.v-step-icon').textContent = '✓'; }
      document.getElementById(s.id).classList.add('active');
      document.getElementById(s.id).querySelector('.v-step-icon').textContent = '⏳';
    }, s.delay);
  });

  setTimeout(() => {
    document.getElementById('vs-5').classList.remove('active');
    document.getElementById('vs-5').classList.add('done');
    document.getElementById('vs-5').querySelector('.v-step-icon').textContent = '✓';
    document.getElementById('verify-anim').style.display = 'none';
    document.getElementById('match-results').style.display = 'block';
    document.getElementById('match-results').style.animation = 'slideIn 0.5s ease';
  }, 4600);
}

// Trigger verify anim on load if returning to slide 2
document.getElementById('nav-2').addEventListener('click', () => {
  if (document.getElementById('match-results').style.display === 'none') {
    document.getElementById('verify-anim').style.display = 'flex';
    showVerifyAnimation();
  }
});

// ---- FACE SKETCH UPDATES ----
function updateSketch(feature, val) {
  const face = document.getElementById('sk-face');
  const eyeL = document.getElementById('sk-eye-l');
  const eyeR = document.getElementById('sk-eye-r');
  const nose = document.getElementById('sk-nose');
  const mouth = document.getElementById('sk-mouth');
  const browL = document.getElementById('sk-brow-l');
  const browR = document.getElementById('sk-brow-r');
  const hair = document.getElementById('sk-hair');

  if (feature === 'hair') {
    const paths = { short:'M40 65 Q50 28 100 22 Q150 28 160 65', long:'M30 90 Q40 15 100 10 Q160 15 170 90', bald:'', curly:'M35 75 Q35 20 100 18 Q165 20 165 75 Q150 50 130 60 Q110 40 100 50 Q90 40 70 60 Q50 50 35 75' };
    hair.setAttribute('d', paths[val] || paths.short);
  }
  if (feature === 'eye') {
    const rx = { normal:12, small:8, large:16, narrow:10 }[val] || 12;
    const ry = { normal:7, small:5, large:10, narrow:4 }[val] || 7;
    eyeL.setAttribute('rx', rx); eyeL.setAttribute('ry', ry);
    eyeR.setAttribute('rx', rx); eyeR.setAttribute('ry', ry);
  }
  if (feature === 'nose') {
    const paths = { normal:'M100 95 L93 118 Q100 122 107 118 Z', wide:'M95 95 L82 118 Q100 126 118 118 L105 95 Z', sharp:'M100 90 L97 118 Q100 120 103 118 L100 90 Z' };
    nose.setAttribute('d', paths[val] || paths.normal);
  }
  if (feature === 'mouth') {
    const paths = { normal:'M82 135 Q100 148 118 135', thin:'M85 138 Q100 143 115 138', full:'M78 133 Q100 152 122 133' };
    mouth.setAttribute('d', paths[val] || paths.normal);
  }
  if (feature === 'brow') {
    const lPaths = { normal:'M60 73 Q74 66 88 73', thick:'M60 73 Q74 63 88 73', thin:'M62 73 Q74 68 86 73', arch:'M60 78 Q74 60 88 75' };
    const rPaths = { normal:'M112 73 Q126 66 140 73', thick:'M112 73 Q126 63 140 73', thin:'M114 73 Q126 68 138 73', arch:'M112 75 Q126 60 140 78' };
    browL.setAttribute('d', lPaths[val] || lPaths.normal);
    browR.setAttribute('d', rPaths[val] || rPaths.normal);
  }
  if (feature === 'face') {
    const shapes = { oval:[65,80], round:[70,70], square:[65,65], long:[55,90] };
    const [rx,ry] = shapes[val] || [65,80];
    face.setAttribute('rx', rx); face.setAttribute('ry', ry);
  }
}

// ---- EVIDENCE SCAN ----
function runFaceScan() {
  const status = document.getElementById('face-scan-status');
  const badge = document.getElementById('face-status-badge');

  status.innerHTML = '<span style="animation:blink 0.5s infinite;color:var(--accent-cyan);">RECONSTRUCTING FACE USING AI...</span>';
  badge.textContent = 'PROCESSING'; badge.className = 'panel-badge badge-pending';

  setTimeout(() => {
    status.innerHTML = '<span style="color:var(--accent-green);">RECONSTRUCTION COMPLETE</span>';
    document.getElementById('face-scan-cont').style.display = 'none';
    document.getElementById('reconstructed-face').style.display = 'block';
    badge.textContent = 'MATCHED'; badge.className = 'panel-badge badge-active';
    document.getElementById('face-match-result').style.display = 'flex';
    faceScanned = true;
    evidenceMode = 'evidence'; // Face mil gaya — evidence available
    document.getElementById('fp-scan-btn').disabled = false;
    document.getElementById('fp-scan-btn').style.opacity = '1';
    document.getElementById('fp-scan-btn').style.cursor = 'pointer';
    updateFlowIndicator();
    showToast('✅ Face reconstruction complete — VIKRAM SINGH matched at 94.7%');
  }, 3000);
}

function faceNoData() {
  document.getElementById('face-scan-cont').style.display = 'none';
  document.getElementById('face-scan-status').innerHTML = '<span style="color:var(--text-muted);">CCTV DATA NOT AVAILABLE</span>';
  document.getElementById('face-status-badge').textContent = 'NO DATA';
  document.getElementById('face-status-badge').className = 'panel-badge';
  document.getElementById('face-status-badge').style.background = 'rgba(0,0,0,0.3)';
  document.getElementById('face-status-badge').style.color = 'var(--text-muted)';
  // FP button unlock karo — FP se bhi match ho sakta hai
  document.getElementById('fp-scan-btn').disabled = false;
  document.getElementById('fp-scan-btn').style.opacity = '1';
  document.getElementById('fp-scan-btn').style.cursor = 'pointer';
  faceScanned = false;
  // evidenceMode abhi set mat karo — FP pe decide hoga
  updateFlowIndicator();
  showToast('⚠ Face data unavailable — proceeding to fingerprint scan');
}

function runFPScan() {
  const status = document.getElementById('fp-scan-status');
  const badge = document.getElementById('fp-status-badge');
  status.innerHTML = '<span style="animation:blink 0.5s infinite;color:var(--accent-cyan);">SCANNING FINGERPRINT DATABASE...</span>';
  badge.textContent = 'SCANNING'; badge.className = 'panel-badge badge-pending';

  setTimeout(() => {
    status.innerHTML = '<span style="color:var(--accent-green);">MATCH CONFIRMED</span>';
    badge.textContent = 'MATCHED'; badge.className = 'panel-badge badge-active';
    document.getElementById('fp-match-result').style.display = 'flex';
    fpScanned = true;
    evidenceMode = 'evidence'; // FP se bhi match ho gaya — evidence available
    document.getElementById('proceed-to-invest').style.display = 'block';
    document.getElementById('flow-fp').classList.add('done');
    document.getElementById('flow-result').classList.add('active');
    showToast('✅ Fingerprint matched — VIKRAM SINGH confirmed');
  }, 3500);
}

function fpNoData() {
  document.getElementById('fp-scan-status').innerHTML = '<span style="color:var(--text-muted);">FINGERPRINT DATA NOT AVAILABLE</span>';
  document.getElementById('fp-status-badge').textContent = 'NO DATA';
  fpScanned = false;
  evidenceMode = 'no-evidence'; // Na face mila na FP — no evidence
  document.getElementById('proceed-to-invest').style.display = 'block';
  showToast('⚠ No fingerprint data — proceeding with AI suspect list (Case B)');
  setTimeout(() => { goSlide(4); }, 1500); // goSlide(4) andar auto switchCase('b') hoga
}

function proceedWithoutEvidence() {
  evidenceMode = 'no-evidence'; // Koi evidence nahi — Case B
  showToast('⚡ Skipping evidence scan — proceeding to AI suspect list (Case B)');
  setTimeout(() => { goSlide(4); }, 1500); // goSlide andar auto switchCase('b') call hoga
}

function updateFlowIndicator() {
  document.getElementById('flow-face').classList.remove('active');
  document.getElementById('flow-face').classList.add('done');
  document.getElementById('flow-fp').classList.add('active');
}

// ---- CASE A/B SWITCHING — STRICTLY CONDITION BASED, NO MANUAL TOGGLE ----
function switchCase(mode) {
  // Case A content
  document.getElementById('case-a-content').style.display = (mode === 'a') ? 'block' : 'none';
  // Case B content
  document.getElementById('case-b-content').style.display = (mode === 'b') ? 'block' : 'none';

  // Indicator bar dikhao
  document.getElementById('case-indicator').style.display = 'block';
  document.getElementById('case-a-indicator').style.display = (mode === 'a') ? 'block' : 'none';
  document.getElementById('case-b-indicator').style.display = (mode === 'b') ? 'block' : 'none';
}

// ---- TAB SWITCHING ----
function switchTab(btn, tabId) {
  const bar = btn.closest('.tab-bar');
  bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const panel = btn.closest('.panel');
  panel.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
}

function switchRepTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => { if(btn.closest('.tab-bar').contains(b)) b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll(['#rep-a','#rep-b']).forEach ? null : null;
  document.getElementById('rep-a').classList.remove('active');
  document.getElementById('rep-b').classList.remove('active');
  document.getElementById(tabId).classList.add('active');
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3500);
}

// Case B dispatch functions — no Vikram confirmed, only suspect list sent
function dispatchSuspectList() {
  showToast('📋 SUSPECT LIST REPORT FILED — FIR/2024/001247 — 3 SUSPECTS LISTED');
}
function dispatchAllStations() {
  showToast('📡 SUSPECT LIST DISPATCHED TO ALL STATIONS — FURTHER INSPECTION ORDERED');
}

// ---- ENTER KEY SUPPORT ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    if (s1 && s1.style.display !== 'none') verifyCredentials();
    else if (s2 && s2.style.display !== 'none') verifyOTP();
  }
});

// ---- MATCH RESULT BAR ANIMATION ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.match-fill').forEach(f => {
      const w = f.style.width;
      f.style.width = '0%';
      setTimeout(() => { f.style.width = w; }, 100);
    });
  }, 200);
});
