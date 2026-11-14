function renderShootingStars(height) {
  const cycle = 132;
  const count = 40;
  const eventSpacing = 3.2;
  let state = 731;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };

  // Spread each appearance across a shuffled set of launch zones so repeated
  // passes do not keep entering from the same point.
  const zones = Array.from({ length: count }, (_, i) => i);
  for (let i = zones.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [zones[i], zones[j]] = [zones[j], zones[i]];
  }

  const stars = zones.map((zone, index) => {
    const x = -42 + zone * (740 / (count - 1)) + (random() - 0.5) * 28;
    const y = -70 + random() * 22;
    const dx = 220 + random() * 100;
    const dy = 166 + random() * 38;
    const eventStart = 0.5 + index * eventSpacing;
    const moveEnd = eventStart + 2.35 + random() * 0.45;
    const fadeInEnd = eventStart + 0.25 + random() * 0.1;
    const fadeOutStart = eventStart + 1.65 + random() * 0.2;
    const fadeEnd = eventStart + 3.05 + random() * 0.35;
    const at = (seconds) => (seconds / cycle).toFixed(5);
    const brightness = (0.58 + random() * 0.26).toFixed(2);
    const trailLength = 58 + random() * 24;
    const tailX = (46 - trailLength).toFixed(1);
    const tailY = (46 - trailLength * 0.56).toFixed(1);
    const warm = random() < 0.5;
    const color = warm ? '#ffca72' : '#7dd3fc';
    const gradientId = warm ? 'comet-tail-gold' : 'comet-tail-blue';

    return `
  <g opacity="0">
    <animateTransform attributeName="transform" type="translate" values="${x.toFixed(1)} ${y.toFixed(1)}; ${x.toFixed(1)} ${y.toFixed(1)}; ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}; ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}" keyTimes="0;${at(eventStart)};${at(moveEnd)};1" dur="${cycle}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;0;${brightness};${brightness};0;0" keyTimes="0;${at(eventStart)};${at(fadeInEnd)};${at(fadeOutStart)};${at(fadeEnd)};1" dur="${cycle}s" repeatCount="indefinite"/>
    <circle cx="46" cy="46" r="3.2" fill="${color}" opacity=".28" filter="url(#comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" opacity=".18" filter="url(#comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="url(#${gradientId})" stroke-width="0.85" stroke-linecap="round"/>
    <circle cx="46" cy="46" r="1.2" fill="#ffffff"/>
  </g>`;
  }).join('');

  return `
  <defs>
    <clipPath id="comet-clip"><rect width="1000" height="${height}"/></clipPath>
    <linearGradient id="comet-tail-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffca72" stop-opacity="0"/><stop offset=".72" stop-color="#ffe3a8" stop-opacity=".38"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>
    <linearGradient id="comet-tail-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7dd3fc" stop-opacity="0"/><stop offset=".72" stop-color="#bae6fd" stop-opacity=".38"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>
    <filter id="comet-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <style>@media (prefers-reduced-motion: reduce) { .shooting-stars { display: none !important; } }</style>
  </defs>
  <g class="shooting-stars" clip-path="url(#comet-clip)">${stars}
  </g>`;
}

module.exports = { renderShootingStars };
