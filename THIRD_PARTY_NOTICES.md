# Third-party notices

## React Bits components


- Project: https://reactbits.dev
- Source: https://github.com/DavidHDev/react-bits
- Copyright (c) 2026 David Haz

Licensed under the MIT + Commons Clause License Condition v1.0. The full licence text follows.

```text
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software as part of
an application, website, or product, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, so long as you
do not sell, sublicense, or redistribute the components themselves, whether
alone, in a bundle, or as a ported version.

The same restriction covers the React Bits tools (Background Studio, Texture
Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the
sounds in the sound library. You may not sell, sublicense, or redistribute the
tools or the sounds themselves, or offer the tools or a substantially similar
copy of them as a hosted service, whether alone, in a bundle, or as a ported
version.

What you make with the tools is yours to use. You can use exported code, images,
videos, and audio files in any personal or commercial application, website, or
product, including paid ones. You may not sell or redistribute the exports on
their own, either individually or as the product itself, such as a sound,
texture, background, or template pack.

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Spline viewer and F1 scene

`f1.html` renders a Spline scene authored by the site owner in Spline (https://spline.design). `vendor/spline/spline-viewer.js` is the WebGL-only Spline Viewer build 2.0.151, self-hosted so the scene page keeps a same-origin CSP, and `vendor/spline/f1-scene.splinecode` is the owner's exported scene. The page fetches the viewer and scene only when a visitor opens it. The viewer keeps its "Made with Spline" credit badge. Spline and the Spline Viewer are copyright Spline, Inc. and are used under the Spline terms (https://spline.design/terms).

## Hugeicons

The AnimatedList lap pack renders its row icons with `@hugeicons/react` 1.1.10 and `@hugeicons/core-free-icons` 4.4.0 (https://hugeicons.com), both under the MIT licence. The packages are bundled into `animated-list.js`, and only the five icons used by the lap pack are pulled into the bundle.

## Uiverse cloud loader

The loading overlay in `loader.css` and `loader.js` is adapted from the Cloud Loader by andrew-manzyk (https://uiverse.io/andrew-manzyk/smart-ladybug-8), published under the MIT licence. Copyright (c) 2026 Andrew Manzyk. The full-screen overlay and loading label were added for this site.

## Uiverse send button

The round review send button in `src/pit-rating/PitRating.css` is adapted from a Uiverse.io snippet by catraco (https://uiverse.io/catraco). The colours and the arrow glyph were changed for this site.

## Lenis

The SmoothScroll island bundles Lenis 1.3.27 (https://github.com/darkroomengineering/lenis) under the MIT licence. Copyright (c) 2024 darkroom.engineering. The licence permits use, modification and distribution with the copyright notice retained.

## GSAP

The TextLoop, MaskedHeading and AnimatedContent islands bundle GSAP 3.15.1 (https://gsap.com) under the GSAP Standard "No Charge" License. The licence permits use in commercial projects but does not permit selling, sublicensing or redistributing GSAP itself. See https://gsap.com/standard-license/.

## ogl


This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

## Matter.js

The FallingText island bundles `matter-js` (https://brm.io/matter-js/) under the MIT licence. Copyright (c) 2014 Liam Brummitt and contributors.

## three.js

The PaperCrumple island bundles `three` (https://threejs.org) under the MIT licence. Copyright (c) 2010-2025 three.js authors.

## ShaderAnimation

The concertina-ring shader used by the loading overlay in `src/shader-animation/` was supplied as a React component for this site and is adapted to Preact and a raw WebGL2 draw. It is not part of the React Bits set above and pulls in no Three.js runtime.

## Self-hosted fonts

The site serves its own copies of three typefaces instead of requesting them from Google Fonts, so no visitor data is sent to a font provider.

- Barlow Condensed, weights 600, 700, 800 and 900. Copyright the Barlow Project Authors.
- Chakra Petch, weights 500, 600 and 700. Copyright the Chakra Petch Project Authors.
- Titillium Web, weights 400, 600 and 700. Copyright the Titillium Web Project Authors.

All three are licensed under the SIL Open Font License, Version 1.1. The full licence texts are stored with the font files:

- `fonts/OFL-Barlow-Condensed.txt`
- `fonts/OFL-Chakra-Petch.txt`
- `fonts/OFL-Titillium-Web.txt`

The font files in `fonts/` are unmodified WOFF2 builds of the upstream Google Fonts releases.