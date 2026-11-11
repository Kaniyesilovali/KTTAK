/**
 * Yayına hazırlık: siteyi derler, zip'ler ve eksikleri listeler.
 *   npm run paketle
 *
 * Sonuç:
 *   yayin/            → İÇİNDEKİLERİ FileZilla ile public_html/ içine sürükleyin
 *   tak-der-yayin.zip → (isteğe bağlı) cPanel "Dosya Yöneticisi"nden yükleyip
 *                       "Extract" ile açmak için; FileZilla'dan çok daha hızlı
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const KOK = path.join(__dirname, '..');
const YAYIN = path.join(KOK, 'yayin');
const ZIP = path.join(KOK, 'tak-der-yayin.zip');

function tumDosyalar(klasor) {
  return fs.readdirSync(klasor).flatMap((ad) => {
    const yol = path.join(klasor, ad);
    return fs.statSync(yol).isDirectory() ? tumDosyalar(yol) : [yol];
  });
}

console.log('1/2  Sayfalar, CSS ve sitemap hazırlanıyor…');
execSync('npm run yayina-hazirla', { cwd: KOK, stdio: 'inherit' });

// macOS'un bıraktığı çöpler sunucuya gitmesin
for (const d of tumDosyalar(YAYIN)) {
  if (['.DS_Store', 'Thumbs.db'].includes(path.basename(d))) fs.rmSync(d);
}

console.log('\n2/2  Zip hazırlanıyor…');
fs.rmSync(ZIP, { force: true });
let zipOldu = false;
try {
  execSync(`zip -qr -X "${ZIP}" .`, { cwd: YAYIN, stdio: 'ignore' });
  zipOldu = true;
} catch {
  console.log('  (zip komutu bulunamadı — yalnızca yayin/ klasörünü yükleyin)');
}

// Geçici değer uyarıları — README bölüm 2
const ayarlar = JSON.parse(fs.readFileSync(path.join(__dirname, 'ayarlar.json'), 'utf8'));
const uyarilar = [];
if (ayarlar._gecici) uyarilar.push('build/ayarlar.json hâlâ "_gecici" notu taşıyor — alan adı/e-posta geçici mi?');
for (const ag of ['instagram', 'facebook', 'linkedin']) {
  if (!ayarlar[ag] || ayarlar[ag] === '#') uyarilar.push(`${ag} bağlantısı boş ('#')`);
}
const dosyalar = tumDosyalar(YAYIN);
const formlu = dosyalar.filter((d) => d.endsWith('.html') && /action="#"/.test(fs.readFileSync(d, 'utf8')));
if (formlu.length) uyarilar.push(`${formlu.length} sayfadaki form hiçbir yere gönderilmiyor (action="#")`);

const bayt = dosyalar.reduce((t, d) => t + fs.statSync(d).size, 0);
console.log(`
✔ Hazır: yayin/  (${dosyalar.length} dosya, ${(bayt / 1024 / 1024).toFixed(1)} MB)${zipOldu ? '\n✔ Hazır: tak-der-yayin.zip' : ''}

FileZilla ile yükleme:
  1. Sunucuya bağlanın, sağ tarafta public_html/ (veya httpdocs/) klasörüne girin.
  2. Sol tarafta bu projedeki yayin/ klasörünün İÇİNE girin.
  3. Sunucu menüsü → "Gizli dosyaları göstermeye zorla" açık olsun (.htaccess için).
  4. Soldaki her şeyi seçip (Cmd+A) sağa sürükleyin. Üzerine yaz sorulursa: "Üzerine yaz".
`);

if (uyarilar.length) {
  console.log('⚠ Yayından önce dikkat:');
  for (const u of uyarilar) console.log('  - ' + u);
  console.log('');
}
