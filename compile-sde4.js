const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { decode, encode } = require('@msgpack/msgpack');

const IMAGE  = path.resolve(__dirname, 'source-assets/SDE4marker.png');
const DEST   = path.resolve(__dirname, 'frontend/public/ar/targets-all.mind');
const TARGET_IDX = 20; // slot to replace/add

const imageBase64 = fs.readFileSync(IMAGE).toString('base64');

const serveHTML = `<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js"></script>
</head>
<body>
<script>
window.addEventListener('load', async () => {
  try {
    const img = new Image();
    img.src = 'data:image/png;base64,BASE64DATA';
    await new Promise(r => img.onload = r);
    const compiler = new MINDAR.IMAGE.Compiler();
    await compiler.compileImageTargets([img], p => {
      document.title = 'progress:' + Math.round(p * 100);
    });
    const buf = await compiler.exportData();
    window.__result = Array.from(new Uint8Array(buf));
    document.title = 'done';
  } catch(e) {
    window.__error = e.message;
    document.title = 'error';
  }
});
</script>
</body>
</html>`.replace('BASE64DATA', imageBase64);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(serveHTML);
});

server.listen(7790, async () => {
  console.log('Compiling SDE4 marker from source-assets/SDE4marker.png ...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:7790/', { waitUntil: 'networkidle2', timeout: 60000 });

  let done = false;
  for (let i = 0; i < 360; i++) {
    await new Promise(r => setTimeout(r, 500));
    const title = await page.title();
    if (title.startsWith('progress:')) process.stdout.write('\r' + title + '%   ');
    else if (title === 'done' || title === 'error') { done = true; console.log('\nStatus:', title); break; }
  }

  const result = await page.evaluate(() => window.__result || null);
  const error  = await page.evaluate(() => window.__error  || null);
  await browser.close();
  server.close();

  if (!done || error) { console.error('Failed:', error); return; }

  const compiled = decode(Buffer.from(result));
  console.log('Compiled target — matchingData keys:', Object.keys(compiled.dataList[0].matchingData).length,
              '  img:', compiled.dataList[0].targetImage.width, 'x', compiled.dataList[0].targetImage.height);

  // Splice into targets-all.mind at slot TARGET_IDX
  const base = decode(fs.readFileSync(DEST));
  // Trim to 20 if we previously added a bad one
  if (base.dataList.length > TARGET_IDX) base.dataList = base.dataList.slice(0, TARGET_IDX);
  base.dataList.push(compiled.dataList[0]);

  fs.writeFileSync(DEST, encode(base));
  console.log(`Done — ${base.dataList.length} targets written to ${DEST}`);
});
