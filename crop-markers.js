const puppeteer = require('puppeteer');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PDF_PATH = path.resolve(__dirname, 'ARmarkers.pdf');
const OUT = path.resolve(__dirname, 'cropped_qr_codes');
fs.mkdirSync(OUT, { recursive: true });

const labels = [
  ['CELC', 'E1', 'E1A', 'E2', 'E2A'],
  ['E3', 'E3A', 'E4', 'E4A', 'E5'],
  ['E6', 'E8', 'EA', 'EW1', 'EW1A'],
  ['SDE4', 'SDE2', 'SDE1', 'SDE3', 'T-Lab'],
];
const ROWS = 4, COLS = 5;

const pdfBase64 = fs.readFileSync(PDF_PATH).toString('base64');

// Serve a page that renders the PDF via PDF.js to a canvas
const html = `<!DOCTYPE html><html><head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head><body style="margin:0;background:#fff">
<canvas id="c"></canvas>
<script>
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const data = atob('${pdfBase64}');
const bytes = new Uint8Array(data.length);
for (let i = 0; i < data.length; i++) bytes[i] = data.charCodeAt(i);
pdfjsLib.getDocument({ data: bytes }).promise.then(pdf => pdf.getPage(1)).then(page => {
  const vp = page.getViewport({ scale: 3 });
  const canvas = document.getElementById('c');
  canvas.width = vp.width; canvas.height = vp.height;
  return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
}).then(() => { document.title = 'done'; }).catch(e => { document.title = 'error:' + e.message; });
</script></body></html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(7790, async () => {
  console.log('Rendering PDF via PDF.js...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:7790/', { waitUntil: 'networkidle2', timeout: 30000 });

  await page.waitForFunction(() => document.title === 'done' || document.title.startsWith('error'), { timeout: 30000 });
  const title = await page.title();
  if (title.startsWith('error')) { console.error(title); await browser.close(); server.close(); return; }

  // Get canvas dimensions and screenshot just the canvas
  const dims = await page.evaluate(() => {
    const c = document.getElementById('c');
    return { w: c.width, h: c.height };
  });
  console.log('Rendered PDF canvas:', dims.w, 'x', dims.h);

  await page.setViewport({ width: dims.w, height: dims.h });
  const raw = path.join(__dirname, '_markers_raw.png');
  await page.screenshot({ path: raw });
  await browser.close();
  server.close();

  console.log('Cropping', ROWS * COLS, 'markers...');
  const img = await Jimp.read(raw);
  const W = img.bitmap.width, H = img.bitmap.height;
  const cellW = Math.floor(W / COLS), cellH = Math.floor(H / ROWS);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const label = labels[r][c];
      const cropped = img.clone().crop({ x: c * cellW, y: r * cellH, w: cellW, h: cellH });
      await cropped.write(path.join(OUT, label + '.png'));
      console.log('Saved:', label + '.png');
    }
  }
  console.log('\nDone! Markers saved to', OUT);
});
