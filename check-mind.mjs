import { readFileSync } from 'fs';
import { decode } from '@msgpack/msgpack';

const f = decode(readFileSync('targets (25).mind'));
const item = f.dataList[0];
console.log('targets:', f.dataList.length);
console.log('img:', item.targetImage.width, 'x', item.targetImage.height);
console.log('matchingData keys:', Object.keys(item.matchingData).length);
