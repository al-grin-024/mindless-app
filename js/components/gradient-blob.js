/**
 * Mindless — Gradient Blobs
 * Decorative, soft, organic background shapes that extend past the viewport
 * and drift gently. Exposes:
 *   - <gradient-blob> custom element (single blob via attributes)
 *   - blobField(variant) helper returning a ready-to-append blob layer
 */

/** Build a fixed full-screen layer of drifting blobs. */
export function blobField(variant = 'default') {
  const layer = document.createElement('div');
  layer.className = 'blob-field';

  // [class, size, top, left/right, anim, duration]
  const presets = {
    default: [
      ['blob--peach',    '60vw', '-12vh', 'left:-18vw',  'blobDrift',    '16s'],
      ['blob--lavender', '55vw', '22vh',  'right:-20vw', 'blobDriftAlt', '19s'],
      ['blob--mint',     '50vw', '62vh',  'left:-12vw',  'blobDrift',    '21s'],
      ['blob--yellow',   '42vw', '78vh',  'right:-8vw',  'blobDriftAlt', '14s'],
    ],
    welcome: [
      ['blob--peach',    '70vw', '-18vh', 'left:-24vw',  'blobDrift',    '17s'],
      ['blob--lavender', '60vw', '30vh',  'right:-26vw', 'blobDriftAlt', '20s'],
      ['blob--mint',     '55vw', '68vh',  'left:-18vw',  'blobDrift',    '15s'],
      ['blob--yellow',   '45vw', '85vh',  'right:-10vw', 'blobDriftAlt', '13s'],
    ],
    confirm: [
      ['blob--peach',    '60vw', '8vh',   'left:-10vw',  'blobDissolve', '3.4s'],
      ['blob--lavender', '55vw', '30vh',  'right:-14vw', 'blobDissolve', '3.4s'],
      ['blob--mint',     '50vw', '55vh',  'left:6vw',    'blobDissolve', '3.4s'],
      ['blob--yellow',   '40vw', '20vh',  'right:8vw',   'blobDissolve', '3.4s'],
    ],
  };

  (presets[variant] || presets.default).forEach(([cls, size, top, side, anim, dur], i) => {
    const b = document.createElement('div');
    b.className = `blob ${cls}`;
    b.style.cssText =
      `width:${size};height:${size};top:${top};${side};` +
      `animation:${anim} ${dur} ease-in-out infinite;animation-delay:${i * -2}s;`;
    layer.appendChild(b);
  });

  return layer;
}

/** <gradient-blob color size top left right bottom opacity animation> */
class GradientBlob extends HTMLElement {
  connectedCallback() {
    const g = (a, d = '') => this.getAttribute(a) ?? d;
    const color = g('color', '#FFD6C9');
    this.style.cssText = [
      'position:absolute',
      `width:${g('size', '240px')}`,
      `height:${g('size', '240px')}`,
      g('top')    ? `top:${g('top')}`       : '',
      g('left')   ? `left:${g('left')}`     : '',
      g('right')  ? `right:${g('right')}`   : '',
      g('bottom') ? `bottom:${g('bottom')}` : '',
      `background:radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
      'border-radius:50% 40% 60% 30%',
      'filter:blur(60px)',
      `opacity:${g('opacity', '0.5')}`,
      'pointer-events:none',
      g('animation') ? `animation:${g('animation')}` : 'animation:blobDrift 16s ease-in-out infinite',
    ].filter(Boolean).join(';');
  }
}
customElements.define('gradient-blob', GradientBlob);
