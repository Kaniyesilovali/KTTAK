/** sitemap.xml ve robots.txt üretir. Alan adı: build/ayarlar.json */
const fs = require('fs'), path = require('path');
const SITE = require('./ayarlar.json').alanAdi;
const sayfalar = require('./sayfalar.json').filter(s => s.dosya !== '404.html');
const bugun = new Date().toISOString().slice(0, 10);

const url = (s) => {
  const dil = s.dil;
  const yol = `${SITE}/${dil === 'tr' ? '' : 'en/'}${s.dosya === 'index.html' ? '' : s.dosya}`;
  const tr = dil === 'tr' ? s.dosya : s.es;
  const en = dil === 'tr' ? s.es : s.dosya;
  return `  <url>
    <loc>${yol}</loc>
    <lastmod>${bugun}</lastmod>
    <changefreq>${s.dosya === 'index.html' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${s.dosya === 'index.html' ? '1.0' : '0.7'}</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE}/${tr === 'index.html' ? '' : tr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/${en === 'index.html' ? '' : en}"/>
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sayfalar.map(url).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), xml);

fs.writeFileSync(path.join(__dirname, '..', 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log(`✓ sitemap.xml — ${sayfalar.length} adres · robots.txt güncellendi`);
