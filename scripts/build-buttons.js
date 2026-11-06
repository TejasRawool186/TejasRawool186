const fs = require('fs');

const BG = '#0d1117';

function buildBtn(filename, width, label, iconSvg, glowColor = '#39d353') {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 44" width="${width}" height="44" role="img" aria-label="${label}">
<defs>
  <style>
    text { font-family: Inter, -apple-system, 'Segoe UI', Arial, sans-serif; }
    .btn-card {
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .btn-card:hover rect.btn-bg {
      stroke: ${glowColor};
      stroke-width: 1.5;
      filter: drop-shadow(0 0 8px ${glowColor}66);
    }
    .rise { animation: rise .8s ease-out both; }
    @keyframes rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</defs>
<rect width="${width}" height="44" fill="${BG}"/>
<g class="rise btn-card">
  <rect class="btn-bg" x="1" y="1" width="${width - 2}" height="42" rx="9" fill="#161b22" stroke="#30363d"/>
  ${iconSvg}
  <text x="${Math.round(width / 2 + 10)}" y="27" text-anchor="middle" font-size="13.5" font-weight="600" fill="#f0f6fc">${label}</text>
</g>
</svg>`;

  fs.writeFileSync(`assets/${filename}`, content);
  console.log(`Generated assets/${filename}`);
}

// 1. Portfolio: Modern Globe Vector
const portfolioIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#39d353" stroke-width="2"/><ellipse cx="12" cy="12" rx="4.5" ry="9" fill="none" stroke="#39d353" stroke-width="1.8"/><line x1="3" y1="12" x2="21" y2="12" stroke="#39d353" stroke-width="1.8"/></svg>`;
buildBtn('btn-portfolio.svg', 144, 'Portfolio', portfolioIcon, '#39d353');

// 2. LinkedIn: Official LinkedIn Logo Vector
const linkedinIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="#0A66C2"/></svg>`;
buildBtn('btn-linkedin.svg', 135, 'LinkedIn', linkedinIcon, '#0A66C2');

// 3. Email: Dual-tone Mail Envelope Vector
const emailIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335"/></svg>`;
buildBtn('btn-email.svg', 120, 'Email', emailIcon, '#EA4335');

// 4. DEV.to: Official DEV community logo
const devtoIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#000"/><path d="M7.5 16.5H5V7.5h2.5c1.4 0 2.5 1 2.5 2.5v4c0 1.5-1.1 2.5-2.5 2.5zm-1-1.5h1c.6 0 1-.4 1-1V10c0-.6-.4-1-1-1h-1v6zm5 1.5h3v-1.5h-1.5V13h1v-1.5h-1V10h1.5V8.5h-3v8zm4.5 0h1.5l1.5-5.5h-1.5l-.8 3.5-.8-3.5h-1.4l1.5 5.5z" fill="#FFF"/></svg>`;
buildBtn('btn-devto.svg', 120, 'DEV.to', devtoIcon, '#FFFFFF');

// 5. X: Official 𝕏 Glyph Vector
const xIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFF"/></svg>`;
buildBtn('btn-x.svg', 110, 'X', xIcon, '#FFFFFF');

// 6. Reddit: Official Reddit Snoo Icon
const redditIcon = `<svg x="18" y="13" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF4500"/><circle cx="12" cy="12" r="6" fill="#FFF"/><circle cx="9.5" cy="11.5" r="1.2" fill="#FF4500"/><circle cx="14.5" cy="11.5" r="1.2" fill="#FF4500"/><path d="M9.5 14.5c1.2.8 3.8.8 5 0" stroke="#FF4500" stroke-width="1.2" stroke-linecap="round" fill="none"/><circle cx="17.5" cy="7.5" r="1.2" fill="#FFF"/><line x1="12" y1="6" x2="16.5" y2="7.5" stroke="#FFF" stroke-width="1.2"/></svg>`;
buildBtn('btn-reddit.svg', 130, 'Reddit', redditIcon, '#FF4500');

console.log('All 6 buttons upgraded with official vector icons!');
