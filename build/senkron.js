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

const KOK = path.join(__dirname, '..');
const P = (f) => fs.readFileSync(path.join(__dirname, 'parcalar', f), 'utf8').trim();

const parcalar = {
  tr: { baslik: P('baslik-tr.html'), altbilgi: P('altbilgi-tr.html') },
  en: { baslik: P('baslik-en.html'), altbilgi: P('altbilgi-en.html') },
};

// TR sayfası -> EN karşılığı. Dil değiştirici bu eşlemeyi kullanır.
const esles = {
  'index.html': 'index.html',
  'hakkimizda.html': 'about.html',
  'kurumsal.html': 'governance.html',
  'calisma-alanlarimiz.html': 'what-we-do.html',
  'haberler.html': 'news.html',
  'kaynaklar.html': 'resources.html',
  'bilgi-kirliligi.html': 'misinformation.html',
  'cocukla-konusmak.html': 'talking-to-children.html',
  'aile-afet-plani.html': 'family-disaster-plan.html',
  'uyku-ve-irkilme.html': 'sleep-and-startle.html',
  'yas.html': 'grief.html',
  'acil-canta.html': 'emergency-kit.html',
  'evde-guvenlik.html': 'home-safety.html',
  'ikincil-travma.html': 'secondary-trauma.html',
  'ilk-psikolojik-yardim.html': 'psychological-first-aid.html',
  'cocuk-dostu-alan.html': 'child-friendly-space.html',
  'ihtiyac-tespit-formu.html': 'needs-assessment-form.html',
  'okul-egitim-mufredati.html': 'school-curriculum.html',
  'gonullu.html': 'volunteer.html',
  'seffaflik.html': 'transparency.html',
  'iletisim.html': 'contact.html',
  'kvkk.html': 'privacy.html',
};
const tersEsles = Object.fromEntries(Object.entries(esles).map(([tr, en]) => [en, tr]));

function blokDegistir(html, ad, icerik) {
  const re = new RegExp(`(<!--#${ad}-->)[\\s\\S]*?(<!--/#${ad}-->)`);
  if (!re.test(html)) return { html, bulundu: false };
  return { html: html.replace(re, `$1\n${icerik}\n$2`), bulundu: true };
}

/** Bulunulan sayfanın menü bağlantısını işaretler. */
function aktifMenu(html, dosya) {
  return html.replace(/<a href="([^"]+)" data-nav class="([^"]*)"/g, (tam, href, sinif) => {
    const hedef = href.split('#')[0].replace(/^\.\//, '');
    if (hedef !== dosya) return tam;
    return `<a href="${href}" data-nav aria-current="page" class="${sinif} nav-aktif"`;
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
      .replaceAll('{{VARLIK}}', varlikOnek);

    let b = blokDegistir(html, 'BASLIK', aktifMenu(uygula(parcalar[dil].baslik), dosya));
    let a = blokDegistir(b.html, 'ALTBILGI', uygula(parcalar[dil].altbilgi));

    if (!b.bulundu && !a.bulundu) { atlanan.push(path.relative(KOK, tamYol)); continue; }

    fs.writeFileSync(tamYol, a.html);
    islenen++;
  }
}

console.log(`✓ ${islenen} sayfa senkronlandı.`);
if (atlanan.length) console.log('  işaretsiz (atlandı):', atlanan.join(', '));
