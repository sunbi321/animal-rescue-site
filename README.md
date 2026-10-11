# ANSHIN LABS games website

The shared studio homepage for **Help! Animal Rescue** and **POPORA: NOMO Legion**.

## Pages

- `/`: responsive studio/game directory, Korean/Japanese/English, browser-language selection and manual choice.
- `/animal-rescue.html`: preserved Animal Rescue landing page, original store links/video/art.
- `/privacy.html`, `/delete-account.html`: **Animal Rescue only**. Keep these existing store-linked URLs and their policy content. Added studio navigation and language continuity; removed accidental Markdown fences from privacy HTML.
- `/popora/`: POPORA introduction. Currently **coming soon**, since internal builds are not a public release.
- `/popora/support.html`, `/popora/privacy.html`, `/popora/delete-account.html`: ten-language POPORA support pages, copied verbatim from the reviewed October 11 game-support copy. Email `info@anshin-labs.com`. Account deletion requires ownership verification. These do not delete an account automatically.
- `/app-ads.txt`: existing publisher declaration, untouched.

## Development and publishing

Static HTML/CSS/JS. Run `python3 -m http.server 8177 --bind 127.0.0.1` from this folder. `python3 tools/build_pages.py` regenerates the studio and POPORA HTML; edit `site.js` for the three-language studio copy, and `popora/support-copy.json` for the ten-language POPORA support copy.

GitHub Pages publishes the root of `main` in `sunbi321/animal-rescue-site`; custom domain is `anshin-labs.com`. Review local desktop/mobile and language navigation before pushing. No hosting/provider migration or new credentials required. The POPORA app/store URLs currently pointing at `popora-game.pages.dev` are not changed by this website update; that existing support site remains available.

## Artwork

Animal Rescue images are the original assets in this repository. POPORA images reuse the existing approved `popora-appstore-20261010/final-art/02–05.png` illustrations and the game icon `assets/branding/poporo-nomo-legion-v6.png` from the POPORA project. WebP copies are resized/encoded for delivery; no new generated illustrations or gameplay screenshots. The POPORA detail hero explicitly labels illustrations. No runtime trackers, ads or analytics were added to the studio pages. Google Fonts is used for typography, consistent with the existing site.
