import { readFileSync, writeFileSync } from 'fs';
import { decode, encode } from '@msgpack/msgpack';

const base  = readFileSync('frontend/public/ar/targets-all.mind');
const extra = readFileSync('targets (24).mind');

const a = decode(base);
const b = decode(extra);

// Trim back to 20 originals, then append new SDE4 marker
if (a.dataList.length > 20) a.dataList = a.dataList.slice(0, 20);
a.dataList.push(b.dataList[0]);

writeFileSync('frontend/public/ar/targets-all.mind', encode(a));
console.log(`Merged: ${a.dataList.length} targets`);
