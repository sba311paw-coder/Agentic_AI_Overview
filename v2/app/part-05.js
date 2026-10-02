/* ---------- CAREER ---------- */
function renderCareer() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Career Dashboard</h1>
    <p>${Object.values(DATA.careerQuestions).reduce((sum,qs)=>sum+qs.length,0)} interview-style questions across ${Object.keys(DATA.careerQuestions).length} categories. Answer aloud or in writing before checking any reference &mdash; that's retrieval practice, not a quiz to skim.</p>
    <div class="subnav" id="careerNav"></div>
    <div id="careerBox"></div>
  `));
  const cats = Object.keys(DATA.careerQuestions);
  const nav_ = document.getElementById('careerNav');
  nav_.innerHTML = cats.map((cat,i)=>`<button data-cat="${cat}" class="${i===0?'active':''}">${cat} (${DATA.careerQuestions[cat].length})</button>`).join('');
  function show(cat) {
    nav_.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.cat===cat));
    const qs = DATA.careerQuestions[cat];
    const doneCount = qs.filter((_,i)=>STATE.careerChecked[cat+'-'+i]).length;
    document.getElementById('careerBox').innerHTML = `
      <div class="card">
        <h3>${cat} &mdash; ${doneCount}/${qs.length} practiced</h3>
        <div class="progressbar"><div class="progressbar-fill" style="width:${Math.round(doneCount/qs.length*100)}%"></div></div>
        ${qs.map((q,i)=>`<label class="checklist-item"><input type="checkbox" data-key="${cat}-${i}" ${STATE.careerChecked[cat+'-'+i]?'checked':''}> ${q}</label>`).join('')}
      </div>`;
    document.querySelectorAll('#careerBox [data-key]').forEach(cb=>{
      cb.onchange = () => { STATE.careerChecked[cb.dataset.key] = cb.checked; save(); show(cat); };
    });
  }
  nav_.querySelectorAll('button').forEach(b => b.onclick = () => show(b.dataset.cat));
  show(cats[0]);
}

/* ---------- LIFELONG LEARNING ---------- */
const CADENCES = [
  ['daily','Daily','15–30 min of AI learning (news, a doc page, a paper abstract)'],
  ['weekly','Weekly','2–3 hours building something'],
  ['monthly','Monthly','One mini-project + revisit the Tech Radar'],
  ['quarterly','Quarterly','One substantial project'],
  ['yearly','Yearly','One major AI system + revisit your 3–5 year roadmap'],
];
function renderLifelong() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Lifelong Learning Dashboard</h1>
    <p><i>"This is not the end. It is Day 1 of the next journey."</i> Use this after Week 16 to keep the LEARN &rarr; BUILD &rarr; BREAK &rarr; DEBUG &rarr; VERIFY &rarr; DEPLOY &rarr; REFLECT &rarr; IMPROVE cycle running for years.</p>
    <div class="card"><h3>Cadence Tracker</h3><div id="cadenceBox"></div></div>
    <div class="two-col">
      <div class="card">
        <h3>12-Month Post-Course Roadmap</h3>
        <table><tbody>
          <tr><td><b>Months 1&ndash;3</b></td><td>Advanced Python + AI engineering depth</td></tr>
          <tr><td><b>Months 4&ndash;6</b></td><td>Advanced agents + production systems</td></tr>
          <tr><td><b>Months 7&ndash;9</b></td><td>AI infrastructure + distributed systems</td></tr>
          <tr><td><b>Months 10&ndash;12</b></td><td>Specialization + first research paper engagement</td></tr>
        </tbody></table>
      </div>
      <div class="card">
        <h3>Long-term directions (illustrative, not career guarantees)</h3>
        <table><tbody>
          <tr><td><b>Yr 1</b></td><td>Foundational AI Engineer</td></tr>
          <tr><td><b>Yr 2</b></td><td>Advanced AI Engineer</td></tr>
          <tr><td><b>Yr 3</b></td><td>Agentic AI Specialist</td></tr>
          <tr><td><b>Yr 4</b></td><td>AI Systems Architect / Technical Lead</td></tr>
          <tr><td><b>Yr 5</b></td><td>AI Architect / Research Engineer / AI Product Builder</td></tr>
        </tbody></table>
      </div>
    </div>
    <div class="card">
      <h3>Specialization Menu (choose at Month 10)</h3>
      <div class="radar-items">${['Agentic AI','AI infrastructure','LLM engineering','RAG','AI security','Multimodal AI','AI developer tools','AI automation','AI research'].map(s=>`<span class="radar-item">${s}</span>`).join('')}</div>
    </div>
  `));
  const box = document.getElementById('cadenceBox');
  function draw() {
    box.innerHTML = CADENCES.map(([key,label,desc]) => {
      const last = STATE.lifelong[key];
      return `<div class="checklist-item" style="justify-content:space-between;">
        <div><b>${label}</b> &mdash; ${desc}<br><span class="mini-note">Last logged: ${escapeHTML(last || 'never')}</span></div>
        <button class="btn small" data-key="${key}">Log Today</button>
      </div>`;
    }).join('');
    box.querySelectorAll('[data-key]').forEach(btn => {
      btn.onclick = () => { STATE.lifelong[btn.dataset.key] = todayStr(); save(); draw(); };
    });
  }
  draw();
}


// Initialize only after every validation function has loaded.
STATE = loadState();
STATE.projectEvidence ||= {};
for (const p of DATA.projects) {
  if (!STATE.projectEvidence[p.week]) {
    const old=STATE.projectStatus[p.week];
    STATE.projectEvidence[p.week]={built:['completed','rebuilt','explained'].includes(old),tested:false,rebuilt:old==='rebuilt',explained:old==='explained',link:'',notes:''};
  }
}
if (!STATE.lessonsRead) STATE.lessonsRead = {}; // back-compat for state saved before lessons shipped
