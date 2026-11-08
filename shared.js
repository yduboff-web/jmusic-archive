// Shared site code: page styles are in shared.css; this file holds the one database URL,
// the shared header/menu markup, and shared helpers. Each page keeps only its own code.
const DB_URL='4-database-v6507.json';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0591-\u05c7]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
(function(){
const ph=document.getElementById('site-header');
if(ph)ph.outerHTML="<header><p class=\"muted\">ארכיון המוזיקה היהודית</p><h1>Jewish Music Booklet Archive</h1><p>One database. Albums, songs and the people behind them.</p></header>";
const main=document.querySelector('main');
if(main){const t=document.createElement('template');t.innerHTML="<nav aria-label=\"Archive pages\"><details class=\"page-menu\"><summary>Pages</summary><a href=\"index.html\">Search</a><a href=\"booklets.html\">All booklets</a><a href=\"people.html\">Index</a><a href=\"about.html\">About the archive</a></details></nav>";main.prepend(t.content.firstChild)}
})();
let _db,_loading;
async function loadDB(){
if(_db)return _db;
if(_loading)return _loading;
_loading=fetch(DB_URL).then(r=>{if(!r.ok)throw Error('Database could not be loaded.');return r.json()}).then(async d=>{
if(d.encoding==='gzip-base64'){const bytes=Uint8Array.from(atob(d.data),c=>c.charCodeAt(0));d=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text())}
return d}).then(d=>{_db=d;return _db}).catch(e=>{const el=$('error');if(el)el.textContent=e.message;_loading=null;throw e});
return _loading}
