// Prepares the owner's portrait for the site.
//   node scripts/add-portrait.mjs "/path/to/photo.jpg"
//
// It turns the photo upright, removes hidden data such as GPS location and camera
// details, limits the size, and saves it as src/assets/headshot.jpg. The original
// file is not changed. Record the photo in MEDIA-RIGHTS.md before publishing.
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const source = process.argv[2];
if (!source || !existsSync(source)) {
  console.error('Give the path of the photo, for example: node scripts/add-portrait.mjs ~/Desktop/me.jpg');
  process.exit(1);
}

const target = new URL('../src/assets/headshot.jpg', import.meta.url).pathname;
mkdirSync(new URL('../src/assets/', import.meta.url).pathname, { recursive: true });

// Read the photo into memory first, so this also works on a file already in src/assets.
const original = readFileSync(source);
const before = await sharp(original).metadata();
const info = await sharp(original)
  .rotate() // apply the camera's orientation, then drop the orientation tag
  .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(target); // sharp writes no metadata unless asked to

const after = await sharp(target).metadata();
console.log(`Source: ${before.width} x ${before.height}, ${before.format}${before.exif ? ', had hidden camera data' : ''}`);
console.log(`Saved:  ${info.width} x ${info.height}, ${Math.round(info.size / 1024)} KB -> src/assets/headshot.jpg`);
console.log(`Hidden data left in the saved file: ${after.exif || after.xmp || after.iptc ? 'YES, check this' : 'none'}`);
if (Math.min(info.width, info.height) < 800) {
  console.log('Note: this photo is small. A version at least 1200 pixels on its short side will look sharper.');
}
