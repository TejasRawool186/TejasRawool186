const WIDTH = 1000;
const CYCLE_SECONDS = 188;
const STAR_COUNT = 40;
const EVENT_SPACING = 4.4;
const EVENT_OFFSET = 0.6;
const START_Y = -72;
const END_Y = 1170;
const FLIGHT_SECONDS = 9.5;
// Shared 1000px-wide README coordinates, including the social-link row gap.
const SECTION_OFFSETS = Object.freeze({ banner: 0, stack: 322, city: 684, footer: 1046 });

function renderShootingStars(sectionOffset, sectionHeight) {
  let state = 731;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };

  const launchZones = Array.from({ length: STAR_COUNT }, (_, i) => i);
  for (let i = launchZones.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [launchZones[i], launchZones[j]] = [launchZones[j], launchZones[i]];
  }

  const stars = launchZones.map((zone, index) => {
    const x = -48 + zone * (900 / (STAR_COUNT - 1)) + (random() - 0.5) * 26;
    const y = START_Y - sectionOffset;
    const dx = Math.min(210 + random() * 100, 958 - x);
    const endX = x + dx;
    const endY = END_Y - sectionOffset;
    const eventStart = EVENT_OFFSET + index * EVENT_SPACING;
    const fadeInEnd = eventStart + 0.45 + random() * 0.2;
    const fadeOutStart = eventStart + 6.4;
    const fadeEnd = eventStart + 8.95 + random() * 0.45;
    const moveEnd = eventStart + FLIGHT_SECONDS;
    const at = (seconds) => (seconds / CYCLE_SECONDS).toFixed(5);
    const brightness = (0.58 + random() * 0.26).toFixed(2);
    const trailLength = 58 + random() * 24;
    const tailX = (46 - trailLength).toFixed(1);
    const tailY = (46 - trailLength * 0.56).toFixed(1);
    const warm = random() < 0.5;
    const color = warm ? '#ffca72' : '#7dd3fc';
    const gradientId = warm ? 'shared-comet-tail-gold' : 'shared-comet-tail-blue';

    return `
  <g opacity="0">
    <animateTransform attributeName="transform" type="translate" values="${x.toFixed(1)} ${y.toFixed(1)}; ${x.toFixed(1)} ${y.toFixed(1)}; ${endX.toFixed(1)} ${endY.toFixed(1)}; ${endX.toFixed(1)} ${endY.toFixed(1)}" keyTimes="0;${at(eventStart)};${at(moveEnd)};1" dur="${CYCLE_SECONDS}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;0;${brightness};${brightness};0;0" keyTimes="0;${at(eventStart)};${at(fadeInEnd)};${at(fadeOutStart)};${at(fadeEnd)};1" dur="${CYCLE_SECONDS}s" repeatCount="indefinite"/>
    <circle cx="46" cy="46" r="3.2" fill="${color}" opacity=".28" filter="url(#shared-comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" opacity=".18" filter="url(#shared-comet-glow)"/>
    <path d="M46 46 L${tailX} ${tailY}" fill="none" stroke="url(#${gradientId})" stroke-width="0.85" stroke-linecap="round"/>
    <circle cx="46" cy="46" r="1.2" fill="#ffffff"/>
  </g>`;
  }).join('');

  return `
  <defs>
    <clipPath id="shared-comet-clip"><rect width="${WIDTH}" height="${sectionHeight}"/></clipPath>
    <linearGradient id="shared-comet-tail-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffca72" stop-opacity="0"/><stop offset=".72" stop-color="#ffe3a8" stop-opacity=".38"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>
    <linearGradient id="shared-comet-tail-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7dd3fc" stop-opacity="0"/><stop offset=".72" stop-color="#bae6fd" stop-opacity=".38"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>
    <filter id="shared-comet-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <style>@media (prefers-reduced-motion: reduce) { .shooting-stars { display: none !important; } }</style>
  </defs>
  <g class="shooting-stars" clip-path="url(#shared-comet-clip)">${stars}
  </g>`;
}

module.exports = { renderShootingStars, SECTION_OFFSETS };
