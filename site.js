// The studio website is intentionally English-only, independent of device or game language.
document.documentElement.lang = 'en';
// Old links remain valid, but do not advertise a locale the website no longer offers.
const url = new URL(location.href);
if (url.searchParams.has('lang')) {
  url.searchParams.delete('lang');
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}
