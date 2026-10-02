/* ---------- WEEKS ---------- */
function selectWeek(n) {
  const sel = document.getElementById('weekSelect');
  if (sel) sel.value = n;
  renderWeekDetail(n);
}
function renderWeeks() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Week Dashboard</h1>
    <div class="searchbar">
      <select id="weekSelect"></select>
    </div>
    <div id="weekDetail"></div>
  `));
  const sel = document.getElementById('weekSelect');
  sel.innerHTML = DATA.weeks.map(w => `<option value="${w.week}">Week ${w.week} &mdash; ${w.title}</option>`).join('');
  sel.value = STATE.currentWeek;
  sel.onchange = () => renderWeekDetail(parseInt(sel.value));
  renderWeekDetail(STATE.currentWeek);
}
function renderWeekDetail(n) {
  STATE.currentWeek = n; save();
  const w = weekById(n);
  const ws = weekStatus(n);
  const phase = phaseOf(n);
  const box = document.getElementById('weekDetail');
  const resHtml = w.resources.map(id => {
    const r = resourceById(id);
    if (!r) return '';
    return `<li><a href="${r.url}" target="_blank" rel="noopener">${r.name}</a> &mdash; <span class="mini-note">${r.provider} &middot; ${r.cost} &middot; ${r.type} &middot; ${r.duration}</span><br><span class="mini-note">${r.why}</span></li>`;
  }).join('');
  const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const lessonDays = lessonsForWeek(n);
  const lp = lessonReadCount(n);
  const lessonsHtml = lessonDays.length ? `
    <div class="card">
      <h3>Daily Core Lessons</h3>
      <p class="mini-note">Read each day's lesson before doing that day's work &mdash; this is the actual teaching content behind the one-line topic above. ${lp.read}/${lp.total} marked read.</p>
      <div class="progressbar"><div class="progressbar-fill" style="width:${lp.total ? Math.round(lp.read/lp.total*100) : 0}%"></div></div>
      ${lessonDays.map(d => {
        const key = `${n}-${d.day}`;
        const isRead = !!STATE.lessonsRead[key];
        return `
        <details class="lesson-acc" data-key="${key}" ${d.day===1 ? 'open' : ''}>
          <summary>
            <span role="button" tabindex="0" aria-label="Toggle read status for day ${d.day}" class="lesson-check ${isRead ? 'is-read' : ''}" data-key="${key}" title="Mark as read">${isRead ? '&#9989;' : '&#9898;'}</span>
            <span class="lesson-summary-text"><b>Day ${d.day} (${dayNames[d.day-1]}):</b> ${d.title}</span>
          </summary>
          <div class="lesson-body">${d.bodyHtml}</div>
        </details>`;
      }).join('')}
    </div>
  ` : '';
  box.innerHTML = `
    <div class="card">
      <span class="pill">${phase.name} · ${w.canonical}</span>
      <p class="study-note">Lesson-unit numbering is a reference, not a deadline. <a href="v2/project-guide.html#mapping" target="_blank" rel="noopener">Project mapping and evidence guidance</a> support progression; your assessor applies the canonical requirements. Older teaching examples are context, not current API guarantees.</p>
      <h2>Week ${w.week} &mdash; ${w.title}</h2>
      <p>${w.theme}</p>
      <h3>Learning Objectives</h3>
      <ul>${w.objectives.map(o=>`<li>${o}</li>`).join('')}</ul>
      <h3>Daily Topics (Mon&ndash;Fri)</h3>
      <ol>${w.daily.map(d=>`<li>${d}</li>`).join('')}</ol>
    </div>
    ${lessonsHtml}
    <div class="card">
      <h3>Core Resources</h3>
      <ul>${resHtml || '<li class="mini-note">Capstone week &mdash; draws on all prior resources.</li>'}</ul>
    </div>
    <div class="card">
      <h3>Mind Map</h3>
      <div class="mermaid-box"><pre class="mermaid">${w.mindmap}</pre></div>
    </div>
    <div class="two-col">
      <div class="card">
        <h3>Weekly Project</h3>
        <p><b>${w.project.name}</b><br>${w.project.desc}</p>
        <label class="mini-note">Status:</label>
        <select class="status-select" id="wkProjectStatus">
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rebuilt">Rebuilt from Scratch</option>
          <option value="explained">Independently Explained</option>
        </select>
      </div>
      <div class="card">
        <h3>No-AI &amp; Debugging</h3>
        <p><b>No-AI Challenge:</b> ${w.noAI}</p>
        <p><b>Debugging Exercise:</b> ${w.debugging}</p>
      </div>
    </div>
    <div class="card">
      <h3>Mastery Gate</h3>
      <p>${w.masteryGate}</p>
      <label class="checklist-item"><input type="checkbox" id="wkMasteryDone"> I've reviewed this learning gate and recorded evidence (self-reported; formal assessment is in AI Engineer Path)</label>
      <button class="btn primary small" id="wkQuizBtn" style="margin-top:10px;">Take Week ${w.week} Quiz &rarr;</button>
    </div>
  `;
  renderMermaidIn(box);
  const psSel = document.getElementById('wkProjectStatus');
  psSel.value = STATE.projectStatus[n] || 'not-started';
  psSel.onchange = () => { STATE.projectStatus[n] = psSel.value; ws.projectStatus = psSel.value; const e=STATE.projectEvidence[n]; if(["completed","rebuilt","explained"].includes(psSel.value))e.built=true; if(psSel.value==="rebuilt")e.rebuilt=true;if(psSel.value==="explained")e.explained=true; save(); };
  const mdChk = document.getElementById('wkMasteryDone');
  mdChk.checked = !!ws.masteryDone;
  mdChk.onchange = () => { ws.masteryDone = mdChk.checked; save(); };
  document.getElementById('wkQuizBtn').onclick = () => nav('quizzes', () => selectQuizWeek(n));
  box.querySelectorAll('.lesson-check').forEach(chk => {
    chk.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chk.click();}};
    chk.onclick = (e) => {
      e.preventDefault(); e.stopPropagation();
      const key = chk.dataset.key;
      const nowRead = !STATE.lessonsRead[key];
      STATE.lessonsRead[key] = nowRead;
      save();
      // update in place so <details> open/closed state isn't disturbed
      chk.classList.toggle('is-read', nowRead);
      chk.innerHTML = nowRead ? '&#9989;' : '&#9898;';
      const lp2 = lessonReadCount(n);
      const lessonCard = box.querySelector('.lesson-acc')?.closest('.card');
      if (lessonCard) {
        const note = lessonCard.querySelector('.mini-note');
        if (note) note.textContent = note.textContent.replace(/\d+\/\d+ marked read\.$/, `${lp2.read}/${lp2.total} marked read.`);
        const fill = lessonCard.querySelector('.progressbar-fill');
        if (fill) fill.style.width = `${lp2.total ? Math.round(lp2.read/lp2.total*100) : 0}%`;
      }
    };
  });
}

/* ---------- RESOURCES ---------- */
function renderResources() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Resource Library</h1>
    <p>Every resource was verified via live web research (last verified dates shown). ${DATA.resources.length} curated resources across the full program.</p>
    <div class="searchbar">
      <input type="text" id="resSearch" placeholder="Search by name, provider, topic...">
      <select id="resType"><option value="">All Types</option></select>
      <select id="resCost"><option value="">All Cost Tiers</option></select>
      <select id="resWeek"><option value="">All Weeks</option></select>
      <select id="resDiff"><option value="">All Difficulty Levels</option></select>
    </div>
    <div id="resList"></div>
  `));
  const types = [...new Set(DATA.resources.map(r=>r.type))].sort();
  document.getElementById('resType').innerHTML += types.map(t=>`<option value="${t}">${t}</option>`).join('');
  const costs = [...new Set(DATA.resources.map(r=>r.cost))];
  document.getElementById('resCost').innerHTML += costs.map(t=>`<option value="${t}">${t}</option>`).join('');
  const weeks = [...new Set(DATA.resources.map(r=>r.week))].sort((a,b)=>a-b);
  document.getElementById('resWeek').innerHTML += weeks.map(t=>`<option value="${t}">Week ${t}</option>`).join('');
  ['Beginner','Intermediate','Advanced'].forEach(d => {
    document.getElementById('resDiff').innerHTML += `<option value="${d}">${d}</option>`;
  });

  function refresh() {
    const q = document.getElementById('resSearch').value.toLowerCase();
    const ty = document.getElementById('resType').value;
    const co = document.getElementById('resCost').value;
    const wk = document.getElementById('resWeek').value;
    const df = document.getElementById('resDiff').value;
    const filtered = DATA.resources.filter(r => {
      if (ty && r.type !== ty) return false;
      if (co && r.cost !== co) return false;
      if (wk && String(r.week) !== wk) return false;
      if (df && !r.difficulty.includes(df)) return false;
      if (q && !(r.name+r.provider+r.why).toLowerCase().includes(q)) return false;
      return true;
    });
    function costBadge(cost) {
      const free = cost.includes('🟢'), paid = cost.includes('🔴');
      const cls = free && paid ? 'badge-mixed' : paid ? 'badge-paid' : 'badge-free';
      return `<span class="badge ${cls}">${cost}</span>`;
    }
    function diffBadge(d) {
      const cls = d.includes('Advanced') ? 'badge-advanced' : d.includes('Intermediate') ? 'badge-intermediate' : 'badge-beginner';
      return `<span class="badge ${cls}">${d}</span>`;
    }
    document.getElementById('resList').innerHTML = filtered.length ? `
      <div class="resource-grid">
        ${filtered.map(r=>`
          <div class="resource-card">
            <a class="res-name" href="${r.url}" target="_blank" rel="noopener">${r.name}</a>
            <div class="res-provider">${r.provider} &middot; Week ${r.week}</div>
            <div class="res-badges">
              <span class="badge badge-type">${r.type}</span>
              ${costBadge(r.cost)}
              ${diffBadge(r.difficulty)}
            </div>
            <p class="res-why">${r.why}</p>
            <div class="res-footer"><span>${r.duration || ''}</span><span>Source date ${r.verified}</span></div>
          </div>`).join('')}
      </div>
      <p class="mini-note" style="margin-top:14px;">${filtered.length} of ${DATA.resources.length} resources shown.</p>`
      : `<div class="card" style="text-align:center; color: var(--text-dim);">No resources match your filters &mdash; try clearing the search or selecting "All" in a dropdown.</div>`;
  }
  ['resSearch','resType','resCost','resWeek','resDiff'].forEach(id => document.getElementById(id).addEventListener('input', refresh));
  refresh();
}

