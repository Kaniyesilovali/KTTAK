/**
 * Yerel önizleme sunucusu. Bağımlılık yok.
 *   npm run sunucu          → http://localhost:8080
 *   PORT=3000 npm run sunucu
 *
 * Sunucudaki davranışı taklit eder: klasörlerde index.html, bulunamayan
 * adreslerde gerçek 404.html (Türkçe kökte, /en/ altında İngilizce).
 * Not: .htaccess kuralları burada çalışmaz, onlar Apache'ye özgüdür.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..', 'yayin');
const PORT = Number(process.env.PORT) || 8080;

const TIPLER = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

// build/ ve node_modules/ tarayıcıya kapalı — sunucuya da yüklenmiyorlar
const YASAK = [/^\/build\//, /^\/node_modules\//, /^\/package(-lock)?\.json$/, /^\/\.git/];

http.createServer((istek, yanit) => {
  let yol;
  try { yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname); }
  catch { yanit.writeHead(400).end('Hatalı adres'); return; }

  if (YASAK.some((d) => d.test(yol))) return dosyaYok(yol, yanit);

  let hedef = path.normalize(path.join(KOK, yol));
  if (!hedef.startsWith(KOK)) return dosyaYok(yol, yanit); // dizin dışına çıkma

  if (fs.existsSync(hedef) && fs.statSync(hedef).isDirectory()) {
    hedef = path.join(hedef, 'index.html');
  }

  fs.readFile(hedef, (hata, veri) => {
    if (hata) return dosyaYok(yol, yanit);
    yanit.writeHead(200, {
      'Content-Type': TIPLER[path.extname(hedef).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store', // önizlemede hep en güncel hâli görün
    });
    yanit.end(veri);
  });
}).listen(PORT, () => {
  console.log(`\n  Travma Afet Kriz Derneği — yerel önizleme\n`);
  console.log(`  Türkçe    http://localhost:${PORT}/`);
  console.log(`  English   http://localhost:${PORT}/en/`);
  console.log(`\n  Durdurmak için Ctrl+C\n`);
});

function dosyaYok(yol, yanit) {
  const dil404 = yol.startsWith('/en/') ? 'en/404.html' : '404.html';
  fs.readFile(path.join(KOK, dil404), (hata, veri) => {
    yanit.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    yanit.end(hata ? '404 — sayfa bulunamadı' : veri);
  });
}
