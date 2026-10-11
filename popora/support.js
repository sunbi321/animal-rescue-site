const translations=JSON.parse(document.getElementById('support-copy').textContent);
const languages=Object.keys(translations), page=document.body.dataset.page;
const pathToIndex={'support':1,'delete-account':2,'privacy':3};
function readSaved(){try{return localStorage.getItem('anshin-language')}catch{return null}}
function matchLang(raw){if(!raw)return null;if(translations[raw])return raw;if(raw.startsWith('zh'))return 'zh-Hant';if(raw.startsWith('pt'))return 'pt-BR';return languages.find(x=>raw===x||raw.startsWith(x+'-'))||null;}
const requested=matchLang(new URLSearchParams(location.search).get('lang'));
let language=requested||matchLang(readSaved())||(navigator.languages||[navigator.language]).map(matchLang).find(Boolean)||'en';
const selector=document.getElementById('support-language');
function node(tag,text,parent){const el=document.createElement(tag);if(text)el.textContent=text;if(parent)parent.append(el);return el;}
function paint(lang){language=lang;selector.value=lang;const c=translations[lang],idx=pathToIndex[page];document.documentElement.lang=lang;document.title=c[idx]+' · POPORA · ANSHIN LABS';document.querySelector('h1').textContent=c[idx];
 document.querySelectorAll('[data-support-nav]').forEach(a=>{const i=Number(a.dataset.supportNav);a.textContent=c[i];const target=Object.keys(pathToIndex).find(k=>pathToIndex[k]===i);a.href=target+'.html?lang='+encodeURIComponent(lang);if(i===idx)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const brand=document.querySelector('header a');brand.href='../index.html?lang='+encodeURIComponent(lang);document.querySelector('nav a').href='./?lang='+encodeURIComponent(lang);
 const main=document.getElementById('support-content');main.replaceChildren();const mail=(deletion=false)=>'mailto:info@anshin-labs.com?subject='+encodeURIComponent('POPORA — '+c[deletion?8:1]);
 const link=(label,href,parent=main)=>{const a=node('a',label,parent);a.href=href;return a};const para=i=>node('p',c[i],main);
 if(page==='support'){node('h2',c[5],main);para(6);link(c[7],mail());link('info@anshin-labs.com',mail(),node('p','',main));link(c[22]+' →','delete-account.html?lang='+lang);}
 if(page==='delete-account'){node('h2',c[8],main);para(9);para(10);link(c[13],mail(true));link('info@anshin-labs.com',mail(true),node('p','',main));const note=node('div','',main);note.className='legal-notice';node('p',c[11],note);node('p',c[12],note);}
 if(page==='privacy'){para(23);for(const i of [14,16,18,20]){node('h2',c[i],main);para(i+1);}link(c[22]+' →','delete-account.html?lang='+lang);link('info@anshin-labs.com',mail(),node('p','',main));const list=node('ul','',main);for(const [name,url] of [['Supabase','https://supabase.com/privacy'],['Apple','https://www.apple.com/legal/privacy/'],['Google','https://policies.google.com/privacy'],['Google AdMob','https://policies.google.com/technologies/partner-sites']])link(name,url,node('li','',list));}
}
selector.addEventListener('change',()=>{paint(selector.value);try{localStorage.setItem('anshin-language',language)}catch{}const u=new URL(location.href);u.searchParams.set('lang',language);history.replaceState(null,'',u);});paint(language);
