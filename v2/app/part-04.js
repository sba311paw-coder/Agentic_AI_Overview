/* ---------- DAILY CHECKLIST ---------- */
const CHECKLIST_ITEMS = [
  ['learn','Learn'], ['watch','Watch'], ['read','Read'], ['code','Code'],
  ['practice','Practice'], ['debug','Debug'], ['review','Review'], ['journal','Journal']
];
function renderChecklist() {
  const c = document.getElementById('content');
  const today = todayStr();
  if (!STATE.dailyChecklist[today]) STATE.dailyChecklist[today] = {};
  const rec = STATE.dailyChecklist[today];
  c.appendChild(el(`
    <h1>Daily Checklist &amp; Journal</h1>
    <p class="mini-note">Today: ${today} &middot; Week ${STATE.currentWeek} &mdash; ${weekById(STATE.currentWeek).title}</p>
    <div class="card">
      <h3>Today's Beats</h3>
      ${CHECKLIST_ITEMS.map(([k,label]) => `<label class="checklist-item"><input type="checkbox" data-k="${k}" ${rec[k]?'checked':''}> ${label}</label>`).join('')}
      <div class="progressbar"><div class="progressbar-fill" id="dcBar" style="width:0%"></div></div>
    </div>
    <div class="card">
      <h3>Daily Knowledge Journal</h3>
      <p class="mini-note">What did I learn? What did I build? What broke, and why? How did I fix it? What did AI help with (and at what Level, Part 13)? What do I still not understand?</p>
      <textarea id="journalText" rows="6" placeholder="Write your journal entry...">${escapeHTML(rec.journal || '')}</textarea>
      <button class="btn primary small" id="journalSave" style="margin-top:8px;">Save Journal Entry</button>
    </div>
    <div class="card">
      <h3>Recent History</h3>
      <div id="historyList"></div>
    </div>
  `));
  function updateBar() {
    const done = CHECKLIST_ITEMS.filter(([k])=>k!=='journal').filter(([k])=>rec[k]).length;
    document.getElementById('dcBar').style.width = Math.round(done/7*100)+'%';
  }
  document.querySelectorAll('[data-k]').forEach(cb => {
    cb.onchange = () => { rec[cb.dataset.k] = cb.checked; save(); updateBar(); renderHistory(); };
  });
  document.getElementById('journalSave').onclick = () => {
    rec.journal = document.getElementById('journalText').value; save();
    document.getElementById('journalSave').textContent = 'Saved ✓';
    setTimeout(()=>{ document.getElementById('journalSave').textContent = 'Save Journal Entry'; }, 1200);
  };
  function renderHistory() {
    const dates = Object.keys(STATE.dailyChecklist).sort().reverse().slice(0,14);
    document.getElementById('historyList').innerHTML = dates.map(d => {
      const r = STATE.dailyChecklist[d];
      const done = CHECKLIST_ITEMS.filter(([k])=>k!=='journal').filter(([k])=>r[k]).length;
      return `<div class="checklist-item"><b>${escapeHTML(d)}</b> &mdash; ${done}/7 beats ${r.journal ? '&middot; journal &#9998;' : ''}</div>`;
    }).join('') || '<p class="mini-note">No history yet.</p>';
  }
  updateBar(); renderHistory();
}

