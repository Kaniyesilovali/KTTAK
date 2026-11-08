/**
 * Tek seferlik iskele: build/govde/ içindeki gövdeleri tam bağımsız
 * HTML sayfalarına sarar. Var olan sayfanın üzerine YAZMAZ (--force hariç).
 */
const fs = require('fs');
const path = require('path');
const KOK = path.join(__dirname, '..');
const force = process.argv.includes('--force');
const ayarlar = require('./ayarlar.json');
const SITE = ayarlar.alanAdi;

const sayfalar = require('./sayfalar.json');

const FONT = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Fraunces:opsz,wght,SOFT@9..144,400..600,0..100&display=swap';

function kurulus(dil) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: dil === 'tr' ? ayarlar.resmiAdTR : ayarlar.resmiAdEN,
    alternateName: ayarlar.kisaAd,
    url: SITE + (dil === 'tr' ? '/' : '/en/'),
    logo: SITE + '/assets/img/logo-yazili-renkli-800.png',
    email: ayarlar.eposta,
    // Açık adres bilinçli olarak yayımlanmaz (merkez bir üyenin konutu); yalnızca ilçe.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lefkoşa',
      addressCountry: 'CY',
    },
    sameAs: [ayarlar.instagram, ayarlar.facebook, ayarlar.linkedin].filter((u) => u && u !== '#'),
    areaServed: 'CY',
    knowsLanguage: ['tr', 'en'],
  }, null, 2);
}

let yazilan = 0, korunan = [];

for (const s of sayfalar) {
  const dil = s.dil;
  const cikti = path.join(KOK, dil === 'tr' ? '' : 'en', s.dosya);
  if (fs.existsSync(cikti) && !force) { korunan.push(path.relative(KOK, cikti)); continue; }

  const govdeYolu = path.join(__dirname, 'govde', `${dil}-${s.dosya}`);
  if (!fs.existsSync(govdeYolu)) continue;
  const govde = fs.readFileSync(govdeYolu, 'utf8').trim()
    .replaceAll('{{EPOSTA}}', ayarlar.eposta)
    .replaceAll('{{INSTAGRAM}}', ayarlar.instagram)
    .replaceAll('{{FACEBOOK}}', ayarlar.facebook)
    .replaceAll('{{LINKEDIN}}', ayarlar.linkedin);

  const varlik = dil === 'tr' ? 'assets/' : '../assets/';
  const trYol = dil === 'tr' ? s.dosya : s.es;
  const enYol = dil === 'tr' ? s.es : s.dosya;
  const kanonik = SITE + '/' + (dil === 'tr' ? '' : 'en/') + (s.dosya === 'index.html' ? '' : s.dosya);
  const atla = dil === 'tr' ? 'İçeriğe geç' : 'Skip to content';

  const html = `<!doctype html>
<html lang="${dil}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.baslik}</title>
<meta name="description" content="${s.aciklama}">
<link rel="canonical" href="${kanonik}">
<link rel="alternate" hreflang="tr" href="${SITE}/${trYol === 'index.html' ? '' : trYol}">
<link rel="alternate" hreflang="en" href="${SITE}/en/${enYol === 'index.html' ? '' : enYol}">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${ayarlar.kisaAd}">
<meta property="og:locale" content="${dil === 'tr' ? 'tr_TR' : 'en_US'}">
<meta property="og:title" content="${s.baslik}">
<meta property="og:description" content="${s.aciklama}">
<meta property="og:url" content="${kanonik}">
<meta name="theme-color" content="#135e8b">
<meta property="og:image" content="${SITE}/assets/img/og-gorsel.png">
<link rel="icon" href="${varlik}img/favicon.ico" sizes="32x32">
<link rel="icon" href="${varlik}img/logo-isaret-512.png" type="image/png" sizes="512x512">
<link rel="apple-touch-icon" href="${varlik}img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT}">
<link rel="stylesheet" href="${varlik}css/site.css">
<script type="application/ld+json">
${kurulus(dil)}
</script>
</head>
<body>
<a href="#icerik" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:bg-orman focus:text-kagit focus:px-4 focus:py-2 focus:rounded">${atla}</a>

<!--#BASLIK--><!--/#BASLIK-->

<main id="icerik">
${govde}
</main>

<!--#ALTBILGI--><!--/#ALTBILGI-->

<script src="${varlik}js/site.js" defer></script>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(cikti), { recursive: true });
  fs.writeFileSync(cikti, html);
  yazilan++;
}

console.log(`✓ ${yazilan} sayfa oluşturuldu.`);
if (korunan.length) console.log(`  korundu (üzerine yazılmadı): ${korunan.length}`);
