import sharp from '../node_modules/sharp/lib/index.js';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const BASE = 'c:/Users/James/OneDrive/Desktop/NUS_Built_Environment_WebAR';
const SRC  = BASE + '/source-assets/Daylight';
const DST  = BASE + '/frontend/public/daylight';

const conversions = [
  // CELC
  [`${SRC}/CELC/cELC-2F.png`,                                       `${DST}/CELC/CELC-2F.webp`],
  [`${SRC}/CELC/Celc-3f.png`,                                       `${DST}/CELC/CELC-3F.webp`],
  // E1
  [`${SRC}/E1/e1-1f.png`,                                           `${DST}/E1/E1-1F.webp`],
  [`${SRC}/E1/e1-3f.png`,                                           `${DST}/E1/E1-3F.webp`],
  [`${SRC}/E1/e1-5f.png`,                                           `${DST}/E1/E1-5F.webp`],
  // E1A
  [`${SRC}/E1A/e1a-1f.png`,                                         `${DST}/E1A/E1A-1F.webp`],
  [`${SRC}/E1A/E1A-2F.png`,                                         `${DST}/E1A/E1A-2F.webp`],
  [`${SRC}/E1A/E1A-4F.png`,                                         `${DST}/E1A/E1A-4F.webp`],
  [`${SRC}/E1A/e1a-6f.png`,                                         `${DST}/E1A/E1A-6F.webp`],
  [`${SRC}/E1A/E1A-7F.png`,                                         `${DST}/E1A/E1A-7F.webp`],
  // E2
  [`${SRC}/E2/1.png`,                                               `${DST}/E2/E2-1F.webp`],
  [`${SRC}/E2/E2左面2f.png`,                                         `${DST}/E2/E2-2F.webp`],
  [`${SRC}/E2/E2左面3f-removebg-preview.png`,                        `${DST}/E2/E2-3F.webp`],
  // E2A
  [`${SRC}/E2A/1-removebg-preview.png`,                             `${DST}/E2A/E2A-1F.webp`],
  [`${SRC}/E2A/2-removebg-preview.png`,                             `${DST}/E2A/E2A-2F.webp`],
  [`${SRC}/E2A/3-removebg-preview.png`,                             `${DST}/E2A/E2A-3F.webp`],
  // E3
  [`${SRC}/E3/E3-1F.png`,                                           `${DST}/E3/E3-1F.webp`],
  [`${SRC}/E3/E3-3f-removebg-preview (1).png`,                      `${DST}/E3/E3-3F.webp`],
  // E3A
  [`${SRC}/E3A/E3A-1F.png`,                                         `${DST}/E3A/E3A-1F.webp`],
  [`${SRC}/E3A/E3A-3F-removebg-preview.png`,                        `${DST}/E3A/E3A-3F.webp`],
  // E4
  [`${SRC}/E4/e4-4f.png`,                                           `${DST}/E4/E4-4F.webp`],
  [`${SRC}/E4/E4-5F.png`,                                           `${DST}/E4/E4-5F.webp`],
  [`${SRC}/E4/e4-6f (2).png`,                                       `${DST}/E4/E4-6F.webp`],
  [`${SRC}/E4/e4-8f.png`,                                           `${DST}/E4/E4-8F.webp`],
  // E4A
  [`${SRC}/E4A/E4Adaylight-removebg-preview.png`,                   `${DST}/E4A/E4A-1F.webp`],
  // E5
  [`${SRC}/E5/e5-1f.png`,                                           `${DST}/E5/E5-1F.webp`],
  [`${SRC}/E5/e5-2f.png`,                                           `${DST}/E5/E5-2F.webp`],
  [`${SRC}/E5/ef-3f.png`,                                           `${DST}/E5/E5-3F.webp`],
  // E6
  [`${SRC}/E6/E6-2f-removebg-preview.png`,                         `${DST}/E6/E6-2F.webp`],
  [`${SRC}/E6/E6-5f-removebg-preview.png`,                         `${DST}/E6/E6-5F.webp`],
  [`${SRC}/E6/E6-6f-removebg-preview.png`,                         `${DST}/E6/E6-6F.webp`],
  [`${SRC}/E6/E6-7F-removebg-preview.png`,                         `${DST}/E6/E6-7F.webp`],
  // E7
  [`${SRC}/E7/E7_daylight_1f-removebg-preview.png`,                `${DST}/E7/E7-1F.webp`],
  [`${SRC}/E7/E7_3f-removebg-preview.png`,                         `${DST}/E7/E7-3F.webp`],
  [`${SRC}/E7/e7_4f-removebg-preview.png`,                         `${DST}/E7/E7-4F.webp`],
  [`${SRC}/E7/E7_6f-removebg-preview (1).png`,                     `${DST}/E7/E7-6F.webp`],
  [`${SRC}/E7/E7_7f-removebg-preview.png`,                         `${DST}/E7/E7-7F.webp`],
  [`${SRC}/E7/e7_8f-removebg-preview.png`,                         `${DST}/E7/E7-8F.webp`],
  // E8
  [`${SRC}/E8/E8-2F-removebg-preview (1).png`,                     `${DST}/E8/E8-2F.webp`],
  [`${SRC}/E8/E8-3F-removebg-preview.png`,                         `${DST}/E8/E8-3F.webp`],
  [`${SRC}/E8/E8-5F-removebg-preview.png`,                         `${DST}/E8/E8-5F.webp`],
  // EA
  [`${SRC}/EA/EA-1F.png`,                                           `${DST}/EA/EA-1F.webp`],
  [`${SRC}/EA/EA-3F.png`,                                           `${DST}/EA/EA-3F.webp`],
  // EW1
  [`${SRC}/EW1/EW1-1F.png`,                                         `${DST}/EW1/EW1-1F.webp`],
  [`${SRC}/EW1/EW1-2F.png`,                                         `${DST}/EW1/EW1-2F.webp`],
  // IT
  [`${SRC}/IT/IT-1f.png`,                                           `${DST}/IT/IT-1F.webp`],
  [`${SRC}/IT/IT-3f.png`,                                           `${DST}/IT/IT-3F.webp`],
  // SDE1
  [`${SRC}/SDE1/sde1-1f.png`,                                       `${DST}/SDE1/SDE1-1F.webp`],
  [`${SRC}/SDE1/sde1-2f.png`,                                       `${DST}/SDE1/SDE1-2F.webp`],
  [`${SRC}/SDE1/sde1-3f.png`,                                       `${DST}/SDE1/SDE1-3F.webp`],
  [`${SRC}/SDE1/sde1-4f-removebg-preview.png`,                      `${DST}/SDE1/SDE1-4F.webp`],
  [`${SRC}/SDE1/SDE1-5f-removebg-preview.png`,                      `${DST}/SDE1/SDE1-5F.webp`],
  // SDE2
  [`${SRC}/SDE2/SDE2-2F-removebg-preview.png`,                      `${DST}/SDE2/SDE2-2F.webp`],
  [`${SRC}/SDE2/SDE2-3F.png`,                                        `${DST}/SDE2/SDE2-3F.webp`],
  [`${SRC}/SDE2/SDE2-4F.png`,                                        `${DST}/SDE2/SDE2-4F.webp`],
  // SDE3
  [`${SRC}/SDE3/SDE3-2F.png`,                                        `${DST}/SDE3/SDE3-2F.webp`],
  [`${SRC}/SDE3/SDE3-3F.png`,                                        `${DST}/SDE3/SDE3-3F.webp`],
  [`${SRC}/SDE3/SDE3-4F.png`,                                        `${DST}/SDE3/SDE3-4F.webp`],
  // SDE4
  [`${SRC}/SDE4/SDE4-1F.png`,                                        `${DST}/SDE4/SDE4-1F.webp`],
  [`${SRC}/SDE4/SDE4-2F.png`,                                        `${DST}/SDE4/SDE4-2F.webp`],
  [`${SRC}/SDE4/SDE4-3F.png`,                                        `${DST}/SDE4/SDE4-3F.webp`],
  [`${SRC}/SDE4/SDE4-4F.png`,                                        `${DST}/SDE4/SDE4-4F.webp`],
  [`${SRC}/SDE4/SDE4-5F.png`,                                        `${DST}/SDE4/SDE4-5F.webp`],
  // T-Lab
  [`${SRC}/T-Lab/t-lab_daylight_3f-removebg-preview (1).png`,        `${DST}/T-Lab/T-Lab-3F.webp`],
  [`${SRC}/T-Lab/t-lab_daylight_5f-removebg-preview.png`,            `${DST}/T-Lab/T-Lab-5F.webp`],
  [`${SRC}/T-Lab/t-lab_daylight_10f.png`,                            `${DST}/T-Lab/T-Lab-10F.webp`],
];

for (const [src, dst] of conversions) {
  const dir = path.dirname(dst);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const img = sharp(src).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 218 && data[i+1] > 218 && data[i+2] > 218) data[i+3] = 0;
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 80 }).toFile(dst);
  console.log('✓ ' + path.basename(dst));
}
console.log('All done.');
