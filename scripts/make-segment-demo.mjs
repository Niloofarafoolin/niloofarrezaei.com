// Makes the pictures for the "one method, any picture" figure on the Research page.
//
//   node scripts/make-segment-demo.mjs
//
// It draws three made-up test pictures, runs a small version of the two-layer idea in
// Khatibi, Rezaei, Ataei Fashtami & Totonchi (2021) on each, and writes:
//   src/assets/figures/segment/*.png   the tiles the figure shows
//   src/data/segment-demo.json         their names and how well each result matches
//
// Everything here is a demonstration. The pictures are drawn by this script, not photographed,
// and the numbers describe this demonstration only. The paper's own first layer is four
// fully convolutional networks; here a plain two-cluster step stands in for each of them.
// The script uses no packages and no randomness beyond a fixed seed, so it always
// produces the same files.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const N = 360;
/** The shapes below are laid out on a square 144 units wide. F turns units into pixels. */
const F = N / 144;
/** A distance in units, as a whole number of pixels. */
const px = (units) => Math.max(1, Math.round(units * F));
const OUT = new URL('../src/assets/figures/segment/', import.meta.url);
const DATA = new URL('../src/data/segment-demo.json', import.meta.url);

// ---------- small tools ----------

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth noise in 0..1 with features about `scale` pixels wide. */
function smoothNoise(seed, scale) {
  const rand = mulberry32(seed);
  const G = 48;
  const grid = Float32Array.from({ length: G * G }, () => rand());
  const at = (ix, iy) => grid[(((iy % G) + G) % G) * G + (((ix % G) + G) % G)];
  return (x, y) => {
    const fx = x / scale;
    const fy = y / scale;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return top + (bottom - top) * sy;
  };
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
/** 1 inside a shape, 0 outside, with an edge `soft` pixels wide. `d` is the distance inside the edge. */
const edge = (d, soft) => clamp01(0.5 + d / soft);

/** A wobbly blob. Returns how far (x, y) is inside its edge, in pixels. */
function blob(cx, cy, radius, wobble, phase) {
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const angle = Math.atan2(dy, dx);
    const r = radius * (1 + wobble * Math.sin(3 * angle + phase) + 0.55 * wobble * Math.sin(5 * angle + 2.1 * phase));
    return r - Math.hypot(dx, dy);
  };
}

