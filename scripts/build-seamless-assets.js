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
  return `
  <path d="M120 40 l -34 18" stroke="#8b949e" stroke-width=".8" opacity="0">
    <animateTransform attributeName="transform" type="translate" values="0 0; 160 84" dur="7.5s" begin="-1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;.55;0" dur="7.5s" begin="-1.5s" repeatCount="indefinite"/>
  </path>
  <path d="M780 70 l -34 18" stroke="#8b949e" stroke-width=".8" opacity="0">
    <animateTransform attributeName="transform" type="translate" values="0 0; 160 84" dur="10.0s" begin="-5.0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;.55;0" dur="10.0s" begin="-5.0s" repeatCount="indefinite"/>
  </path>`;
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
  <clipPath id="avatarClip">
    <circle cx="155" cy="125" r="72"/>
  </clipPath>
  <style>
    text { font-family: Inter, -apple-system, 'Segoe UI', Arial, sans-serif; }
    .rise { animation: rise .8s ease-out both; }
    @keyframes rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .rise { animation: none !important; } }
  </style>
</defs>

<!-- Uniform Seamless Background -->
<rect width="${W}" height="${H}" fill="${BG}"/>

<!-- Starry Night Background -->
${stars}
${shootingStars}

<!-- Avatar Section -->
<g class="rise">
  <circle cx="155" cy="125" r="80" fill="#161b22" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="155" cy="125" r="75" fill="none" stroke="#39d353" stroke-width="2"/>
  <image href="${avatarBase64}" x="83" y="53" width="144" height="144" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)"/>
</g>

<!-- Subtle Divider Line -->
<path d="M265 40 V210" stroke="#30363d" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>

<!-- Main Details — Pure White Name & Clean Typography -->
<g class="rise" style="animation-delay: 0.1s;">
  <!-- Username Handle -->
  <text x="290" y="68" font-size="13" font-weight="600" letter-spacing="1.5" fill="#8b949e">@tejasrawool186</text>

  <!-- Name — Completely White -->
  <text x="288" y="122" font-size="48" font-weight="800" letter-spacing="-1.2" fill="#ffffff">Tejas Rawool</text>

  <!-- Role Title -->
  <text x="290" y="160" font-size="19" font-weight="600" fill="#f0f6fc">Full Stack Developer <tspan fill="#39d353">&amp;</tspan> AI Engineer</text>
  
  <!-- Bio -->
  <text x="290" y="190" font-size="13.5" fill="#8b949e">Architecting scalable web platforms, agentic AI workflows, and modern cloud applications.</text>
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

console.log('build-seamless-assets configured.');
