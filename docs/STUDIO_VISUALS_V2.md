# Studio visual refresh — 2026-10-12

User requested a cleaner game-studio presentation inspired by https://supercell.com/en/, with NOMO characters rising into the top section and new site icons. No Supercell artwork, branding, copy or code was reused.

- Removed the scrolling repeated slogan ribbon, tilted portal frame, orbit lines, decorative crosses and spinning asterisk.
- Flat pale-green hero, bold centered typography and five NOMO heroes on simple SVG hills. Progressive entrance respects reduced motion and the persistent Motion control. Characters remain fully visible at narrow widths.
- Dark-green navigation, a new NOMO face mark and stacked ANSHIN LABS wordmark. New versioned SVG/32px PNG favicons and 180px Apple touch icon avoid the old icon URLs.
- Lighter game/studio/news sections with restrained square-edged panels; accessible game tabs and the seasonal Canvas playground retained.
- All pages remain English. Public notice data, store links, legal content, app-ads.txt and CNAME unchanged.

## Character asset

Built-in `image_gen` tool, identity-preserve generation with `assets/popora-legion.webp` as reference. Final: `assets/nomo-studio-lineup-v2.webp` (1774×887, RGBA transparency preserved; PNG-to-WebP encoding only). Original generated PNG is retained outside this repository. Logos are original code-native SVGs, with PNG variants rendered from SVG.

Final prompt:

> Use case: identity-preserve. Asset type: transparent hero character lineup for the ANSHIN LABS game studio website. Use the reference image as the exact character identity and illustration style reference. Create a premium polished cutout of FIVE of these mint-green NOMO heroes together, no scenery. Keep their distinctive vertical rounded-rectangle mint faces, exactly two dark vertical eyes, NO mouths or noses, tiny simple limbs; charming compact bodies, not human anatomy. Five characters: green-hatted archer on far left holding a bow, black-and-gold samurai left, central silver-and-blue knight holding a sword, blue pointed-star-hat wizard on right holding a cyan crystal staff, small lion-hood club warrior far right. Preserve the costume designs, warm hand-painted cel shading, clean dark outlines, modest detail from reference. Confident friendly lively poses, a couple arms raised, their personalities show. A wide gently arched group, central knight largest at front, other heroes slightly behind and different heights, all faces unobstructed and all silhouettes clear, bodies only slightly overlapping, all whole bodies and weapons fully in frame. Landscape 2:1 composition, fill width with 5 heroes with a little transparent breathing room around edges; no excessive empty top/bottom. Absolutely no background, no ground/platform, no castle, no trees, no foliage, no clouds, no glow, no sparkles, no text, no logo, no border, no watermark, no hex tiles. Actual transparent alpha background. This is a character asset for a clean professional game studio website, do not generate website UI.
