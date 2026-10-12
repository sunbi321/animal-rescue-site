// The web presentation is English. Keep multilingual feed data intact for the game.
const params = new URLSearchParams(location.search);
const target = document.getElementById('notices');
const allLink = document.getElementById('all-notices');
allLink.hidden = !params.has('id');
let notices = [];
let loaded = false;
function render() {
  target.replaceChildren();
  const entries = notices.filter(n => n.published && (!params.has('id') || n.id === params.get('id')));
  if (!entries.length) {
    const state = document.createElement('p');
    state.className = 'notice-state';
    state.textContent = !loaded ? 'We couldn’t load the notices. Please try again in a moment.' : params.has('id') ? 'This notice is no longer available. You can find current updates in All notices.' : 'No notices yet. Check back for the next chapter.';
    target.append(state);
  }
  for (const n of entries) {
    const article = document.createElement('article');
    const a = document.createElement('a');
    a.href = '?id=' + encodeURIComponent(n.id);
    const title = document.createElement('h2');
    title.textContent = n.title?.en || 'POPORA update';
    a.append(title);
    article.append(a);
    if (n.image && /^https:\/\/(anshin-labs\.com|blsggkmvytquqpunxwlm\.supabase\.co)\//.test(n.image)) {
      const img = document.createElement('img');
      img.src = n.image; img.alt = title.textContent; img.loading = 'lazy';
      article.append(img);
    }
    const body = document.createElement('p');
    body.textContent = n.body?.en || 'The English version of this update is being prepared. Please contact support if you need help.';
    article.append(body); target.append(article);
  }
}
(async () => {
  try {
    const r = await fetch('feed.json', {cache:'no-cache'});
    if (r.ok) { const data = await r.json(); if (Array.isArray(data.notices)) {notices = data.notices; loaded = true; render();} }
  } catch {}
  try {
    const r = await fetch('https://blsggkmvytquqpunxwlm.supabase.co/functions/v1/nomo-content?' + (params.has('id') ? 'notice=' + encodeURIComponent(params.get('id')) : 'notices=1'), {signal:AbortSignal.timeout(4000)});
    if (r.ok) { const data = await r.json(); if (Array.isArray(data.notices)) {notices = data.notices; loaded = true;} }
  } catch {}
  render();
})();
