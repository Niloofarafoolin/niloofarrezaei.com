/**
 * Deterministic synthetic traces for the research-system figure on the home page.
 * They illustrate the idea only. They are not study data.
 *
 * All charts share one time axis (0 to TL.width) so they line up as a synchronized timeline.
 */

export const TL = {
  width: 600,
  /** Window in which the camera view is blocked. */
  occlusionStart: 250,
  occlusionEnd: 340,
  /** Moment the whole uncertainty band has cleared the threshold. */
  act: 366,
  threshold: 0.5,
} as const;

const pct = (x: number) => `${((x / TL.width) * 100).toFixed(2)}%`;

/** Horizontal positions as percentages, for HTML overlays that sit on top of the stretched SVGs. */
export const marks = {
  occlusionLeft: pct(TL.occlusionStart),
  occlusionWidth: pct(TL.occlusionEnd - TL.occlusionStart),
  occlusionCenter: pct((TL.occlusionStart + TL.occlusionEnd) / 2),
  act: pct(TL.act),
} as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const bump = (center: number, spread: number, x: number) =>
  Math.exp(-((x - center) ** 2) / (2 * spread * spread));
const round = (n: number) => Math.round(n * 10) / 10;
const toY = (v: number, height: number, pad: number) =>
  round(pad + (1 - clamp01(v)) * (height - 2 * pad));

type Point = [number, number];
const toPath = (points: Point[]) =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${y}`).join(' ');

/** Slow physiological arousal that drifts upward, with small phasic bumps. */
export function wearablePath(height: number) {
  const rnd = mulberry32(11);
  const points: Point[] = [];
  for (let x = 0; x <= TL.width; x += 4) {
    const v =
      0.14 +
      0.58 * smooth(200, 430, x) +
      0.06 * Math.sin(x / 23) +
      0.035 * Math.sin(x / 7.3 + 1) +
      0.1 * bump(118, 11, x) +
      0.13 * bump(304, 13, x) +
      0.1 * bump(378, 10, x) +
      0.07 * bump(512, 12, x) +
      (rnd() - 0.5) * 0.04;
    points.push([x, toY(v, height, 4)]);
  }
  return toPath(points);
}

/** Vision-derived strain score. It is missing while the camera view is blocked. */
export function cameraPaths(height: number) {
  const rnd = mulberry32(29);
  const before: Point[] = [];
  const after: Point[] = [];
  for (let x = 0; x <= TL.width; x += 4) {
    const v =
      0.2 +
      0.46 * smooth(230, 420, x) +
      0.11 * Math.sin(x / 15) +
      0.055 * Math.sin(x / 5.1 + 2) +
      (rnd() - 0.5) * 0.07;
    const point: Point = [x, toY(v, height, 4)];
    if (x <= TL.occlusionStart) before.push(point);
    else if (x >= TL.occlusionEnd) after.push(point);
  }
  return { before: toPath(before), after: toPath(after) };
}

/** One tick per completed cycle. Taller and sparser ticks mean longer cycle times. */
export function stationPath(height: number) {
  const rnd = mulberry32(47);
  const parts: string[] = [];
  let x = 12;
  while (x < TL.width - 6) {
    const slowing = smooth(220, 460, x);
    const v = 0.32 + 0.5 * slowing + (rnd() - 0.5) * 0.14;
    parts.push(`M${round(x)} ${height - 3} V${toY(v, height, 4)}`);
    x += 30 + 22 * slowing + (rnd() - 0.5) * 8;
  }
  return parts.join(' ');
}

/** Estimated cognitive load with an uncertainty band that widens while the camera is blocked. */
const EST_PAD = 8;
const mean = (x: number) => 0.22 + 0.5 * smooth(205, 400, x) + 0.02 * Math.sin(x / 38);
const blocked = (x: number) =>
  smooth(TL.occlusionStart - 25, TL.occlusionStart + 5, x) *
  (1 - smooth(TL.occlusionEnd, TL.occlusionEnd + 25, x));
const half = (x: number) => 0.055 + 0.15 * blocked(x);

/** Where the estimate and the edges of its band sit at one moment, for a chart of the given height. */
export function estimateAt(x: number, height: number) {
  return {
    y: toY(mean(x), height, EST_PAD),
    upper: toY(mean(x) + half(x), height, EST_PAD),
    lower: toY(mean(x) - half(x), height, EST_PAD),
    /** True once the whole band is above the threshold. */
    confident: mean(x) - half(x) > TL.threshold,
    high: mean(x) > TL.threshold,
  };
}

export function estimate(height: number) {
  const pad = EST_PAD;

  const line: Point[] = [];
  const upper: Point[] = [];
  const lower: Point[] = [];
  for (let x = 0; x <= TL.width; x += 5) {
    line.push([x, toY(mean(x), height, pad)]);
    upper.push([x, toY(mean(x) + half(x), height, pad)]);
    lower.push([x, toY(mean(x) - half(x), height, pad)]);
  }
  const band = `${toPath(upper)} ${lower
    .reverse()
    .map(([x, y]) => `L${round(x)} ${y}`)
    .join(' ')} Z`;

  const ticks: string[] = [];
  for (let x = 0; x <= TL.width; x += 50) ticks.push(`M${x} ${height - 4} V${height}`);

  const thresholdY = toY(TL.threshold, height, pad);
  return {
    line: toPath(line),
    band,
    ticks: ticks.join(' '),
    thresholdY,
    thresholdTop: `${((thresholdY / height) * 100).toFixed(1)}%`,
    actTop: `${((toY(mean(TL.act), height, pad) / height) * 100).toFixed(1)}%`,
  };
}
