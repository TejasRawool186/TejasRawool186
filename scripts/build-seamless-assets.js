const fs = require('fs');
const path = require('path');

// Extract avatar from banner.svg if avatar-base64.txt not present
let avatarBase64 = '';
if (fs.existsSync('assets/avatar-base64.txt')) {
  avatarBase64 = fs.readFileSync('assets/avatar-base64.txt', 'utf8').trim();
} else {
  const banner = fs.readFileSync('assets/banner.svg', 'utf8');
  const m = banner.match(/<image\s+href="([^"]+)"/);
  if (m) avatarBase64 = m[1];
}

const BG = '#0d1117'; // GitHub native dark mode background

// Continuous Starfield Generator
function generateStars(count, width, height, seed = 42) {
  let s = '';
  let state = seed;
  const rnd = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    const x = (rnd() * (width - 40) + 20).toFixed(1);
    const y = (rnd() * (height - 40) + 20).toFixed(1);
    const r = (0.4 + rnd() * 0.7).toFixed(1);
    const op = (0.2 + rnd() * 0.45).toFixed(2);
    const dur = (3.2 + rnd() * 3.8).toFixed(1);
    const delay = (-rnd() * 6).toFixed(1);
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9d1d9" opacity="${op}"><animate attributeName="opacity" values="${op};${(parseFloat(op) + 0.25).toFixed(2)};${op}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
  }
  return s;
}

function generateShootingStars() {
  const cycle = 128;
  const starSlots = 10;
  const passesPerSlot = 4;
  const count = starSlots * passesPerSlot;
  const eventSpacing = 3;
  const eventOffset = 1;
  let state = 731;
  const rnd = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };

  // Shuffle evenly spaced launch zones so each appearance starts somewhere new
  // while the full sequence still covers the entire banner.
  const zones = Array.from({ length: count }, (_, i) => i);
  for (let i = zones.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [zones[i], zones[j]] = [zones[j], zones[i]];
  }

  const gradients = [];
  const instances = Array.from({ length: count }, (_, i) => {
    const zone = zones[i];
    const x = -48 + zone * (930 / (count - 1)) + (rnd() - 0.5) * 42;
    const y = -14 + rnd() * 32;
    const dx = 258 + rnd() * 58;
    const dy = 176 + rnd() * 28;
    const eventStart = eventOffset + i * eventSpacing;
    const moveEnd = eventStart + 2.15 + rnd() * 0.45;
    const fadeInStart = Math.max(0, eventStart - 0.35);
    const fadeInEnd = eventStart + 0.2 + rnd() * 0.1;
    const fadeOutStart = eventStart + 1.9;
    const fadeEnd = eventStart + 2.75;
    const at = (seconds) => (seconds / cycle).toFixed(5);
    const brightness = (0.68 + rnd() * 0.24).toFixed(2);
    const trailLength = 58 + rnd() * 24;
    const tailX = (46 - trailLength).toFixed(1);
    const tailY = (46 - trailLength * 0.56).toFixed(1);
    const warm = rnd() < 0.5;
    const color = warm ? '#ffca72' : '#7dd3fc';
    const midColor = warm ? '#ffe3a8' : '#bae6fd';
    const gradientId = `comet-tail-${i}`;

    gradients.push(`<linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset=".72" stop-color="${midColor}" stop-opacity=".38"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>`);

    return `
  <g opacity="0">
    <animateTransform attributeName="transform" type="translate" values="${x.toFixed(1)} ${y.toFixed(1)}; ${x.toFixed(1)} ${y.toFixed(1)}; ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}; ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}" keyTimes="0;${at(eventStart)};${at(moveEnd)};1" dur="${cycle}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;0;${brightness};${brightness};0;0" keyTimes="0;${at(fadeInStart)};${at(fadeInEnd)};${at(fadeOutStart)};${at(fadeEnd)};1" dur="${cycle}s" repeatCount="indefinite"/>
    <circle cx="46" cy="46" r="3.2" fill="${color}" opacity=".28" filter="url(#comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" opacity=".18" filter="url(#comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="url(#${gradientId})" stroke-width="0.85" stroke-linecap="round"/>
    <circle cx="46" cy="46" r="1.2" fill="#ffffff"/>
  </g>`;
  }).join('');

  return `
  <defs>
    <clipPath id="sky-clip"><rect width="1000" height="250"/></clipPath>
    ${gradients.join('\n    ')}
    <filter id="comet-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
  </defs>
  <g class="shooting-stars" clip-path="url(#sky-clip)">${instances}
  </g>`;
}

// -------------------------------------------------------------
// 1. BANNER.SVG — Clean, No Pills, Pure White Name
// -------------------------------------------------------------
function buildBanner() {
  const W = 1000;
  const H = 250;
  const stars = generateStars(50, W, H, 101);
  const shootingStars = generateShootingStars();

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tejas Rawool — Full Stack Developer and AI Engineer">
<defs>
  <style>
    text { font-family: Inter, -apple-system, 'Segoe UI', Arial, sans-serif; }
    .rise { animation: rise .8s ease-out both; }
    @keyframes rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .rise { animation: none !important; } .shooting-stars { display: none !important; } }
  </style>
</defs>

<!-- Uniform Seamless Background -->
<rect width="${W}" height="${H}" fill="${BG}"/>

<!-- Starry Night Background -->
${stars}
${shootingStars}

<!-- Centered Typography & Hero Details (Pure White Name) -->
<g class="rise" style="animation-delay: 0.1s;">
  <!-- Username Handle -->
  <text x="500" y="66" text-anchor="middle" font-size="13.5" font-weight="600" letter-spacing="1.8" fill="#8b949e">@tejasrawool186</text>

  <!-- Name — Completely White -->
  <text x="500" y="122" text-anchor="middle" font-size="52" font-weight="800" letter-spacing="-1.2" fill="#ffffff">Tejas Rawool</text>

  <!-- Role Title -->
  <text x="500" y="164" text-anchor="middle" font-size="20" font-weight="600" fill="#f0f6fc">Full Stack Developer <tspan fill="#39d353">&amp;</tspan> AI Engineer</text>
  
  <!-- Bio -->
  <text x="500" y="196" text-anchor="middle" font-size="14.5" fill="#8b949e">Architecting scalable web platforms, agentic AI workflows, and modern cloud applications.</text>
</g>
</svg>`;
}

// -------------------------------------------------------------
// 2. STACK.SVG — Seamless Uniform Background
// -------------------------------------------------------------
function buildStack() {
  // Read existing stack.svg content
  return fs.readFileSync('assets/stack.svg', 'utf8');
}

// -------------------------------------------------------------
// 3. CITY.SVG — 3D Grid Platform with Laser Beam & Headings
// -------------------------------------------------------------
function buildCity() {
  // Read raw data from existing city.svg or test-city-render
  return fs.readFileSync('assets/city.svg', 'utf8');
}

// -------------------------------------------------------------
// 4. FOOTER.SVG — Seamless Terminal Pill
// -------------------------------------------------------------
function buildFooter() {
  return fs.readFileSync('assets/footer.svg', 'utf8');
}

fs.writeFileSync('assets/banner.svg', buildBanner());
console.log('Built assets/banner.svg (centered hero without avatar).');
