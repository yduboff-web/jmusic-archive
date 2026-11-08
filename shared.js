// Shared site code: page styles are in shared.css; this file holds the one database URL,
// the shared header/menu markup, and shared helpers. Each page keeps only its own code.
const DB_URL='1-1-database-v9033.json';
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

// Many album titles in the data start with the Drive folder name ("Folder - Title").
// The folder is how the files are organized, not what the booklet prints, so strip it.
function stripFolder(a,t){
  const f=a.artist_folder;
  if(!f||!t||!t.toLowerCase().startsWith(f.toLowerCase()+' -'))return t;
  return t.slice(f.length).replace(/^\s*-\s*/,'').trim()||t;
}
function albumTitle(a){return stripFolder(a,a.title)||a.title_he||''}

// Link to the source PDF on Drive. A record built from part of another PDF lists its pages.
function bookletLink(a,page){
  const s=a.sources[0];
  const u=new URL(s.url);u.searchParams.delete('authuser');
  const where=page?' · PDF page '+page:(s.pages&&s.pages.length?' · PDF pages '+s.pages.join(', '):'');
  return `<a href="${esc(u.href)}" target="_blank" rel="noopener">Open original booklet${esc(where)}</a>`;
}
