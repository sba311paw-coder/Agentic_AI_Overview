
/* AI -> Agentic AI Master Academy — dashboard logic */
const DATA = window.ACADEMY_DATA;
const STORE_KEY = 'aiAcademy_v2';

function defaultState() {
  return {
    theme: 'light',
    themeVersion:21,
    projectEvidence:{},
    currentWeek: 1,
    weekStatus: {},         // { "1": { projectStatus:'not-started', quizBest:0, quizTotal:5, masteryDone:false, objectivesChecked:[] } }
    dailyChecklist: {},     // { "2026-08-14": {learn:false,...,journal:""} }
    flashcards: {},         // { cardId: {box:0-3, seen:0} }
    aiLog: [],              // [{date, week, task, level, verified}]
    projectStatus: {},      // { "1": "completed" }
    capstoneChecked: {},    // { "0": true }
    careerChecked: {},      // { "Python-0": true }
    radarReviewed: [],      // ["2026-08"]
    lifelong: {},           // { daily: "2026-08-14", weekly: "...", monthly:"...", quarterly:"...", yearly:"..." }
    lessonsRead: {},        // { "3-2": true }  (week-day -> read)
  };
}
let storageBlocked = false;
let storageMessage = '';
function loadState() {
  let raw;
  try {
    raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const state = validateProgress(parsed);
    if (parsed.themeVersion !== 21) {
      if (!localStorage.getItem(STORE_KEY+'_before_v21')) localStorage.setItem(STORE_KEY+'_before_v21',raw);
      state.theme='light'; state.themeVersion=21;
    }
    return state;
  } catch(e) {
    storageBlocked=true;
    storageMessage='Saved progress could not be read safely. The original is preserved. Export it for recovery; new changes stay in this tab until you import a valid backup.';
    return defaultState();
  }
}
let STATE;
function showNotice(text) {
  const node=document.getElementById('saveNotice');
  if(node){node.hidden=!text;node.textContent=text;}
}
function save() {
  if(storageBlocked){showNotice(storageMessage);return false;}
  try {localStorage.setItem(STORE_KEY,JSON.stringify(STATE));return true;}
  catch(e){showNotice('Your browser could not save progress. Changes remain in this tab; export a backup before closing.');return false;}
}

function todayStr() { const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; }
function monthStr() { return todayStr().slice(0,7); }

/* ---------- THEME ---------- */
const THEMES = [
  { id:'light', label:'Light' },
  { id:'dark', label:'Soft dark' },
];
const DARK_THEMES = ['dark'];
function applyTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
}
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  showNotice(storageMessage);
  const themeSel = document.getElementById('themeSelect');
  themeSel.innerHTML = THEMES.map(t=>`<option value="${t.id}">${t.label}</option>`).join('');
  themeSel.value = STATE.theme;
  themeSel.addEventListener('change', () => {
    STATE.theme = themeSel.value;
    save(); applyTheme();
  });
  document.getElementById('mobileNavToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('skipLink').onclick=e=>{e.preventDefault();document.getElementById('main').focus();};
  buildNav();
  route(location.hash.replace('#','') || 'home');
  window.addEventListener('hashchange', () => route(location.hash.replace('#','') || 'home'));
});