/** A rounded rectangle, optionally turned. Returns the distance inside its edge. */
function roundedBox(cx, cy, halfW, halfH, corner, turn = 0) {
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  return (x, y) => {
    const dx = (x - cx) * cos + (y - cy) * sin;
    const dy = -(x - cx) * sin + (y - cy) * cos;
    const qx = Math.abs(dx) - (halfW - corner);
    const qy = Math.abs(dy) - (halfH - corner);
    const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
    const inside = Math.min(Math.max(qx, qy), 0);
    return corner - (outside + inside);
  };
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// ---------- the three made-up pictures ----------

/** Each returns { rgb: Float32Array(N*N*3) in 0..255, truth: Uint8Array(N*N) }. */
const pictures = {
  // A pale patch on skin-like texture, with a blue ink mark and a patch of glare.
  skin() {
    const tone = smoothNoise(11, 30);
    const pores = smoothNoise(12, 4);
    const grain = mulberry32(13);
    const patch = blob(62, 80, 31, 0.2, 0.6);
    const small = blob(110, 34, 12, 0.16, 2.2);
    const ink = roundedBox(34, 30, 17, 5, 4, -0.5);
    const glare = blob(112, 104, 20, 0.1, 1.4);
    const rgb = new Float32Array(N * N * 3);
    const truth = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = x / F;
        const v = y / F;
        const inPatch = Math.max(edge(patch(u, v), 7), edge(small(u, v), 5));
        let c = mix([198, 148, 118], [240, 222, 212], inPatch);
        c = mix(c, [86, 104, 168], 0.85 * edge(ink(u, v), 3));
        const light = 0.94 + 0.1 * tone(u, v) + 0.21 * edge(glare(u, v), 16) * (1 - inPatch);
        const speckle = 1 + 0.045 * (pores(u, v) - 0.5) + 0.03 * (grain() - 0.5);
        const i = (y * N + x) * 3;
        for (let k = 0; k < 3; k++) rgb[i + k] = Math.min(255, c[k] * light * speckle);
        truth[y * N + x] = inPatch > 0.5 ? 1 : 0;
      }
    }
    return { rgb, truth };
  },

  // A rust spot on brushed metal, darker towards the corners.
  metal() {
    const rowNoise = mulberry32(21);
    const rows = Float32Array.from({ length: 144 }, () => rowNoise());
    const streak = smoothNoise(22, 26);
    const grain = mulberry32(23);
    const rust = blob(84, 66, 27, 0.26, 1.1);
    const speck = blob(40, 104, 9, 0.2, 0.4);
    const mottle = smoothNoise(24, 6);
    const rgb = new Float32Array(N * N * 3);
    const truth = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = x / F;
        const v = y / F;
        const inRust = Math.max(edge(rust(u, v), 5), edge(speck(u, v), 4));
        const brushed = 1 + 0.07 * (rows[Math.min(143, Math.floor(v))] - 0.5) + 0.05 * (streak(u * 0.35, v * 3) - 0.5);
        const corner = Math.hypot(u - 72, v - 72) / 72;
        const vignette = 1 - 0.13 * Math.max(0, corner - 0.5) ** 1.2 * 2.2;
        const metal = [168, 172, 178].map((value) => value * brushed * vignette);
        const rusty = mix([150, 84, 44], [176, 112, 58], mottle(u, v));
        const c = mix(metal, rusty, inRust);
        const speckle = 1 + 0.03 * (grain() - 0.5);
        const i = (y * N + x) * 3;
        for (let k = 0; k < 3; k++) rgb[i + k] = Math.min(255, c[k] * speckle);
        truth[y * N + x] = inRust > 0.5 ? 1 : 0;
      }
    }
    return { rgb, truth };
  },

  // A red part on a wooden bench, with its shadow and a strip of yellow tape.
  bench() {
    const grainNoise = smoothNoise(31, 9);
    const board = smoothNoise(32, 40);
    const grain = mulberry32(33);
    const partA = roundedBox(66, 64, 30, 13, 6, 0.32);
    const partB = roundedBox(84, 88, 12, 22, 6, 0.32);
    const shadowA = roundedBox(74, 73, 31, 14, 9, 0.32);
    const shadowB = roundedBox(93, 97, 13, 23, 9, 0.32);
    const tape = roundedBox(40, 120, 26, 6, 2, -0.12);
    const highlight = roundedBox(60, 58, 18, 3, 2, 0.32);
    const rgb = new Float32Array(N * N * 3);
    const truth = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = x / F;
        const v = y / F;
        const inPart = Math.max(edge(partA(u, v), 2), edge(partB(u, v), 2));
        const inShadow = Math.max(edge(shadowA(u, v), 9), edge(shadowB(u, v), 9)) * (1 - inPart);
        const wood = 1 + 0.07 * (grainNoise(u * 2.4, v * 0.35) - 0.5) + 0.06 * (board(u, v) - 0.5);
        let c = [214, 190, 156].map((value) => value * wood);
        c = mix(c, [232, 190, 52], edge(tape(u, v), 2));
        c = c.map((value) => value * (1 - 0.2 * inShadow));
        const shine = 1 + 0.16 * edge(highlight(u, v), 5);
        c = mix(c, [184, 50, 40].map((value) => value * shine), inPart);
        const speckle = 1 + 0.03 * (grain() - 0.5);
        const i = (y * N + x) * 3;
        for (let k = 0; k < 3; k++) rgb[i + k] = Math.min(255, c[k] * speckle);
        truth[y * N + x] = inPart > 0.5 ? 1 : 0;
      }
    }
    return { rgb, truth };
  },
};

// ---------- colour views ----------

function views(rgb) {
  const red = new Float32Array(N * N);
  const light = new Float32Array(N * N);
  const sat = new Float32Array(N * N);
  const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  for (let p = 0; p < N * N; p++) {
    const r = rgb[p * 3] / 255;
    const g = rgb[p * 3 + 1] / 255;
    const b = rgb[p * 3 + 2] / 255;
    red[p] = r;
    // L of CIE-Lab, scaled to 0..1.
    const Y = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
    light[p] = (Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y) / 100;
    // S of HSV.
    const hi = Math.max(r, g, b);
    sat[p] = hi === 0 ? 0 : (hi - Math.min(r, g, b)) / hi;
  }
  return { red, light, sat };
}

