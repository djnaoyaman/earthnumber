# Earth Number

Interactive Japanese science atlas. Buildless static HTML/CSS/JavaScript in the repository root.

- Main experience: 34 exhibits across the main page (31) and discoveries.html (3), each with source links, scientific assumptions and units.
- Author page: `author.html`. Profile/portfolio text adapted from the existing gooooooooood expression author page source available in the workspace.
- Brand assets: supplied MINERALion JPEG and THEMAROX PDF; whitespace cropped, artwork and aspect ratio preserved. Footer links to official sites.
- Colors: primary #0033AD; headings #0A1F5C; panels #EEF2FB; rules #BFC8E0; white. Supporting scientific colors identify compared materials.
- Scientific objects use SVG/CSS. Conceptual geometry, playback speed and estimated counters are labelled. No live scientific data APIs are represented.
- Global motion pause and reduced-motion support. Numeric fitting handles small viewports and growing counters.

## Data maintenance

Sources were reviewed 2026-10-24. Statistical baselines retain their original years. Do not relabel 2011/2018/2019/2023/2024 estimates as current live totals. Distinguish intracloud lightning from ground strikes, atmospheric dust inflow from surface deposition, mapped seafloor from direct exploration, dry/carbon biomass from wet weight, elements from minerals and nutrition.

Planet distances are circular coplanar approximations. Stellar counts and biological totals are model estimates. Bulk Earth elemental mass is composition fraction × 5.9722e24 kg; never describe it as recoverable mineral reserves. The full-earth composition is a representative older model, not the composition of Earth's crust or supplement mineral proportions.

## Verification

Syntax checked all four application scripts plus motion.js. Browser tested index search, mineral switching, lunar light time, water switching, exploded Earth view, brand asset loading. Layout tested with browser iframes at 320, 390, 768, 1024, 1920 px frame widths, with no horizontal document overflow after fixes. Native hardware was not tested.

## Publication

Published with GitHub Pages from `main` / repository root. Every push to `main` triggers publication. No dependency installation or compilation is required.

- Website: https://djnaoyaman.github.io/earthnumber/
- Author: https://djnaoyaman.github.io/earthnumber/author.html
- Additional ideas: [100 visualization candidates](CONTENT_BACKLOG.md), not yet implemented.
- GA4 tag: G-BRYWJ6L872 on both pages; receiving data in the Analytics account has not been verified.


## Exhibit catalog

All 34 exhibits are listed at `exhibits.html`, grouped first by learning level (17 basic / 17 advanced), then by eight genres. This is an editorial learning guide, not an official syllabus mapping. Catalog data is maintained in `catalog-data.js`; the main-page menu consumes the same data. The catalog supports level, genre and keyword filtering, shareable query parameters and a no-JavaScript static listing. A keyboard-accessible back-to-top control is available on all four pages.

## Stable reading and navigation

The optional site-wide liquid design was withdrawn at the user's request on
2026-10-25. The original page palette and exhibit layouts are preserved; no
background canvas, liquid input listeners, or liquid controls are loaded.

Independent search/dialog improvements remain. Foreground entrance animations
stay disabled because restoring them on resume caused a verified 25px jump.
Native scrollbar-gutter reservation keeps menu open/close width stable.

Regression checks: `node tests/stable-layout.cjs` and `node tests/menu-ux.cjs`.
Browser checks are separate; source tests alone do not prove mobile correctness.
