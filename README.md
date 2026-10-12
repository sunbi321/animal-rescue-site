# ANSHIN LABS website

The English-only studio website for **Help! Animal Rescue** and **POPORA: NOMO Legion**.

## Pages

- `/`: studio introduction, featured games, news and player support.
- `/animal-rescue.html`: Animal Rescue overview, original App Store / Google Play listings, and trailer.
- `/privacy.html`, `/delete-account.html`: existing Animal Rescue store-linked support URLs, with the established English policy wording.
- `/popora/`: POPORA overview. **Coming soon**; internal builds are not a public release.
- `/popora/support.html`, `/popora/privacy.html`, `/popora/delete-account.html`: reviewed English support/privacy/deletion instructions. Support email: `info@anshin-labs.com`. Deletion requests require ownership verification.
- `/popora/notices/`: English notices, supporting direct `?id=...` links. Static JSON mirror first, live published notices second; failed live requests retain the mirror.
- `/app-ads.txt`: existing publisher declaration, unchanged.

## Development and publishing

Static HTML/CSS/JS. Run `python3 tools/build_pages.py` to generate all nine pages. Edit the generator for page structure, `site.css` for styling, and `popora/notices/notice.js` for notice rendering. Serve locally with `python3 -m http.server 8177 --bind 127.0.0.1`.

The website stays in English regardless of device language, saved preferences, or old `?lang=` links. English content is delivered directly in HTML and works without JavaScript. Notice images are operator-authored assets. Multilingual `popora/support-copy.json`, `popora/notices/feed.json` and `status.json` remain intact for the game and other consumers; do not strip their locales. The scheduled notice mirror workflow continues to run independently.

GitHub Pages publishes the root of `main` in `sunbi321/animal-rescue-site` to `anshin-labs.com`. Check desktop/mobile layout, links, English content, and notice fallback before pushing. Do not migrate hosting or change the app's existing support URLs as part of site design work.

## Artwork and privacy

Existing approved game illustrations and icons are reused as WebP assets. POPORA's detail page labels the hero as a game-world illustration. No gameplay claims are inferred from promotional artwork. No trackers, ads, or analytics were added. Google Fonts supplies Nunito with a system-font fallback. The trailer opens on YouTube only when clicked (no automatic third-party video embed).
