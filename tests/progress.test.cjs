const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'AI-Agentic-AI-Master-Academy-Dashboard-v2.html'),'utf8');
const assets=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const dataContext=vm.createContext({window:{}});
assets.filter(f=>!f.startsWith('v2/app/')).forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),dataContext));
const data=JSON.stringify(dataContext.window.ACADEMY_DATA);
const app=assets.filter(f=>f.startsWith('v2/app/')).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
function boot(raw,broken=false){const values=new Map(raw?[['aiAcademy_v2',raw]]:[]);const c=vm.createContext({window:{ACADEMY_DATA:JSON.parse(data)},document:{getElementById:id=>id==='academy-data'?{textContent:data}:null,addEventListener:()=>{}},localStorage:{getItem:k=>{if(broken)throw Error('blocked');return values.get(k)||null;},setItem:(k,v)=>{if(broken)throw Error('blocked');values.set(k,v);}},URL,Blob,console,setTimeout,Date});assets.filter(f=>f.startsWith('v2/app/')).forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c));return {c,values,read:code=>vm.runInContext(code,c)};}
let b=boot();assert.equal(b.read('STATE.theme'),'light');assert.equal(b.read('computeOverallProgress()'),0);
b.read('STATE.theme="dark";save()');assert.equal(boot(b.values.get('aiAcademy_v2')).read('STATE.theme'),'dark');
assert.equal(b.read('DATA.projects.length'),16);assert.equal(b.read('DATA.projects.filter(p=>p.optional).length'),1);
const old={theme:'dark',currentWeek:3,projectStatus:{1:'rebuilt',2:'explained'},weekStatus:{},lessonsRead:{'1-1':true}};
b=boot(JSON.stringify(old));assert.equal(b.read('STATE.theme'),'light');assert.equal(b.read('STATE.projectEvidence[1].built'),true);assert.equal(b.read('STATE.projectEvidence[1].rebuilt'),true);assert.equal(b.read('STATE.projectEvidence[2].explained'),true);assert.equal(b.read('STATE.lessonsRead["1-1"]'),true);assert.equal(b.values.get('aiAcademy_v2_before_v21'),JSON.stringify(old));
b.read('STATE.theme="dark";save()');const again=boot(b.values.get('aiAcademy_v2'));assert.equal(again.read('STATE.theme'),'dark');
assert.throws(()=>b.read('validateProgress({currentWeek:99})'));assert.throws(()=>b.read('validateProgress({aiLog:[{task:"x",date:"today",week:1,level:0,verified:true}]})'));assert.throws(()=>b.read('validateProgress(JSON.parse(\'{"__proto__":{"polluted":true}}\'))'));
assert.equal(b.read('safeEvidenceURL("javascript:alert(1)")'),'');assert.equal(b.read('safeEvidenceURL("https://user:pass@example.com")'),'');assert.equal(b.read('safeEvidenceURL("https://github.com/a/b")'),'https://github.com/a/b');assert.equal(b.read('escapeHTML("<img onerror=alert(1)>")'),'&lt;img onerror=alert(1)&gt;');
b=boot('{bad json');assert.equal(b.read('storageBlocked'),true);assert.equal(b.read('save()'),false);assert.equal(b.values.get('aiAcademy_v2'),'{bad json');
b=boot(undefined,true);assert.equal(b.read('storageBlocked'),true);assert.equal(b.read('save()'),false);
assert.equal(JSON.parse(data).lessons['1'].length,5);assert.equal(Object.values(JSON.parse(data).lessons).flat().length,80);
console.log('PASS: legacy migration, retained reading progress, theme preference, malformed/blocked storage, import validation, safe evidence links, escaped notes and preserved 80 lessons.');
(async()=>{
 b=boot();let blob,clicked=false,anchor={href:'',download:'',click:()=>{clicked=true},remove:()=>{}};
 b.c.URL={createObjectURL:x=>{blob=x;return 'blob:test'},revokeObjectURL:()=>{}};
 b.c.document.createElement=()=>anchor;b.c.document.body={append:()=>{}};
 b.read('downloadBackup()');assert.equal(clicked,true);assert.match(anchor.download,/^ai-academy-progress-\d{4}-\d{2}-\d{2}\.json$/);assert.equal(blob.type,'application/json');
 const exported=JSON.parse(await blob.text());assert.equal(exported.format,'ai-academy-progress');assert.equal(exported.version,1);
 b.c.backupState=exported.state;b.read('validateProgress(backupState)');console.log('PASS: export JSON envelope, filename, download action and re-import validation.');
})().catch(e=>{console.error(e);process.exitCode=1});

assert.equal(app.includes("const STORE_KEY = 'aiAcademy_v1'"),false);assert.equal(app.includes('https://github.com/sba311paw-coder/ai-engineer-path/blob/main/PROJECTS.md'),false);assert.equal(fs.existsSync(path.join(root,'v2/project-guide.html')),true);
