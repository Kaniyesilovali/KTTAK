/**
 * Yayın paketi: sunucuya yüklenecek her şeyi tek klasörde toplar.
 *   npm run paketle
 *
 * Sonuç:
 *   yayin/            → İÇİNDEKİLERİ FileZilla ile public_html/ içine sürükleyin
 *   tak-der-yayin.zip → (isteğe bağlı) cPanel "Dosya Yöneticisi"nden yükleyip
 *                       "Extract" ile açmak için; FileZilla'dan çok daha hızlı
 *
 * Önce `npm run yayina-hazirla` çalıştırılır (sayfalar, CSS, sitemap güncellenir).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const KOK = path.join(__dirname, '..');
const HEDEF = path.join(KOK, 'yayin');
const ZIP = path.join(KOK, 'tak-der-yayin.zip');

// Sunucuya gidecekler (kökteki .html dosyaları ayrıca eklenir)
const KLASORLER = ['assets', 'en'];
const DOSYALAR = ['robots.txt', 'sitemap.xml', '.htaccess'];

// Bu adlar hiçbir klasörden kopyalanmaz
const ATLA = new Set(['.DS_Store', 'Thumbs.db', 'BURAYA-BELGELERI-KOYUN.txt']);

function kopyala(kaynak, hedef) {
  const bilgi = fs.statSync(kaynak);
  if (bilgi.isDirectory()) {
    fs.mkdirSync(hedef, { recursive: true });
    for (const ad of fs.readdirSync(kaynak)) {
      if (ATLA.has(ad)) continue;
      kopyala(path.join(kaynak, ad), path.join(hedef, ad));
    }
  } else {
    fs.copyFileSync(kaynak, hedef);
  }
}

function say(klasor) {
  let adet = 0, bayt = 0;
  for (const ad of fs.readdirSync(klasor)) {
    const yol = path.join(klasor, ad);
    const b = fs.statSync(yol);
    if (b.isDirectory()) { const a = say(yol); adet += a.adet; bayt += a.bayt; }
    else { adet++; bayt += b.size; }
  }
  return { adet, bayt };
}

console.log('1/3  Sayfalar, CSS ve sitemap hazırlanıyor…');
execSync('npm run yayina-hazirla', { cwd: KOK, stdio: 'inherit' });

console.log('\n2/3  yayin/ klasörü oluşturuluyor…');
fs.rmSync(HEDEF, { recursive: true, force: true });
fs.mkdirSync(HEDEF);

const htmller = fs.readdirSync(KOK).filter((ad) => ad.endsWith('.html'));
for (const ad of htmller) kopyala(path.join(KOK, ad), path.join(HEDEF, ad));
for (const ad of [...KLASORLER, ...DOSYALAR]) {
  const kaynak = path.join(KOK, ad);
  if (!fs.existsSync(kaynak)) { console.error(`  ✗ Eksik: ${ad}`); process.exit(1); }
  kopyala(kaynak, path.join(HEDEF, ad));
}

// Geçici değer uyarısı — README 2.1
const ayarlar = JSON.parse(fs.readFileSync(path.join(__dirname, 'ayarlar.json'), 'utf8'));
const uyarilar = [];
if (ayarlar._gecici) uyarilar.push('build/ayarlar.json hâlâ "_gecici" notu taşıyor — alan adı/e-posta geçici mi?');
for (const ag of ['instagram', 'facebook', 'linkedin']) {
  if (!ayarlar[ag] || ayarlar[ag] === '#') uyarilar.push(`${ag} bağlantısı boş ('#')`);
}
const formSayisi = htmller.concat(fs.readdirSync(path.join(KOK, 'en')).map((a) => 'en/' + a))
  .filter((a) => a.endsWith('.html'))
  .filter((a) => /action="#"/.test(fs.readFileSync(path.join(KOK, a), 'utf8'))).length;
if (formSayisi) uyarilar.push(`${formSayisi} sayfadaki form hiçbir yere gönderilmiyor (action="#")`);

console.log('\n3/3  Zip hazırlanıyor…');
fs.rmSync(ZIP, { force: true });
let zipOldu = false;
try {
  execSync(`zip -qr -X "${ZIP}" .`, { cwd: HEDEF, stdio: 'ignore' });
  zipOldu = true;
} catch {
  console.log('  (zip komutu bulunamadı — yalnızca yayin/ klasörü hazırlandı)');
}

const { adet, bayt } = say(HEDEF);
console.log(`
✔ Hazır: yayin/  (${adet} dosya, ${(bayt / 1024 / 1024).toFixed(1)} MB)${zipOldu ? '\n✔ Hazır: tak-der-yayin.zip' : ''}

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