/* ---------- PROJECTS ---------- */
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function validateProgress(value) {
  const fail=()=>{throw new Error('This backup has invalid progress fields.');};
  if(!value||typeof value!=='object'||Array.isArray(value))fail();
  function walk(v,depth=0){
    if(depth>8)fail();
    if(typeof v==='string'&&v.length>100000)fail();
    if(typeof v==='number'&&!Number.isFinite(v))fail();
    if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){
      if(['__proto__','constructor','prototype'].includes(k))fail();walk(x,depth+1);
    }
  }
  walk(value);
  const defaults=defaultState();
  const allowed=new Set([...Object.keys(defaults),'projectEvidence','themeVersion']);
  if(Object.keys(value).some(k=>!allowed.has(k)))fail();
  if(value.theme!==undefined&&!['light','dark'].includes(value.theme))fail();
  if(value.currentWeek!==undefined&&(!Number.isInteger(value.currentWeek)||value.currentWeek<1||value.currentWeek>16))fail();
  for(const key of ['weekStatus','dailyChecklist','flashcards','projectStatus','capstoneChecked','careerChecked','lifelong','lessonsRead','projectEvidence']){
    if(value[key]!==undefined&&(!value[key]||typeof value[key]!=='object'||Array.isArray(value[key])))fail();
  }
  if(value.aiLog!==undefined&&(!Array.isArray(value.aiLog)||value.aiLog.length>5000))fail();
  for(const e of value.aiLog||[]){
    if(!e||typeof e.task!=='string'||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!Number.isInteger(e.week)||e.week<1||e.week>16||!Number.isInteger(e.level)||e.level<0||e.level>6||typeof e.verified!=='boolean')fail();
  }
  if(value.radarReviewed!==undefined&&(!Array.isArray(value.radarReviewed)||value.radarReviewed.some(x=>typeof x!=='string'||!/^\d{4}-\d{2}$/.test(x))))fail();
  const statuses=['not-started','in-progress','completed','rebuilt','explained'];
  const validWeek=k=>/^([1-9]|1[0-6])$/.test(k);
  for(const [k,v] of Object.entries(value.projectStatus||{}))if(!validWeek(k)||!statuses.includes(v))fail();
  for(const [k,v] of Object.entries(value.weekStatus||{})){
    if(!validWeek(k)||!v||typeof v!=='object'||Array.isArray(v))fail();
    if(v.masteryDone!==undefined&&typeof v.masteryDone!=='boolean')fail();
    if(v.projectStatus!==undefined&&!statuses.includes(v.projectStatus))fail();
    for(const n of ['quizBest','quizTotal'])if(v[n]!==undefined&&(!Number.isFinite(v[n])||v[n]<0))fail();
  }
  for(const [k,v] of Object.entries(value.projectEvidence||{})){
    if(!validWeek(k)||!v||typeof v!=='object'||Array.isArray(v))fail();
    for(const f of ['built','tested','rebuilt','explained'])if(v[f]!==undefined&&typeof v[f]!=='boolean')fail();
    for(const f of ['link','notes'])if(v[f]!==undefined&&typeof v[f]!=='string')fail();
  }
  for(const [k,v] of Object.entries(value.dailyChecklist||{})){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||!v||typeof v!=='object'||Array.isArray(v))fail();
    for(const [field,data]of Object.entries(v))if(field==='journal'?!['string','boolean'].includes(typeof data):typeof data!=='boolean')fail();
  }
  for(const [k,v]of Object.entries(value.flashcards||{}))if(!v||typeof v!=='object'||!Number.isInteger(v.box)||v.box<0||v.box>3)fail();
  for(const key of ['capstoneChecked','careerChecked','lessonsRead'])for(const v of Object.values(value[key]||{}))if(typeof v!=='boolean')fail();
  for(const v of Object.values(value.lifelong||{}))if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))fail();
  return {...defaults,...value,projectEvidence:value.projectEvidence||{}};
}
function normalizeEvidence(state) {
  state.projectEvidence ||= {};
  for(const p of DATA.projects){
    const old=state.projectStatus[p.week];
    state.projectEvidence[p.week]={built:['completed','rebuilt','explained'].includes(old),tested:false,rebuilt:old==='rebuilt',explained:old==='explained',link:'',notes:'',...state.projectEvidence[p.week]};
  }
  return state;
}
function safeEvidenceURL(value) {
  try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch(e){return '';}
}
function downloadBackup(raw=false) {
  let data;
  try{data=raw?localStorage.getItem(STORE_KEY):JSON.stringify({format:'ai-academy-progress',version:1,exportedAt:new Date().toISOString(),state:STATE},null,2);}
  catch(e){showNotice('The original saved data is unavailable; export the current session instead.');return;}
  if(!data){showNotice('No original saved data was found.');return;}
  const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`ai-academy-${raw?'original-':'progress-'}${todayStr()}.json`;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderProjects() {
  normalizeEvidence(STATE);
  const c=document.getElementById('content');
  c.appendChild(el(`
    <div class="project-intro">
      <h1>Your project ladder</h1>
      <p>Build something small. Understand why it works. Extend it with evidence.</p>
      <p class="mini-note">Your original 16 project ideas are preserved as learning steps within eight canonical milestones. Lesson numbers are references, not deadlines. Progress below is self-reported and stays in this browser, separately from the original dashboard.</p>
      <div class="canonical-links"><a href="v2/project-guide.html#mapping" target="_blank" rel="noopener">Project mapping</a><a href="v2/project-guide.html#evidence" target="_blank" rel="noopener">Evidence guide</a></div>
    </div>
    <div class="project-tools">
      <input id="projectSearch" type="search" placeholder="Find a project, skill or milestone" aria-label="Search project briefs">
      <label><input id="showOptional" type="checkbox" checked> Include optional extensions</label>
    </div>
    <p class="mini-note" id="projectCount" role="status"></p>
    <div id="projList"></div>
    <section class="backup-tools" aria-labelledby="backupTitle">
      <h2 id="backupTitle">Keep your progress</h2>
      <p>Export a JSON backup to move between browsers or devices. Import previews the file before replacing progress. There is no automatic GitHub or JARVIS synchronization.</p>
      <button class="btn" id="exportProgress">Export progress</button>
      <button class="btn" id="importProgress">Choose backup to import</button>
      <button class="btn" id="exportOriginal" ${storageBlocked?'':'hidden'}>Export original data for recovery</button>
      <input id="backupFile" type="file" accept=".json,application/json" hidden>
      <div id="importPreview" hidden><p id="importDescription"></p><button class="btn primary" id="applyImport">Replace progress with this backup</button> <button class="btn" id="cancelImport">Cancel import</button></div>
      <p id="backupStatus" role="status" aria-live="polite"></p>
    </section>
  `));
  const box=document.getElementById('projList');
  function draw(){
    box.replaceChildren();
    const query=document.getElementById('projectSearch').value.toLowerCase();
    const optional=document.getElementById('showOptional').checked;
    const projects=DATA.projects.filter(p=>(optional||!p.optional)&&`${p.name} ${p.skill} ${p.canonical} ${p.goal}`.toLowerCase().includes(query));
    document.getElementById('projectCount').textContent=`${projects.length} of ${DATA.projects.length} learning steps shown`;
    if(!projects.length){box.appendChild(el('<p>No projects match. Try a skill or clear the search.</p>'));return;}
    for(const p of projects){
      const e=STATE.projectEvidence[p.week];
      const row=el(`<details class="project-brief" id="project-${p.week}">
        <summary><span class="project-number">${String(p.week).padStart(2,'0')}</span><span><span class="project-title">${escapeHTML(p.name)}</span><span class="project-meta">${p.canonical} · ${escapeHTML(p.skill)}${p.optional?' · Optional after C08':''}</span></span></summary>
        <div class="project-body">
          <h3>Goal</h3><p>${escapeHTML(p.goal)}</p>
          <p class="mini-note"><b>Prerequisites:</b> ${escapeHTML(p.prerequisites)}</p>
          <h3>Approach</h3><ol>${p.approach.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ol>
          <h3>Deliverables</h3><ul>${p.deliverables.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>
          <h3>Acceptance check</h3><p>${escapeHTML(p.acceptance)}</p>
          <p class="mini-note">Use the evidence guide alongside your assessor’s canonical requirements. These personal checkmarks do not certify mastery or production readiness.</p>
          <div class="project-evidence">${['built','tested','rebuilt','explained'].map(k=>`<label><input type="checkbox" data-evidence="${k}" ${e[k]?'checked':''}> ${({built:'Built',tested:'Tested',rebuilt:'Rebuilt independently',explained:'Explained independently'})[k]}</label>`).join('')}</div>
          <div class="evidence-fields">
            <label class="wide">Evidence link (HTTPS)<input type="url" data-field="link" placeholder="Link to a commit, tests or assessment" value="${escapeHTML(e.link)}"></label>
            <label class="wide">Debugging notes and next action<textarea data-field="notes" rows="3" placeholder="What broke? What did you verify? What comes next?">${escapeHTML(e.notes)}</textarea></label>
          </div>
          <p class="mini-note" data-save role="status"></p>
          <p><a data-evidence-link hidden target="_blank" rel="noopener noreferrer">Open saved evidence</a></p>
          <button class="btn" data-lesson>Open lesson unit ${p.week}</button>
        </div>
      </details>`);
      function updateEvidenceLink(){const href=safeEvidenceURL(e.link);const a=row.querySelector('[data-evidence-link]');a.hidden=!href;if(href)a.href=href;else a.removeAttribute('href');}
      function record(){row.querySelector('[data-save]').textContent=save()?'Saved in this browser.':'Not saved persistently; export before closing.';updateEvidenceLink();}
      row.querySelectorAll('[data-evidence]').forEach(cb=>cb.onchange=()=>{
        e[cb.dataset.evidence]=cb.checked;
        STATE.projectStatus[p.week]=e.built?'completed':(Object.values(e).some(x=>x===true)?'in-progress':'not-started');
        weekStatus(p.week).projectStatus=STATE.projectStatus[p.week];record();
      });
      row.querySelectorAll('[data-field]').forEach(input=>input.oninput=()=>{e[input.dataset.field]=input.value;record();});
      row.querySelector('[data-lesson]').onclick=()=>nav('weeks',()=>selectWeek(p.week));
      updateEvidenceLink();box.appendChild(row);
    }
  }
  document.getElementById('projectSearch').oninput=draw;
  document.getElementById('showOptional').onchange=draw;
  document.getElementById('exportProgress').onclick=()=>downloadBackup();
  document.getElementById('exportOriginal').onclick=()=>downloadBackup(true);
  document.getElementById('importProgress').onclick=()=>document.getElementById('backupFile').click();
  let pending=null;
  document.getElementById('backupFile').onchange=async event=>{
    pending=null;document.getElementById('importPreview').hidden=true;
    const file=event.target.files[0];if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error('Backup is too large. Choose a JSON file smaller than 2 MB.');
      const parsed=JSON.parse(await file.text());
      if(parsed.format&& (parsed.format!=='ai-academy-progress'||parsed.version!==1))throw new Error('This is not a supported Academy backup.');
      pending=normalizeEvidence(validateProgress(parsed.format?parsed.state:parsed));
      document.getElementById('importDescription').textContent=`Ready to import ${Object.values(pending.projectEvidence).filter(e=>e.built).length} built projects and ${pending.aiLog.length} task logs. This replaces current progress; a pre-import snapshot will be saved locally.`;
      document.getElementById('importPreview').hidden=false;document.getElementById('backupStatus').textContent='File validated; nothing has been replaced.';
    }catch(e){document.getElementById('backupStatus').textContent=e instanceof SyntaxError?'This file is not valid JSON. Choose an exported progress backup.':e.message;}
    event.target.value='';
  };
  document.getElementById('cancelImport').onclick=()=>{pending=null;document.getElementById('importPreview').hidden=true;document.getElementById('backupStatus').textContent='Import cancelled; current progress retained.';};
  document.getElementById('applyImport').onclick=()=>{
    if(!pending)return;
    try{
      localStorage.setItem(STORE_KEY+'_before_import',localStorage.getItem(STORE_KEY)||JSON.stringify(STATE));
      pending.themeVersion=21;
      localStorage.setItem(STORE_KEY,JSON.stringify(pending));
      STATE=pending;pending=null;storageBlocked=false;storageMessage='';showNotice('');applyTheme();document.getElementById('themeSelect').value=STATE.theme;
      document.getElementById('importPreview').hidden=true;document.getElementById('exportOriginal').hidden=true;document.getElementById('backupStatus').textContent='Progress imported and saved in this browser.';draw();
    }catch(e){document.getElementById('backupStatus').textContent='Import could not be saved. Current progress is unchanged; check browser storage and try again.';}
  };
  draw();
}


