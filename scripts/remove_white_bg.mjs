import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const srcDir = '../source-assets/Solar/solarnew';
const dstDir = '../frontend/public/solar';

const files = await readdir(srcDir);
for (const file of files) {
  if (!/\.(png|jpg)$/i.test(file)) continue;
  const name = path.basename(file, path.extname(file));
  if (name === 'LT1_LT2' || name === 'E7') continue; // skip unlisted

  const outName = name === 'T-lsb' ? 'T-Lab' : name;

  const img = sharp(path.join(srcDir, file)).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 218 && data[i+1] > 218 && data[i+2] > 218) data[i+3] = 0;
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 80 })
    .toFile(path.join(dstDir, outName + '.webp'));

  console.log(`✓ ${outName}.webp`);
}
