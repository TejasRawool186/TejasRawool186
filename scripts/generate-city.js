#!/usr/bin/env node
/**
 * generate-city.js — turns your GitHub contribution calendar into an animated
 * 3D isometric "contribution city" SVG (assets/city.svg) matching the dark cyberpunk
 * grid platform with individual 3D pillar boxes, distinct grid tiles, and laser beam.
 *
 *   node scripts/generate-city.js            -> uses GH_USER or "tejasrawool186"
 *   GH_USER=someone node scripts/generate-city.js
 */
const fs = require('fs');
const path = require('path');

const USER = process.env.GH_USER || 'tejasrawool186';
const OUT = process.env.OUT || path.join(__dirname, '..', 'assets', 'city.svg');

// ---------- 1. read the public contribution calendar ----------
async function fetchCalendar(user) {
  const res = await fetch(`https://github.com/users/${user}/contributions`, {
    headers: { 'user-agent': 'Mozilla/5.0 (contribution-city)' },
  });
  if (!res.ok) throw new Error(`GitHub returned HTTP ${res.status}`);
  const html = await res.text();

  const counts = {};
  const tipRe = /<tool-tip[^>]*\sfor="([^"]+)"[^>]*>\s*([^<]*?)\s*</g;
  let m;
  while ((m = tipRe.exec(html))) {
    const n = /^(\d+)\s+contribution/i.exec(m[2]);
    counts[m[1]] = n ? parseInt(n[1], 10) : 0;
  }

  const cells = [];
  const tdRe = /<td\b[^>]*ContributionCalendar-day[^>]*>/g;
  while ((m = tdRe.exec(html))) {
    const tag = m[0];
    const id = /\sid="(contribution-day-component-(\d+)-(\d+))"/.exec(tag);
    const date = /data-date="([^"]+)"/.exec(tag);
    const level = /data-level="(\d)"/.exec(tag);
    if (!id || !date || !level) continue;
    const lv = parseInt(level[1], 10);
    cells.push({
      row: parseInt(id[2], 10),
      col: parseInt(id[3], 10),
      date: date[1],
      level: lv,
      count: id[1] in counts ? counts[id[1]] : [0, 2, 5, 9, 14][lv],
    });
  }
  if (!cells.length) throw new Error('No contribution cells found');
  return cells;
}

// ---------- 2. tiny seeded RNG for stable stars ----------
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ---------- 3. draw ----------
const PAL = [
  { top: '#16201a', stroke: '#070d09' },
  { top: '#0e4429', front: '#092d1b', right: '#051c11', stroke: '#031209', highlight: '#1b633d' },
  { top: '#006d32', front: '#004d23', right: '#003317', stroke: '#00220e', highlight: '#198744' },
  { top: '#26a641', front: '#145f25', right: '#0c3f19', stroke: '#07240e', highlight: '#42c75f' },
  { top: '#39d353', front: '#1f7d2f', right: '#13521f', stroke: '#0c3514', highlight: '#7ee787' }
];

