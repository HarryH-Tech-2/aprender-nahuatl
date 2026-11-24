// Converts the raw Higgsfield PNGs (01.png … 23.png) into the web images under public/img.
// Usage: node scripts/process-images.mjs <folder-with-pngs>
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('Pass the folder that holds 01.png … 23.png');
const out = path.resolve('public/img');
const names = ['cipactli', 'ehecatl', 'calli', 'cuetzpalin', 'coatl', 'miquiztli', 'mazatl', 'tochtli', 'atl', 'itzcuintli',
  'ozomahtli', 'malinalli', 'acatl', 'ocelotl', 'cuauhtli', 'cozcacuauhtli', 'ollin', 'tecpatl', 'quiahuitl', 'xochitl'];
const file = (n) => path.join(src, `${String(n).padStart(2, '0')}.png`);

await mkdir(path.join(out, 'signos'), { recursive: true });
for (let i = 0; i < 20; i++) {
  await sharp(file(i + 1)).resize(480, 480).webp({ quality: 82 })
    .toFile(path.join(out, 'signos', `${String(i + 1).padStart(2, '0')}-${names[i]}.webp`));
}
await sharp(file(21)).resize(1920).webp({ quality: 80 }).toFile(path.join(out, 'hero.webp'));
await sharp(file(21)).resize(960).webp({ quality: 78 }).toFile(path.join(out, 'hero-960.webp'));
await sharp(file(22)).resize(1400).webp({ quality: 80 }).toFile(path.join(out, 'familia.webp'));
await sharp(file(21)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 85 }).toFile(path.join(out, 'og.jpg'));
await sharp(file(23)).resize(512, 512).png().toFile(path.join(out, 'icono.png'));
await sharp(file(23)).resize(256, 256).png().toFile(path.resolve('src/app/icon.png'));
await sharp(file(23)).resize(180, 180).png().toFile(path.resolve('src/app/apple-icon.png'));

// Contact sheet for a quick visual check of all 20 glyphs.
const tiles = await Promise.all(Array.from({ length: 20 }, (_, i) => sharp(file(i + 1)).resize(256, 256).toBuffer()));
await sharp({ create: { width: 256 * 5, height: 256 * 4, channels: 3, background: '#f1e4c8' } })
  .composite(tiles.map((input, i) => ({ input, left: (i % 5) * 256, top: Math.floor(i / 5) * 256 })))
  .jpeg({ quality: 80 }).toFile(path.join(src, 'sheet.jpg'));
console.log('done');