/* ---------- MIND MAPS ---------- */
function renderMindmaps() {
  const c = document.getElementById('content');
  c.appendChild(el(`<h1>Mind Map Library</h1><p>Select a map to render it.</p><div class="subnav" id="mmNav"></div><div id="mmBox"></div>`));
  const options = DATA.weeks.map(w => ({id:'week'+w.week, title:'Week '+w.week+': '+w.title, code:w.mindmap}))
    .concat(DATA.extraMindmaps);
  const nav_ = document.getElementById('mmNav');
  nav_.innerHTML = options.map((o,i)=>`<button data-i="${i}" class="${i===0?'active':''}">${o.title}</button>`).join('');
  function show(i) {
    document.querySelectorAll('#mmNav button').forEach((b,bi)=>b.classList.toggle('active', bi===i));
    document.getElementById('mmBox').innerHTML = `<div class="card">
      <h3>${options[i].title}</h3>
      <div class="mermaid-controls">
        <button class="btn" id="mmZoomOut" type="button">&minus; Zoom Out</button>
        <button class="btn" id="mmZoomReset" type="button">Reset</button>
        <button class="btn" id="mmZoomIn" type="button">+ Zoom In</button>
        <span class="mini-note">Drag to pan &middot; scroll or buttons to zoom</span>
      </div>
      <div class="mermaid-viewport" id="mmViewport"><pre class="mermaid">${options[i].code}</pre></div>
    </div>`;
    renderMermaidIn(document.getElementById('mmBox')).then(() => {
      setupMindmapPanZoom(document.getElementById('mmViewport'));
    });
  }
  nav_.querySelectorAll('button').forEach(b => b.onclick = () => show(parseInt(b.dataset.i)));
  show(0);
}