function render(cells) {
  const W = 1000, H = 340;
  const BG = '#0d1117';

  const A = 16.5;   // horizontal step per week
  const S = 12.0;   // sideways lean per weekday
  const D = 12.0;   // vertical step per weekday
  const MAXH = 88;

  const maxCol = Math.max(...cells.map(c => c.col));
  const maxCount = Math.max(1, ...cells.map(c => c.count));
  const heightOf = (c) =>
    c.level === 0 ? 0 : Math.min(MAXH, 10 + Math.pow(c.count, 0.72) * (MAXH - 10) / Math.pow(maxCount, 0.72));

  const cityW = maxCol * A + 6 * S;
  const ox = (W - cityW) / 2 + 6 * S;
  const oy = 170;

  const P = (c, r) => [ox + c * A - r * S, oy + r * D];
  const f = (n) => Math.round(n * 10) / 10;
  const pts = (arr) => arr.map(p => `${f(p[0])},${f(p[1])}`).join(' ');

  // painter's order: back (small row) to front, west to east
  const ordered = [...cells].sort((a, b) => a.row - b.row || a.col - b.col);

  let citySvg = '';
  for (const c of ordered) {
    const p00 = P(c.col, c.row);
    const p10 = P(c.col + 1, c.row);
    const p01 = P(c.col, c.row + 1);
    const p11 = P(c.col + 1, c.row + 1);

    const cx = f((p00[0] + p11[0]) / 2);
    const cy = f((p00[1] + p11[1]) / 2);
    const delay = (c.col * 0.022 + c.row * 0.035).toFixed(2);
    const titleText = `${c.date || `Week ${c.col + 1}`}: ${c.count || 0} contributions`;

    if (c.level === 0) {
      citySvg += `<g class="cell-tile rise" style="transform-origin:${cx}px ${cy}px;animation-delay:${delay}s">` +
        `<title>${titleText}</title>` +
        `<polygon points="${pts([p00, p10, p11, p01])}" fill="${PAL[0].top}" stroke="${PAL[0].stroke}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `</g>`;
    } else {
      const h = heightOf(c);
      const pal = PAL[c.level];
      const up = (p) => [p[0], p[1] - h];

      citySvg += `<g class="cell-pillar rise" style="transform-origin:${cx}px ${cy}px;animation-delay:${delay}s">` +
        `<title>${titleText}</title>` +
        // Ground footprint
        `<polygon points="${pts([p00, p10, p11, p01])}" fill="#0b130e" stroke="${PAL[0].stroke}" stroke-width="1.2"/>` +
        // Front face
        `<polygon points="${pts([p01, p11, up(p11), up(p01)])}" fill="${pal.front}" stroke="${pal.stroke}" stroke-width="0.8" stroke-linejoin="round"/>` +
        // Right face
        `<polygon points="${pts([p10, p11, up(p11), up(p10)])}" fill="${pal.right}" stroke="${pal.stroke}" stroke-width="0.8" stroke-linejoin="round"/>` +
        // Top roof face with highlight border
        `<polygon points="${pts([up(p00), up(p10), up(p11), up(p01)])}" fill="${pal.top}" stroke="${pal.highlight}" stroke-width="0.7" stroke-linejoin="round"/>` +
        `</g>`;
    }
  }

  // 3D Platform Slab along front edge (row 7)
  const pFrontLeft = P(0, 7);
  const pFrontRight = P(maxCol, 7);
  const slabDepth = 8;
  const slabPoints = pts([
    pFrontLeft,
    pFrontRight,
    [pFrontRight[0], pFrontRight[1] + slabDepth],
    [pFrontLeft[0], pFrontLeft[1] + slabDepth]
  ]);

  // 3D Platform Left Bevel
  const pBackLeft = P(0, 0);
  const leftBevel = pts([
    pBackLeft,
    pFrontLeft,
    [pFrontLeft[0], pFrontLeft[1] + slabDepth],
    [pBackLeft[0], pBackLeft[1] + slabDepth]
  ]);

  // Background Stars
  const R = rng(186);
  let stars = '';
  for (let i = 0; i < 48; i++) {
    const sx = f(R() * (W - 40) + 20);
    const sy = f(R() * 150 + 15);
    const sr = f(0.4 + R() * 0.7);
    const op = (0.2 + R() * 0.5).toFixed(2);
    stars += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#c9d1d9" opacity="${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Contribution City 3D for ${USER}">
<defs>
  <linearGradient id="lineGradLeft" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#39d353" stop-opacity="0"/>
    <stop offset="100%" stop-color="#39d353" stop-opacity="0.9"/>
  </linearGradient>
  <linearGradient id="lineGradRight" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#39d353" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#39d353" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#39d353" stop-opacity="0.1"/>
    <stop offset="30%" stop-color="#39d353" stop-opacity="0.85"/>
    <stop offset="50%" stop-color="#7ee787" stop-opacity="1"/>
    <stop offset="70%" stop-color="#39d353" stop-opacity="0.85"/>
    <stop offset="100%" stop-color="#39d353" stop-opacity="0.1"/>
  </linearGradient>
  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
  <style>
    text { font-family: Inter, -apple-system, 'Segoe UI', Arial, sans-serif; }
    .rise { animation: rise 0.85s cubic-bezier(0.2, 0.9, 0.3, 1.1) backwards; }
    @keyframes rise { from { transform: scaleY(0.05); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
    .cell-pillar, .cell-tile { transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer; }
    .cell-pillar:hover {
      filter: drop-shadow(0 0 10px #39d353) brightness(1.3);
    }
    .cell-tile:hover polygon {
      fill: #1f3325 !important;
      stroke: #39d353 !important;
    }
    .laser-pulse {
      animation: sweep 6s ease-in-out infinite alternate;
    }
    @keyframes sweep {
      0% { transform: translateX(0px); opacity: 0.4; }
      50% { opacity: 1; }
      100% { transform: translateX(${f(pFrontRight[0] - pFrontLeft[0])}px); opacity: 0.4; }
    }
    @media (prefers-reduced-motion: reduce) {
      .rise { animation: none !important; }
      .laser-pulse { animation: none !important; }
    }
  </style>
</defs>

<!-- Uniform Seamless Background -->
<rect width="${W}" height="${H}" fill="${BG}"/>

<!-- Twinkling Space Background -->
${stars}

<!-- Header: ─── ✦ Contribution City ✦ ─── -->
<g>
  <!-- Left Neon Line -->
  <line x1="220" y1="52" x2="350" y2="52" stroke="url(#lineGradLeft)" stroke-width="1.8"/>
  <text x="365" y="57" font-size="14" fill="#39d353" text-anchor="middle">✦</text>

  <!-- Title Text -->
  <text x="500" y="60" text-anchor="middle" font-size="24" font-weight="800" fill="#ffffff" letter-spacing="1">
    Contribution <tspan fill="#39d353">City</tspan>
  </text>

  <!-- Right Neon Line -->
  <text x="635" y="57" font-size="14" fill="#39d353" text-anchor="middle">✦</text>
  <line x1="650" y1="52" x2="780" y2="52" stroke="url(#lineGradRight)" stroke-width="1.8"/>
</g>

<!-- 3D Platform Left Bevel -->
<polygon points="${leftBevel}" fill="#0b100d" stroke="#060b08" stroke-width="1"/>

<!-- 3D City Floor & Pillars -->
<g>
  ${citySvg}
</g>

<!-- 3D Platform Front Slab Edge -->
<polygon points="${slabPoints}" fill="#111813" stroke="#1c2820" stroke-width="1"/>

<!-- Neon Laser Horizon Line on Bottom Edge -->
<line x1="${f(pFrontLeft[0])}" y1="${f(pFrontLeft[1] + slabDepth)}" x2="${f(pFrontRight[0])}" y2="${f(pFrontRight[1] + slabDepth)}" stroke="url(#laserBeam)" stroke-width="2" filter="url(#neonGlow)"/>

<!-- Moving Laser Pulse Dot -->
<g transform="translate(${f(pFrontLeft[0])}, ${f(pFrontLeft[1] + slabDepth)})">
  <circle class="laser-pulse" cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#39d353" stroke-width="2" filter="url(#neonGlow)"/>
</g>

</svg>
`;
}

(async () => {
  try {
    const cells = await fetchCalendar(USER);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, render(cells));
    console.log(`city written: ${OUT} (${cells.length} days)`);
  } catch (e) {
    console.warn('city generation: live fetch failed (' + e.message + '), checking existing city.svg');
    if (fs.existsSync(OUT)) {
      console.log('kept existing ' + OUT);
    } else {
      process.exit(1);
    }
  }
})();
