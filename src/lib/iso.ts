/**
 * A small drawing kit for the site's illustrations.
 * Scenes are built from boxes placed in space and shown in a shallow three-quarter view:
 * x runs across, y runs away from the viewer, z runs up.
 * Everything returns SVG markup as text, so a scene is assembled in order, back to front.
 */
export type Faces = [top: string, front: string, side: string];

export const MAT = {
  floor: ['#eae1cf', '#d9ccb7', '#c9bba3'],
  frame: ['#f8f3ea', '#dfd5c5', '#c2b5a1'],
  bench: ['#fdf9f1', '#e7ddcc', '#d0c3ad'],
  dark: ['#40352c', '#1d1814', '#0e0b09'],
  steel: ['#e3e8e4', '#bcc7c0', '#a2aea7'],
  copper: ['#e5ab8a', '#b0522a', '#6f2810'],
  green: ['#aac6b9', '#4d7a69', '#243f35'],
  part: ['#cf7d53', '#8d3514', '#4a1a09'],
  cart: ['#efe8da', '#d6ccb9', '#bdb19c'],
  paper: ['#fffdf9', '#f1e9dc', '#ddd2c0'],
} satisfies Record<string, Faces>;

const f1 = (v: number) => v.toFixed(1);
const EDGE = 'stroke="rgba(22,19,16,.3)" stroke-width=".7" stroke-linejoin="round"';

export function makeIso(kx: number, ky: number, base: number) {
  /** A point in space, as numbers on the page. */
  const xy = (x: number, y: number, z: number): [number, number] => [x + y * kx, base - z - y * ky];
  /** A point in space, as text for a path. */
  const P = (x: number, y: number, z: number) => xy(x, y, z).map(f1).join(' ');
  const shape = (pts: string[], fill: string, extra = EDGE) => `<path d="M${pts.join('L')}Z" fill="${fill}" ${extra}/>`;
  const top = (x: number, y: number, z: number, w: number, d: number) => [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)];
  const front = (x: number, y: number, z: number, w: number, h: number) => [P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)];
  const side = (x: number, y: number, z: number, d: number, h: number) => [P(x, y, z), P(x, y + d, z), P(x, y + d, z + h), P(x, y, z + h)];
  /** A box with its three visible faces. */
  const box = (x: number, y: number, z: number, w: number, d: number, h: number, [t, f, s]: Faces) =>
    shape(side(x + w, y, z, d, h), s) + shape(top(x, y, z + h, w, d), t) + shape(front(x, y, z, w, h), f);
  /** A soft shadow on the floor under something. */
  const shadow = (x: number, y: number, w: number, d: number, strength = 0.09) =>
    shape(top(x - 3, y - 5, 0.1, w + 12, d + 12), '#161310', `opacity="${strength}"`);
  return { xy, P, shape, top, front, side, box, shadow };
}

/**
 * The operator: a standing figure seen from the side, reaching to the right.
 * (x, y) is where the feet stand on the page. `s` is the scale; the figure is about 140 units tall at s = 1.
 * With `live`, the two wearables pulse while a visitor is in the figure (styles in figures.css).
 */
export function operator(x: number, y: number, s = 1, { live = false, shirt = '#8d3514', shirtDark = '#6f2810' } = {}) {
  const pulse = live
    ? '<circle class="op-pulse xlive" cx="30.2" cy="-89" r="5"/><circle class="op-pulse xlive is-late" cx="14.5" cy="-97" r="5"/>'
    : '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
<ellipse cx="3" cy="1" rx="17" ry="4.2" fill="rgba(22,19,16,.17)"/>
<path d="M-8.5 -58L-9 -3Q-9 0-6 0H-1V-58Z M1 -58V0H6Q9 0 9 -3L8.5 -58Z" fill="#211b16"/>
<path d="M-10 -105L-13.5 -86" fill="none" stroke="${shirtDark}" stroke-width="8" stroke-linecap="round"/>
<path d="M-13.8 -84L-12.5 -66" fill="none" stroke="#dcc6ac" stroke-width="5.4" stroke-linecap="round"/>
<path d="M-13 -104Q-13 -113-5 -113H5Q13 -113 13 -104L11 -55Q11 -51 7 -51H-7Q-11 -51-11 -55Z" fill="${shirt}"/>
<path d="M-5 -113L0 -106L5 -113Z" fill="#e5ab8a"/>
<g class="op-arm${live ? ' xlive' : ''}">
<path d="M9 -105L19 -88" fill="none" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/>
<path d="M20 -87L37 -89" fill="none" stroke="#efdcc6" stroke-width="6" stroke-linecap="round"/>
<circle cx="40" cy="-89" r="4.2" fill="#efdcc6"/>
<rect x="27" y="-93.5" width="6.5" height="9" rx="2" fill="#211b16"/>
<circle cx="30.2" cy="-89" r="1.9" fill="#f4b58a"/>
</g>
<circle cx="14.5" cy="-97" r="1.9" fill="#f4b58a"/>
${pulse}
<rect x="-3" y="-119" width="6" height="8" fill="#efdcc6"/>
<circle cx="0" cy="-127" r="11" fill="#efdcc6" stroke="rgba(22,19,16,.3)" stroke-width=".7"/>
<path d="M-11.6 -121Q-14 -140.5 0 -140.5Q14 -140.5 11.6 -121Q11.4 -117 9.6 -115.5Q10.6 -128 3 -131.5Q-5.5 -132.5-8.8 -125Q-9.8 -120-9.4 -115.5Q-11.4 -117-11.6 -121Z" fill="#211b16"/>
</g>`;
}
