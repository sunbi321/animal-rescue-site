// Keep the original Animal Rescue URLs and wording while preserving hub language choice.
const studioWords={ko:['전체 게임','동물구조대'],ja:['すべてのゲーム','アニマルレスキュー'],en:['All games','Animal Rescue']};
const current=document.documentElement.lang;const locale=studioWords[current]?current:'en';
const back=document.createElement('a');back.textContent='← '+studioWords[locale][0];back.href='./index.html?lang='+locale;back.style.cssText='display:block;padding:13px 20px;background:#f8f7f1;color:#223e35;font:700 13px/1.5 sans-serif;text-decoration:none;text-align:center;';document.body.prepend(back);
document.querySelectorAll('a[href="./index.html"]').forEach(a=>{a.href='./animal-rescue.html?lang='+locale;});
document.querySelectorAll('a[href="./privacy.html"],a[href="./delete-account.html"]').forEach(a=>{a.href=a.getAttribute('href')+'?lang='+locale;});
document.querySelectorAll('a[target="_blank"]').forEach(a=>{a.rel='noopener noreferrer';});
const legacyMenu=document.getElementById('menuButton');const legacyDrop=document.getElementById('dropdownMenu');
if(legacyMenu&&legacyDrop){
 legacyMenu.setAttribute('role','button');legacyMenu.setAttribute('tabindex','0');
 legacyMenu.setAttribute('aria-label',({ko:'메뉴',ja:'メニュー',en:'Menu'})[locale]);
 legacyMenu.setAttribute('aria-controls','dropdownMenu');
 const sync=()=>legacyMenu.setAttribute('aria-expanded',String(legacyDrop.classList.contains('active')));
 const deferredSync=()=>queueMicrotask(sync);
 legacyMenu.addEventListener('click',deferredSync);
 legacyMenu.addEventListener('keydown',e=>{
  if(!location.pathname.endsWith('/delete-account.html')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();legacyMenu.click();}
  if(e.key==='Escape')legacyDrop.classList.remove('active');
  deferredSync();
 });
 document.addEventListener('click',deferredSync);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){legacyDrop.classList.remove('active');deferredSync();}});
 sync();
}
