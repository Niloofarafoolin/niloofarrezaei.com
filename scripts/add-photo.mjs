// Prepares a photo for the site.
//   node scripts/add-photo.mjs "/path/to/photo.jpg" name-on-site [--crop=left,top,width,height] [--copyright="..."] [--artist="..."]
//
// It turns the photo upright, optionally crops it (fractions of the full frame, 0 to 1),
// limits the size, and saves it as src/assets/photos/<name>.jpg. The original is not changed.
//
// Hidden camera and location data are removed. A photographer's copyright notice is
// kept in the file when given, because removing someone else's notice is not allowed.
// Record every photo in MEDIA-RIGHTS.md.
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const [source, name, ...flags] = process.argv.slice(2);
if (!source || !name || !existsSync(source)) {
  console.error('Usage: node scripts/add-photo.mjs "/path/to/photo.jpg" name-on-site [--crop=l,t,w,h] [--copyright="..."] [--artist="..."]');
  process.exit(1);
}
const option = (key) => flags.find((f) => f.startsWith(`--${key}=`))?.slice(key.length + 3);

const dir = new URL('../src/assets/photos/', import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
const target = `${dir}${name}.jpg`;

const upright = await sharp(readFileSync(source)).rotate().toBuffer({ resolveWithObject: true });
let image = sharp(upright.data);
const crop = option('crop');
if (crop) {
  const [l, t, w, h] = crop.split(',').map(Number);
  const { width, height } = upright.info;
  image = image.extract({
    left: Math.round(l * width),
    top: Math.round(t * height),
    width: Math.round(w * width),
    height: Math.round(h * height),
  });
}
image = image.resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true });

const copyright = option('copyright');
const artist = option('artist');
if (copyright || artist) {
  image = image.withExif({ IFD0: { ...(copyright && { Copyright: copyright }), ...(artist && { Artist: artist }) } });
}

const info = await image.toFile(target);
console.log(`Saved ${info.width} x ${info.height}, ${Math.round(info.size / 1024)} KB -> src/assets/photos/${name}.jpg`);
console.log(copyright ? `Copyright notice kept in the file: ${copyright}` : 'No copyright notice written (use --copyright for photos by someone else).');