/* ---------- NAV ---------- */
const TABS = [
  {id:'home', icon:'&#127968;', label:'Home'},
  {id:'roadmap', icon:'&#128506;', label:'Learning Roadmap'},
  {id:'weeks', icon:'&#128218;', label:'Week Dashboard'},
  {id:'resources', icon:'&#128218;', label:'Resource Library'},
  {id:'mindmaps', icon:'&#129504;', label:'Mind Map Library'},
  {id:'quizzes', icon:'&#10067;', label:'Quiz Engine'},
  {id:'flashcards', icon:'&#127183;', label:'Flashcard Engine'},
  {id:'checklist', icon:'&#9989;', label:'Daily Checklist'},
  {id:'projects', icon:'&#128736;', label:'Project Tracker'},
  {id:'aitracker', icon:'&#129302;', label:'AI Dependency Tracker'},
  {id:'radar', icon:'&#128225;', label:'Technology Radar'},
  {id:'capstone', icon:'&#127942;', label:'Capstone Dashboard'},
  {id:'career', icon:'&#128188;', label:'Career Dashboard'},
  {id:'lifelong', icon:'&#8734;', label:'Lifelong Learning'},
];
function navIcon(id) {
  const paths={
    home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    roadmap:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
    weeks:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3"/>',
    resources:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1zM12 5v15"/>',
    mindmaps:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v5M5 16v-4h14v4"/>',
    quizzes:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/>',
    flashcards:'<rect x="7" y="5" width="14" height="16" rx="2"/><path d="M3 17V3h14M11 10h6M11 14h4"/>',
    checklist:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 2 2 5-5M8 16h8"/>',
    projects:'<path d="m4 8 4-4 4 4M8 4v16M13 16l4 4 4-4M17 20V4"/>',
    aitracker:'<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8M1 11v5M23 11v5"/>',
    radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 20 4"/>',
    capstone:'<path d="M7 3h10v7a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4M12 15v6M8 21h8"/>',
    career:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 13h18M10 13v3h4v-3"/>',
    lifelong:'<path d="M12 12c-4-8-11-4-9 1 2 6 7 2 9-1 4-8 11-4 9 1-2 6-7 2-9-1z"/>'
  };
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||paths.resources}</svg>`;
}

function buildNav() {
  const ul = document.getElementById('navlist');
  ul.innerHTML = TABS.map(t => `<li><a data-tab="${t.id}" href="#${t.id}"><span class="navicon">${navIcon(t.id)}</span>${t.label}</a></li>`).join('');
}
function setActiveNav(tab) {
  document.querySelectorAll('.navlist a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
  document.getElementById('sidebar').classList.remove('open');
}
function route(tab) {
  if (!TABS.find(t => t.id === tab)) tab = 'home';
  setActiveNav(tab);
  const renderers = {
    home: renderHome, roadmap: renderRoadmap, weeks: renderWeeks, resources: renderResources,
    mindmaps: renderMindmaps, quizzes: renderQuizzes, flashcards: renderFlashcards,
    checklist: renderChecklist, projects: renderProjects, aitracker: renderAITracker,
    radar: renderRadar, capstone: renderCapstone, career: renderCareer, lifelong: renderLifelong,
  };
  document.getElementById('content').innerHTML = '';
  renderers[tab]();
  window.scrollTo(0,0);
}
function nav(tab, extra) { location.hash = tab; if (extra) setTimeout(extra, 30); }

/* ---------- HELPERS ---------- */
function el(html) {
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  // If the markup has exactly one root element, unwrap it (preserves old single-root behavior).
  // Otherwise return the wrapper div holding all the sibling nodes, so nothing gets silently dropped.
  if (d.childNodes.length === 1 && d.firstElementChild) return d.firstElementChild;
  return d;
}
function resourceById(id) { return DATA.resources.find(r => r.id === id); }
function weekById(n) { return DATA.weeks.find(w => w.week === n); }
function phaseOf(weekNum) { return DATA.phases.find(p => p.weeks.includes(weekNum)); }

function computeOverallProgress() {
  let done = 0;
  DATA.weeks.forEach(w => {
    const ws = STATE.weekStatus[w.week];
    if (ws && ws.masteryDone) done++;
  });
  return Math.round(done / DATA.weeks.length * 100);
}
function weekStatus(n) {
  if (!STATE.weekStatus[n]) STATE.weekStatus[n] = { projectStatus:'not-started', quizBest:0, quizTotal:0, masteryDone:false };
  return STATE.weekStatus[n];
}
function lessonsForWeek(n) {
  return (DATA.lessons && DATA.lessons[n]) || [];
}
function lessonReadCount(n) {
  const days = lessonsForWeek(n);
  if (!days.length) return {read:0, total:0};
  let read = 0;
  days.forEach(d => { if (STATE.lessonsRead[`${n}-${d.day}`]) read++; });
  return {read, total: days.length};
}

function renderMermaidIn(container) {
  container.querySelectorAll('.mermaid').forEach(pre=>{
    const code=pre.textContent;const lines=code.trim().split('\n');const nodes=[],edges=[];
    const add=(id,label,depth=0)=>{let n=nodes.find(n=>n.id===id);if(!n){n={id,label,depth};nodes.push(n);}else if(label!==id)n.label=label;return n;};
    if(lines[0].trim()==='mindmap'){
      const stack=[];lines.slice(1).forEach((line,i)=>{if(!line.trim())return;const depth=Math.max(0,Math.floor((line.length-line.trimStart().length)/2)-1);const label=line.trim().replace(/^root\(\((.*)\)\)$/,'$1');add(String(i),label,depth);if(depth>0&&stack[depth-1]!==undefined)edges.push([stack[depth-1],String(i),'contains']);stack[depth]=String(i);});
    }else{
      lines.slice(1).forEach(line=>{const t=line.trim();if(!t||t==='end'||t.startsWith('subgraph'))return;
        const parts=t.split(/\s*(?:<-->|-->|-\.[^-]*?\.->)\s*/);const parse=text=>{text=text.replace(/^\|[^|]*\|\s*/,'');const m=text.match(/^([\w]+)(?:\[(?:\()?([^\]]*?)(?:\))?\]|\(\((.*?)\)\))?/);if(!m)return null;add(m[1],m[2]||m[3]||m[1]);return m[1];};
        const from=parse(parts[0]),to=parts.length>1?parse(parts[1]):null;const label=(t.match(/\|([^|]+)\|/)||t.match(/-\.([^.]*)\.->/)||[])[1]||'';
        if(from&&to){edges.push([from,to,label]);if(t.includes('<-->'))edges.push([to,from,label]);}
      });
    }
    if(!nodes.length)return;
    const tree=lines[0].trim()==='mindmap',width=tree?Math.max(880,...nodes.map(n=>n.depth*160+310)):960,height=tree?nodes.length*52+20:Math.ceil(nodes.length/3)*94+30;
    const positions=new Map(nodes.map((n,i)=>[n.id,{x:tree?20+n.depth*160:20+(i%3)*310,y:tree?12+i*52:20+Math.floor(i/3)*94}]));
    const edgeSVG=edges.map(([a,b])=>{const p=positions.get(a),q=positions.get(b);if(!p||!q)return '';return `<path d="M${p.x+270} ${p.y+18} L${q.x-4} ${q.y+18}" fill="none" stroke="var(--text-dim)" opacity=".65" marker-end="url(#map-arrow)"/>`;}).join('');
    const boxSVG=nodes.map(n=>{const p=positions.get(n.id);const words=n.label.match(/.{1,29}(?:\s|$)|.{1,29}/g)||[n.label];return `<g><rect x="${p.x}" y="${p.y}" width="270" height="${tree?38:58}" rx="6" fill="var(--bg-elev)" stroke="var(--border)"/><text x="${p.x+12}" y="${p.y+22}" fill="var(--text)" font-size="14" font-family="system-ui">${words.slice(0,2).map((w,i)=>`<tspan x="${p.x+12}" dy="${i?18:0}">${escapeHTML(w.trim())}</tspan>`).join('')}</text></g>`;}).join('');
    pre.style.whiteSpace='normal';pre.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Learning concept diagram" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto"><title>Learning concept diagram</title><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--text-dim)"/></marker></defs>${edgeSVG}${boxSVG}</svg><details class="map-description"><summary>Read diagram relationships and source</summary><ul>${edges.map(([a,b,label])=>`<li>${escapeHTML(nodes.find(n=>n.id===a).label)} → ${escapeHTML(nodes.find(n=>n.id===b).label)}${label?` (${escapeHTML(label)})`:''}</li>`).join('')}</ul><pre style="white-space:pre-wrap">${escapeHTML(code)}</pre></details>`;
  });
  return Promise.resolve();
}