// ---------- segmentation ----------

/** Box blur of one channel, `radius` pixels each way. */
function blur(src, radius) {
  const tmp = new Float32Array(N * N);
  const out = new Float32Array(N * N);
  const pass = (from, to, step, lineStep) => {
    for (let line = 0; line < N; line++) {
      for (let i = 0; i < N; i++) {
        let sum = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          const j = i + k;
          if (j < 0 || j >= N) continue;
          sum += from[line * lineStep + j * step];
          count++;
        }
        to[line * lineStep + i * step] = sum / count;
      }
    }
  };
  pass(src, tmp, 1, N);
  pass(tmp, out, N, 1);
  return out;
}

/** Two-cluster K-means on vectors of `dims` channels. Returns a 0/1 label for each pixel. */
function kmeans2(channels) {
  const dims = channels.length;
  const mean = channels.map((c) => c.reduce((s, v) => s + v, 0) / c.length);
  // Start from the two pixels furthest below and above the mean of the first channel.
  let lo = 0;
  let hi = 0;
  const key = (p) => channels.reduce((s, c, d) => s + (c[p] - mean[d]), 0);
  for (let p = 1; p < N * N; p++) {
    if (key(p) < key(lo)) lo = p;
    if (key(p) > key(hi)) hi = p;
  }
  let centres = [channels.map((c) => c[lo]), channels.map((c) => c[hi])];
  const labels = new Uint8Array(N * N);
  for (let round = 0; round < 40; round++) {
    const sums = [new Float64Array(dims), new Float64Array(dims)];
    const counts = [0, 0];
    for (let p = 0; p < N * N; p++) {
      let d0 = 0;
      let d1 = 0;
      for (let d = 0; d < dims; d++) {
        d0 += (channels[d][p] - centres[0][d]) ** 2;
        d1 += (channels[d][p] - centres[1][d]) ** 2;
      }
      const label = d1 < d0 ? 1 : 0;
      labels[p] = label;
      counts[label]++;
      for (let d = 0; d < dims; d++) sums[label][d] += channels[d][p];
    }
    const next = centres.map((c, k) => (counts[k] ? Array.from(sums[k], (s) => s / counts[k]) : c));
    const moved = next.reduce((s, c, k) => s + c.reduce((t, v, d) => t + Math.abs(v - centres[k][d]), 0), 0);
    centres = next;
    if (moved < 1e-6) break;
  }
  return { labels, centres };
}

/** The first layer's stand-in: smooth one view, split it in two, and call the smaller part the region. */
function standIn(channels) {
  const { labels } = kmeans2(channels.map((c) => blur(c, px(2))));
  const ones = labels.reduce((s, v) => s + v, 0);
  const region = ones <= N * N - ones ? 1 : 0;
  return tidy(Uint8Array.from(labels, (v) => (v === region ? 1 : 0)));
}

/** Removes single stray pixels: each pixel takes the majority of its 3 by 3 neighbourhood. */
function tidy(mask) {
  const smooth = blur(Float32Array.from(mask), px(1));
  return Uint8Array.from(smooth, (v) => (v > 0.5 ? 1 : 0));
}

/** Two thresholds that best split the values into three groups (multi-level Otsu). Returns the upper one. */
function upperThreshold(values) {
  const BINS = 40;
  const hist = new Float64Array(BINS);
  for (const v of values) hist[Math.min(BINS - 1, Math.floor(v * BINS))]++;
  const total = values.length;
  const prefixCount = new Float64Array(BINS + 1);
  const prefixSum = new Float64Array(BINS + 1);
  for (let i = 0; i < BINS; i++) {
    prefixCount[i + 1] = prefixCount[i] + hist[i];
    prefixSum[i + 1] = prefixSum[i] + hist[i] * (i + 0.5);
  }
  const between = (a, b) => {
    const count = prefixCount[b] - prefixCount[a];
    if (!count) return 0;
    const mean = (prefixSum[b] - prefixSum[a]) / count;
    return (count / total) * mean * mean;
  };
  let best = -1;
  let cut = BINS / 2;
  for (let a = 1; a < BINS - 1; a++) {
    for (let b = a + 1; b < BINS; b++) {
      const score = between(0, a) + between(a, b) + between(b, BINS);
      if (score > best) {
        best = score;
        cut = b;
      }
    }
  }
  return cut / BINS;
}