function setupMindmapPanZoom(viewport) {
  const svg = viewport.querySelector('svg');
  if (!svg) return;
  let scale = 1, x = 0, y = 0;
  let dragging = false, startX = 0, startY = 0, startPanX = 0, startPanY = 0;
  const MIN_SCALE = 0.4, MAX_SCALE = 3;

  function apply() {
    svg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }
  function zoomBy(factor) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    apply();
  }
  function reset() {
    scale = 1; x = 0; y = 0;
    apply();
  }

  svg.style.transformOrigin = '0 0';
  svg.style.cursor = 'grab';
  apply();

  viewport.onpointerdown = (e) => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    startPanX = x; startPanY = y;
    svg.style.cursor = 'grabbing';
    viewport.setPointerCapture(e.pointerId);
  };
  viewport.onpointermove = (e) => {
    if (!dragging) return;
    x = startPanX + (e.clientX - startX);
    y = startPanY + (e.clientY - startY);
    apply();
  };
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    svg.style.cursor = 'grab';
    try { viewport.releasePointerCapture(e.pointerId); } catch(err) {}
  };
  viewport.onpointerup = endDrag;
  viewport.onpointercancel = endDrag;

  viewport.onwheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.1 : 0.9);
  };

  const zoomOutBtn = document.getElementById('mmZoomOut');
  const zoomInBtn = document.getElementById('mmZoomIn');
  const zoomResetBtn = document.getElementById('mmZoomReset');
  if (zoomOutBtn) zoomOutBtn.onclick = () => zoomBy(0.8);
  if (zoomInBtn) zoomInBtn.onclick = () => zoomBy(1.25);
  if (zoomResetBtn) zoomResetBtn.onclick = reset;
}