/* ---------- AI DEPENDENCY TRACKER ---------- */
const AI_LEVELS = ['0 - No AI','1 - Hint','2 - Explanation','3 - Review','4 - Debugging','5 - Collaborative Building','6 - AI-Assisted Architecture'];
function renderAITracker() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>AI Dependency Tracker</h1>
    <p>Log every AI-assisted task with the level used (Part 13) and whether you verified the output (Part 14: Delegation &rarr; Verification Loop).</p>
    <div class="card">
      <h3>Log a Task</h3>
      <div class="searchbar">
        <select id="aiWeek"></select>
        <input type="text" id="aiTask" placeholder="What task?">
        <select id="aiLevel"></select>
      </div>
      <label class="checklist-item"><input type="checkbox" id="aiVerified"> I verified the output myself (tested/read/checked)</label>
      <button class="btn primary small" id="aiLogBtn" style="margin-top:8px;">Log Entry</button>
    </div>
    <div class="grid grid-3" id="aiStats"></div>
    <div class="card"><h3>Log</h3><div id="aiLogList"></div></div>
  `));
  document.getElementById('aiWeek').innerHTML = DATA.weeks.map(w=>`<option value="${w.week}">Week ${w.week}</option>`).join('');
  document.getElementById('aiWeek').value = STATE.currentWeek;
  document.getElementById('aiLevel').innerHTML = AI_LEVELS.map((l,i)=>`<option value="${i}">${l}</option>`).join('');
  document.getElementById('aiLogBtn').onclick = () => {
    const task = document.getElementById('aiTask').value.trim();
    if (!task) return;
    STATE.aiLog.unshift({
      date: todayStr(), week: parseInt(document.getElementById('aiWeek').value),
      task, level: parseInt(document.getElementById('aiLevel').value),
      verified: document.getElementById('aiVerified').checked,
    });
    save();
    document.getElementById('aiTask').value = '';
    drawAIStatsAndLog();
  };
  drawAIStatsAndLog();
}
function drawAIStatsAndLog() {
  const total = STATE.aiLog.length;
  const verified = STATE.aiLog.filter(e=>e.verified).length;
  const level0 = STATE.aiLog.filter(e=>e.level===0).length;
  document.getElementById('aiStats').innerHTML = `
    <div class="card stat"><div class="num">${total}</div><div class="label">Logged Tasks</div></div>
    <div class="card stat"><div class="num">${total?Math.round(verified/total*100):0}%</div><div class="label">Verified</div></div>
    <div class="card stat"><div class="num">${level0}</div><div class="label">No-AI (Level 0) Tasks</div></div>
  `;
  document.getElementById('aiLogList').innerHTML = STATE.aiLog.slice(0,40).map(e => `
    <div class="checklist-item"><b>${escapeHTML(e.date)}</b> &middot; Week ${e.week} &middot; ${escapeHTML(e.task)} &middot; <span class="tag">${AI_LEVELS[e.level]}</span> ${e.verified?'&#9989;':'&#9888;&#65039; unverified'}</div>
  `).join('') || '<p class="mini-note">No entries yet.</p>';
}

/* ---------- TECH RADAR ---------- */
function renderRadar() {
  const c = document.getElementById('content');
  const reviewedThisMonth = STATE.radarReviewed.includes(monthStr());
  c.appendChild(el(`
    <h1>AI Technology Radar</h1>
    <p>This radar is a study snapshot, not a live ranking. Review primary sources monthly as the landscape shifts &mdash; frameworks move rings faster than fundamentals do.</p>
    <div class="card">
      <button class="btn ${reviewedThisMonth?'':'primary'}" id="radarReviewBtn">${reviewedThisMonth ? '✓ Reviewed this month ('+monthStr()+')' : 'Mark reviewed for '+monthStr()}</button>
    </div>
    <div id="radarBox"></div>
  `));
  const box = document.getElementById('radarBox');
  const colors = {Foundational:'#00B894', Current:'#0984E3', Emerging:'#E17055', Experimental:'#D63031'};
  DATA.techRadar.forEach(r => {
    box.appendChild(el(`
      <div class="card radar-ring">
        <h4><span class="badge-dot" style="background:${colors[r.ring]}"></span>${r.ring}</h4>
        <div class="radar-items">${r.items.map(i=>`<span class="radar-item">${i}</span>`).join('')}</div>
      </div>`));
  });
  document.getElementById('radarReviewBtn').onclick = () => {
    if (!STATE.radarReviewed.includes(monthStr())) STATE.radarReviewed.push(monthStr());
    save(); renderRadar();
  };
}

/* ---------- CAPSTONE ---------- */
function renderCapstone() {
  const c = document.getElementById('content');
  const doneCount = DATA.capstoneChecklist.filter((_,i)=>STATE.capstoneChecked[i]).length;
  c.appendChild(el(`
    <h1>Capstone Dashboard</h1>
    <p>Week 16: <b>Production-Grade Agentic AI Platform</b>. Original problem, no pre-built tutorial. Follow <a href="v2/project-guide.html#mapping" target="_blank" rel="noopener">canonical P08 requirements</a>. Docker, public cloud and multi-agent components are conditional. Rollback, security and operational evidence remain required.</p>
    <div class="progressbar"><div class="progressbar-fill" style="width:${Math.round(doneCount/DATA.capstoneChecklist.length*100)}%"></div></div>
    <div class="card">
      <h3>Deliverables Checklist (${doneCount}/${DATA.capstoneChecklist.length})</h3>
      ${DATA.capstoneChecklist.map((item,i)=>`<label class="checklist-item"><input type="checkbox" data-i="${i}" ${STATE.capstoneChecked[i]?'checked':''}> ${item}</label>`).join('')}
    </div>
    <div class="card">
      <h3>GitHub Portfolio Structure</h3>
      <p class="mini-note">Example implementation organization; one evolving project is sufficient</p>
      <ul>${DATA.githubPortfolio.map(f=>`<li><code>${f}/</code></li>`).join('')}</ul>
      <p class="mini-note">Each folder needs: README, architecture notes, screenshots, demo, install instructions, tests, lessons learned, limitations, future improvements.</p>
    </div>
  `));
  document.querySelectorAll('#content [data-i]').forEach(cb => {
    cb.onchange = () => { STATE.capstoneChecked[cb.dataset.i] = cb.checked; save(); renderCapstone(); };
  });
}