/* ---------- HOME ---------- */
function renderHome() {
  const c = document.getElementById('content');
  const overall = computeOverallProgress();
  const projectsDone = Object.values(STATE.projectEvidence).filter(e=>e.built).length;
  const cw = STATE.currentWeek;
  const week = weekById(cw);
  const phase = phaseOf(cw);
  c.appendChild(el(`
    <h1>Welcome back &mdash; HumanInTheLoop AI</h1>
    <p class="mini-note">"AI should be my partner, not my replacement &mdash; I'm here to build real systems." Your program, your pace, your proof.</p>
    <div class="grid grid-3">
      <div class="card stat"><div class="num">${overall}%</div><div class="label">Lesson gates checked (${Object.values(STATE.weekStatus).filter(w=>w.masteryDone).length}/16)</div></div>
      <div class="card stat"><div class="num">${projectsDone}/16</div><div class="label">Projects marked built</div></div>
      <div class="card stat"><div class="num">${cw}</div><div class="label">Current Week</div></div>
    </div>
    <div class="card">
      <h2>Current Week: Week ${cw} &mdash; ${week.title}</h2>
      <span class="pill">${phase.name}</span>
      <p>${week.theme}</p>
      <div class="progressbar"><div class="progressbar-fill" style="width:${overall}%"></div></div>
      <div style="display:flex; flex-wrap:wrap; gap:14px; align-items:flex-end; margin-top:16px;">
        <button class="btn primary" id="goCurrentWeek">Open Week ${cw} Dashboard &rarr;</button>
        <div style="flex:1; min-width:220px;">
          <label class="deck-select-label" for="jumpWeekHome">Jump to another week</label>
          <select id="jumpWeekHome"></select>
        </div>
      </div>
    </div>
    <div class="two-col">
      <div class="card">
        <h3>Next Lesson</h3>
        <p>${lessonsForWeek(cw).find(d=>!STATE.lessonsRead[`${cw}-${d.day}`])?.topic || 'All daily lessons marked read; practice and submit evidence.'}</p>
        <p class="mini-note">Project: <b>${week.project.name}</b></p>
      </div>
      <div class="card">
        <h3>Skills with a recorded learning gate</h3>
        <div>${DATA.projects.filter(p=>STATE.weekStatus[p.week]?.masteryDone).map(p=>`<span class="tag">${p.skill}</span>`).join(' ') || '<p>No learning gates recorded yet. Selecting a lesson does not unlock a skill.</p>'}</div>
      </div>
    </div>
    <div class="card">
      <h3>The Mission</h3>
      <blockquote>I'm doing this on my own, and I refuse to be left behind as AI keeps evolving. I want to learn by doing &mdash; practicing, building, failing, debugging, and understanding until it sticks. I want AI to be my partner, not my replacement, as I build real systems. My goal is to become genuinely capable, then keep growing on a lifelong journey toward true expertise.</blockquote>
      <p class="mini-note">This is not a course to finish. It's a system to run for years. Use the Lifelong Learning tab throughout your journey. Calendar time alone does not establish mastery.</p>
    </div>
  `));
  document.getElementById('goCurrentWeek').onclick = () => nav('weeks', () => selectWeek(cw));
  const jw = document.getElementById('jumpWeekHome');
  jw.innerHTML = DATA.weeks.map(w => `<option value="${w.week}" ${w.week===cw?'selected':''}>Week ${w.week} &mdash; ${w.title}</option>`).join('');
  jw.onchange = () => { STATE.currentWeek = parseInt(jw.value); save(); route('home'); };
}

