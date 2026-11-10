/**
 * Ortak başlık ve altbilgiyi tüm sayfalara işler.
 *
 * Sayfalar tam bağımsız, elle düzenlenebilir statik HTML olarak kalır —
 * FileZilla ile olduğu gibi yüklenir. Bu araç yalnızca menü/altbilgi
 * gibi her sayfada tekrar eden blokları tek kaynaktan güncellemek içindir.
 *
 * Kullanım:  npm run senkron
 */
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..', 'yayin');
const ayarlar = require('./ayarlar.json');
const P = (f) => fs.readFileSync(path.join(__dirname, 'parcalar', f), 'utf8').trim();

const parcalar = {
  tr: { baslik: P('baslik-tr.html'), altbilgi: P('altbilgi-tr.html') },
  en: { baslik: P('baslik-en.html'), altbilgi: P('altbilgi-en.html') },
};

// TR sayfası -> EN karşılığı. Dil değiştirici bu eşlemeyi kullanır.
// Tek kaynak: sayfalar.json (her TR kaydının "es" alanı).
const esles = Object.fromEntries(
  require('./sayfalar.json').filter((s) => s.dil === 'tr').map((s) => [s.dosya, s.es])
);
const tersEsles = Object.fromEntries(Object.entries(esles).map(([tr, en]) => [en, tr]));

function blokDegistir(html, ad, icerik) {
  const re = new RegExp(`(<!--#${ad}-->)[\\s\\S]*?(<!--/#${ad}-->)`);
  if (!re.test(html)) return { html, bulundu: false };
  return { html: html.replace(re, `$1\n${icerik}\n$2`), bulundu: true };
}

/**
 * Bulunulan sayfanın menü bağlantısını işaretler.
 * Üst menüdeki bir bölüm bağlantısı data-grup="a.html b.html" taşıyabilir;
 * o zaman bölümün alt sayfalarında da bölüm başlığı etkin görünür.
 */
function aktifMenu(html, dosya) {
  return html.replace(/<a href="([^"]+)" data-nav( data-grup="([^"]*)")? class="([^"]*)"/g, (tam, href, _g, grup, sinif) => {
    const hedef = href.split('#')[0].replace(/^\.\//, '');
    const altlar = grup ? grup.split(/\s+/) : [];
    if (hedef !== dosya && !altlar.includes(dosya)) return tam;
    const ozellik = hedef === dosya ? ' aria-current="page"' : '';
    return `<a href="${href}" data-nav${_g || ''}${ozellik} class="${sinif} nav-aktif"`;
  });
}

let islenen = 0, atlanan = [];

for (const dil of ['tr', 'en']) {
  const klasor = dil === 'tr' ? KOK : path.join(KOK, 'en');
  if (!fs.existsSync(klasor)) continue;

  for (const dosya of fs.readdirSync(klasor).filter((f) => f.endsWith('.html'))) {
    const tamYol = path.join(klasor, dosya);
    let html = fs.readFileSync(tamYol, 'utf8');

    // TR sayfaları kökte (önek yok), EN sayfaları en/ içinde birbirine bağlanır.
    const kokOnek = '';
    const varlikOnek = dil === 'tr' ? '' : '../';
    const altDil = dil === 'tr'
      ? `en/${esles[dosya] || 'index.html'}`
      : `../${tersEsles[dosya] || 'index.html'}`;

    const uygula = (parca) => parca
      .replaceAll('{{KOK}}', kokOnek)
      .replaceAll('{{ALTDIL}}', altDil)
      .replaceAll('{{VARLIK}}', varlikOnek)
      .replaceAll('{{EPOSTA}}', ayarlar.eposta)
      .replaceAll('{{INSTAGRAM}}', ayarlar.instagram)
      .replaceAll('{{FACEBOOK}}', ayarlar.facebook)
      .replaceAll('{{LINKEDIN}}', ayarlar.linkedin);

    let b = blokDegistir(html, 'BASLIK', aktifMenu(uygula(parcalar[dil].baslik), dosya));
    let a = blokDegistir(b.html, 'ALTBILGI', uygula(parcalar[dil].altbilgi));

    if (!b.bulundu && !a.bulundu) { atlanan.push(path.relative(KOK, tamYol)); continue; }

    fs.writeFileSync(tamYol, a.html);
    islenen++;
  }
}

console.log(`✓ ${islenen} sayfa senkronlandı.`);
if (atlanan.length) console.log('  işaretsiz (atlandı):', atlanan.join(', '));
