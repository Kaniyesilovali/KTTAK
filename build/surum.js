/**
 * Önbellek kırıcı: site.css ve site.js bağlantılarına içerik özetinden
 * bir sürüm eki ekler (site.css?v=ab12cd34).
 *
 * .htaccess CSS/JS dosyalarını 1 yıl önbellekte tutar. Ek olmadan,
 * yeni HTML yüklendiğinde tarayıcı eski CSS'i kullanmaya devam eder ve
 * sayfa stilsiz görünür. Dosya değişince ek değişir, tarayıcı yenisini indirir.
 *
 * Kullanım: node build/surum.js  (yayina-hazirla içinde, CSS derlendikten sonra)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KOK = path.join(__dirname, '..', 'yayin');
const ozet = (f) => crypto.createHash('sha1').update(fs.readFileSync(path.join(KOK, f))).digest('hex').slice(0, 8);
const surum = { 'site.css': ozet('assets/css/site.css'), 'site.js': ozet('assets/js/site.js') };

let degisen = 0;
for (const klasor of [KOK, path.join(KOK, 'en')]) {
  for (const dosya of fs.readdirSync(klasor).filter((f) => f.endsWith('.html'))) {
    const yol = path.join(klasor, dosya);
    const eski = fs.readFileSync(yol, 'utf8');
    const yeni = eski.replace(/(assets\/(?:css|js)\/)(site\.(?:css|js))(\?v=[0-9a-f]+)?"/g,
      (_, onek, ad) => `${onek}${ad}?v=${surum[ad]}"`);
    if (yeni !== eski) { fs.writeFileSync(yol, yeni); degisen++; }
  }
}
console.log(`✓ sürüm eki — site.css?v=${surum['site.css']} · site.js?v=${surum['site.js']} · ${degisen} sayfa`);