/* ---------- ROADMAP ---------- */
function renderRoadmap() {
  const c = document.getElementById('content');
  c.appendChild(el(`<h1>Learning Roadmap</h1><p>Sixteen lesson units, at your pace. Week numbers preserve the original references; progress depends on evidence, not elapsed time. Multi-agent coordination is optional after C08.</p>`));
  DATA.phases.forEach(phase => {
    c.appendChild(el(`<div class="phase-header" style="color:${phase.color}">Phase ${phase.id} &mdash; ${phase.name}</div>`));
    const list = el(`<div class="week-list"></div>`);
    phase.weeks.forEach(wn => {
      const w = weekById(wn);
      const ws = weekStatus(wn);
      const doneIcon = ws.masteryDone ? '&#9989;' : (ws.projectStatus !== 'not-started' ? '&#128260;' : '&#9898;');
      const row = el(`
        <div class="week-row" role="button" tabindex="0" aria-label="Open lesson unit ${w.week}: ${w.title}">
          <div class="wk-num">${w.week}</div>
          <div class="wk-info"><div class="wk-title">${w.title}</div><div class="wk-theme">${w.theme}</div></div>
          <div style="font-size:18px">${doneIcon}</div>
        </div>`);
      row.onclick = () => { STATE.currentWeek = wn; save(); nav('weeks', () => selectWeek(wn)); };
      row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();row.click();}};
      list.appendChild(row);
    });
    c.appendChild(list);
  });
}