/** Grows one region from the strongest point, across neighbours that are at least `level`. */
function grow(values, level) {
  const wide = blur(values, px(12));
  let seed = 0;
  for (let p = 1; p < N * N; p++) if (wide[p] > wide[seed]) seed = p;
  const mask = new Uint8Array(N * N);
  const stack = [seed];
  mask[seed] = 1;
  while (stack.length) {
    const p = stack.pop();
    const x = p % N;
    const y = (p - x) / N;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
      const q = ny * N + nx;
      if (!mask[q] && values[q] >= level) {
        mask[q] = 1;
        stack.push(q);
      }
    }
  }
  return mask;
}

/** Dice index of a result against the known region. */
function dice(mask, truth) {
  let both = 0;
  let a = 0;
  let b = 0;
  for (let p = 0; p < N * N; p++) {
    both += mask[p] & truth[p];
    a += mask[p];
    b += truth[p];
  }
  return a + b ? (2 * both) / (a + b) : 0;
}

// ---------- drawing ----------

const crcTable = Int32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(bytes) {
  let c = -1;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}
function png(rgb) {
  const raw = Buffer.alloc(N * (N * 3 + 1));
  for (let y = 0; y < N; y++) {
    raw[y * (N * 3 + 1)] = 0;
    for (let i = 0; i < N * 3; i++) raw[y * (N * 3 + 1) + 1 + i] = Math.round(Math.min(255, Math.max(0, rgb[y * N * 3 + i])));
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(N, 0);
  header.writeUInt32BE(N, 4);
  header.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const grey = (channel) => {
  const out = new Float32Array(N * N * 3);
  for (let p = 0; p < N * N; p++) out.fill(clamp01(channel[p]) * 255, p * 3, p * 3 + 3);
  return out;
};

/** Pixels of `mask` that touch the outside, widened to a line two pixels thick. */
function outline(mask) {
  const line = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const p = y * N + x;
      if (!mask[p]) continue;
      const open = x === 0 || y === 0 || x === N - 1 || y === N - 1 || !mask[p - 1] || !mask[p + 1] || !mask[p - N] || !mask[p + N];
      if (open) line[p] = 1;
    }
  }
  let thick = line;
  for (let pass = 0; pass < px(1); pass++) {
    const next = new Uint8Array(thick);
    for (let y = 1; y < N - 1; y++) {
      for (let x = 1; x < N - 1; x++) {
        const p = y * N + x;
        if (mask[p] && (thick[p - 1] || thick[p + 1] || thick[p - N] || thick[p + N])) next[p] = 1;
      }
    }
    thick = next;
  }
  return thick;
}

const INK = [22, 19, 16];
const HALO = [255, 253, 249];
const TINT = [141, 53, 20];

/** Draws a result on top of a picture: a copper tint inside, a dark line with a pale halo around it. */
function overlay(base, mask, { truth = null } = {}) {
  const out = Float32Array.from(base);
  const paint = (p, colour, amount) => {
    for (let k = 0; k < 3; k++) out[p * 3 + k] += (colour[k] - out[p * 3 + k]) * amount;
  };
  for (let p = 0; p < N * N; p++) if (mask[p]) paint(p, TINT, 0.3);
  if (truth) {
    const line = outline(truth);
    for (let p = 0; p < N * N; p++) if (line[p]) paint(p, HALO, 0.95);
  }
  const line = outline(mask);
  const outer = new Uint8Array(N * N);
  for (let y = 1; y < N - 1; y++) {
    for (let x = 1; x < N - 1; x++) {
      const p = y * N + x;
      if (!line[p] && !mask[p] && (line[p - 1] || line[p + 1] || line[p - N] || line[p + N])) outer[p] = 1;
    }
  }
  for (let p = 0; p < N * N; p++) {
    if (outer[p]) paint(p, HALO, 0.85);
    if (line[p]) paint(p, INK, 0.92);
  }
  return out;
}

