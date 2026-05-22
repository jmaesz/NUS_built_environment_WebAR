import { readFileSync, writeFileSync } from 'fs';
import { decode, encode } from '@msgpack/msgpack';

const base  = readFileSync('frontend/public/ar/targets-all.mind');
const extra = readFileSync('targets (22).mind');

const a = decode(base);
const b = decode(extra);

// Both files share the same top-level structure; dataList holds one entry per target
a.dataList = [...a.dataList, ...b.dataList];

const merged = encode(a);
writeFileSync('frontend/public/ar/targets-all.mind', merged);
console.log(`Merged: ${a.dataList.length} targets → frontend/public/ar/targets-all.mind`);
