const fs = require('fs');
const path = require('path');
const { renderShootingStars } = require('./shooting-stars');

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

function removeProfileStars(svg) {
  return svg.replace(/<!-- PROFILE STARS START -->[\s\S]*?<!-- PROFILE STARS END -->\r?\n?/g, '');
}

// -------------------------------------------------------------
// 1. BANNER.SVG — Clean, No Pills, Pure White Name
// -------------------------------------------------------------
function buildBanner() {
  const W = 1000;
  const H = 250;
  const stars = generateStars(50, W, H, 101);
  const shootingStars = renderShootingStars(H);

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
  const svg = fs.readFileSync('assets/stack.svg', 'utf8');
  return removeProfileStars(svg);
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
  const svg = fs.readFileSync('assets/footer.svg', 'utf8');
  return removeProfileStars(svg);
}

fs.writeFileSync('assets/banner.svg', buildBanner());
fs.writeFileSync('assets/stack.svg', buildStack());
fs.writeFileSync('assets/footer.svg', buildFooter());
console.log('Built banner stars and restored static stack/footer backgrounds.');
