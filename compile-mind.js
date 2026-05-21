const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const IMAGE = path.resolve(__dirname, 'SDE4marker.png');
const OUTPUT = path.resolve(__dirname, 'frontend/public/ar/targets-all.mind');

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

// Serve the page via HTTP (CDN scripts need HTTP context for CORS)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(serveHTML);
});

server.listen(7789, async () => {
  console.log('Server started, launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });
  const page = await browser.newPage();
  page.on('console', msg => process.stdout.write('[browser] ' + msg.text() + '\n'));
  page.on('pageerror', err => process.stderr.write('[err] ' + err.message + '\n'));

  await page.goto('http://localhost:7789/', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('Page loaded, waiting for compilation...');

  // Poll title for progress / completion
  let done = false;
  for (let i = 0; i < 360; i++) {
    await new Promise(r => setTimeout(r, 500));
    const title = await page.title();
    if (title.startsWith('progress:')) {
      process.stdout.write('\r' + title + '%   ');
    } else if (title === 'done' || title === 'error') {
      done = true;
      console.log('\nCompilation status:', title);
      break;
    }
  }

  if (!done) {
    console.error('Timed out');
    await browser.close(); server.close(); return;
  }

  const result = await page.evaluate(() => window.__result || null);
  const error  = await page.evaluate(() => window.__error  || null);
  await browser.close();
  server.close();

  if (error) { console.error('Error:', error); return; }
  if (result) {
    const buf = Buffer.from(result);
    fs.writeFileSync(OUTPUT, buf);
    console.log('Mind file written to', OUTPUT, '—', buf.length, 'bytes');
  }
});