// ---------- run ----------

const names = { skin: 'Pale patch on skin', metal: 'Rust on brushed metal', bench: 'Part on a bench' };
const notes = {
  skin: 'A pale patch with a soft edge, a blue ink mark and a patch of glare.',
  metal: 'A rust spot on brushed metal that darkens towards the corners.',
  bench: 'A red part on a wooden bench, with its shadow and a strip of yellow tape.',
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const save = (name, rgb) => {
  writeFileSync(new URL(`${name}.png`, OUT), png(rgb));
  return name;
};

const report = [];
for (const key of Object.keys(pictures)) {
  const { rgb, truth } = pictures[key]();
  const { red, light, sat } = views(rgb);
  const channel = (k) => Float32Array.from({ length: N * N }, (_, p) => rgb[p * 3 + k] / 255);

  const viewList = [
    { name: 'Full colour', tile: rgb, input: [channel(0), channel(1), channel(2)] },
    { name: 'Red', tile: grey(red), input: [red] },
    { name: 'Lightness', tile: grey(light), input: [light] },
    { name: 'Saturation', tile: grey(sat.map((v) => v * 1.6)), input: [sat] },
  ];

  // First layer: one result for each view.
  const first = viewList.map((view) => standIn(view.input));

  // What the second layer sees: the first layer's four answers for each pixel.
  const meta = first.map((mask) => blur(Float32Array.from(mask), px(1)));
  const agree = Float32Array.from({ length: N * N }, (_, p) => (meta[0][p] + meta[1][p] + meta[2][p] + meta[3][p]) / 4);

  // Second layer: three classical methods on those answers.
  const cut = upperThreshold(agree);
  const byThreshold = tidy(Uint8Array.from(agree, (v) => (v >= cut ? 1 : 0)));
  const km = kmeans2(meta);
  const strong = km.centres[1].reduce((s, v) => s + v, 0) > km.centres[0].reduce((s, v) => s + v, 0) ? 1 : 0;
  const byKmeans = tidy(Uint8Array.from(km.labels, (v) => (v === strong ? 1 : 0)));
  const byGrowing = tidy(grow(agree, 0.5));
  const second = [
    { name: 'Adaptive threshold', mask: byThreshold },
    { name: 'K-means', mask: byKmeans },
    { name: 'Region growing', mask: byGrowing },
  ];

  // Consensus: a vote of all seven results.
  const all = [...first, ...second.map((s) => s.mask)];
  const voted = tidy(Uint8Array.from({ length: N * N }, (_, p) => (all.reduce((s, m) => s + m[p], 0) >= 4 ? 1 : 0)));

  const agreeTile = grey(agree);
  const entry = {
    key,
    name: names[key],
    note: notes[key],
    views: viewList.map((view, i) => ({ name: view.name, file: save(`${key}-view-${i + 1}`, view.tile) })),
    first: viewList.map((view, i) => ({
      name: view.name,
      file: save(`${key}-first-${i + 1}`, overlay(view.tile, first[i])),
      match: Math.round(dice(first[i], truth) * 100),
    })),
    second: second.map((s, i) => ({
      name: s.name,
      file: save(`${key}-second-${i + 1}`, overlay(agreeTile, s.mask)),
      match: Math.round(dice(s.mask, truth) * 100),
    })),
    final: { file: save(`${key}-final`, overlay(rgb, voted, { truth })), match: Math.round(dice(voted, truth) * 100) },
  };
  report.push(entry);
  console.log(
    `${key.padEnd(6)} first layer: ${entry.first.map((f) => `${f.name} ${f.match}`).join(', ')} | second layer: ${entry.second
      .map((s) => `${s.name} ${s.match}`)
      .join(', ')} | consensus ${entry.final.match}`,
  );
}

writeFileSync(DATA, JSON.stringify({ size: N, pictures: report }, null, 2) + '\n');
console.log(`wrote ${report.length * 12} tiles and segment-demo.json`);