/* ---------- QUIZZES ---------- */
function selectQuizWeek(n) {
  const sel = document.getElementById('quizWeekSelect');
  if (sel) { sel.value = n; renderQuiz(n); }
}
function renderQuizzes() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Quiz Engine</h1>
    <div class="searchbar"><select id="quizWeekSelect"></select></div>
    <div id="quizBox"></div>
  `));
  const sel = document.getElementById('quizWeekSelect');
  sel.innerHTML = DATA.weeks.map(w=>`<option value="${w.week}">Week ${w.week} &mdash; ${w.title}</option>`).join('');
  sel.value = STATE.currentWeek;
  sel.onchange = () => renderQuiz(parseInt(sel.value));
  renderQuiz(STATE.currentWeek);
}
function renderQuiz(n) {
  const w = weekById(n);
  const box = document.getElementById('quizBox');
  const ws = weekStatus(n);
  let answers = new Array(w.quiz.length).fill(null);
  function draw() {
    box.innerHTML = `<div class="card">
      <h3>Week ${n} Quiz &mdash; ${w.quiz.length} questions</h3>
      <p class="mini-note">Best score so far: ${ws.quizBest || 0}/${w.quiz.length || 5}</p>
      ${w.quiz.map((q,qi)=>`
        <div class="quiz-q">
          <p><b>${qi+1}. ${q.q}</b></p>
          ${q.options.map((o,oi)=>`<div class="quiz-opt" data-q="${qi}" data-o="${oi}">${o}</div>`).join('')}
        </div>`).join('')}
      <button class="btn primary" id="quizSubmit">Submit Quiz</button>
      <span id="quizResult" style="margin-left:12px; font-weight:700;"></span>
    </div>`;
    box.querySelectorAll('.quiz-opt').forEach(opt => {
      opt.onclick = () => {
        const qi = parseInt(opt.dataset.q);
        box.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach(o=>o.classList.remove('selected'));
        opt.classList.add('selected');
        answers[qi] = parseInt(opt.dataset.o);
      };
    });
    document.getElementById('quizSubmit').onclick = () => {
      let score = 0;
      w.quiz.forEach((q, qi) => {
        const opts = box.querySelectorAll(`.quiz-opt[data-q="${qi}"]`);
        opts.forEach((o,oi) => {
          if (oi === q.a) o.classList.add('correct');
          else if (oi === answers[qi]) o.classList.add('incorrect');
        });
        if (answers[qi] === q.a) score++;
      });
      document.getElementById('quizResult').textContent = `Score: ${score}/${w.quiz.length}`;
      ws.quizTotal = w.quiz.length;
      ws.quizBest = Math.max(ws.quizBest || 0, score);
      save();
    };
  }
  draw();
}

