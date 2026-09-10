// Sarsıntıdan sakinliğe çözülen hat.
// Sol: P dalgası öncülü -> S dalgası patlaması -> üstel sönüm -> düz zemin çizgisi.
const W = 1440, H = 160, base = H / 2;

// Deterministik gürültü (her derlemede aynı çizgi çıksın diye)
let seed = 20260910;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

function amp(x) {
  if (x < 90) return 0;                              // sessizlik
  if (x < 190) return 6 * ((x - 90) / 100);          // P dalgası öncülü
  if (x < 250) return 6 + 56 * ((x - 190) / 60);     // S dalgası: ani yükseliş
  const t = (x - 250) / 620;                         // sönüm
  return 62 * Math.exp(-3.1 * t);
}

const pts = [];
for (let x = 0; x <= W; x += 4) {
  const a = amp(x);
  let y = base;
  if (a > 0.35) {
    // hızlı salınım + hafif gürültü
    y = base + Math.sin(x / 5.5) * a * (0.72 + rnd() * 0.28) + (rnd() - 0.5) * a * 0.22;
  }
  pts.push([x, Math.round(y * 100) / 100]);
}

// Catmull-Rom -> kübik Bezier: köşeleri yumuşat, hat elle çizilmiş gibi aksın
let d = `M ${pts[0][0]} ${pts[0][1]}`;
for (let i = 0; i < pts.length - 1; i++) {
  const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
  const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
  const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
  d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
}

// CSS mask-image yerel dosya (file://) altında Chrome'da engelleniyor.
// Bu yüzden hat, renkleri gömülü iki ayrı dosya olarak <img> ile kullanılır.
const fs = require('fs');
for (const [ad, renk, kalinlik] of [['sismik-koyu', '#1e4a44', 2.25], ['sismik-acik', '#f7f8f4', 2]]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none" role="presentation"><path d="${d}" fill="none" stroke="${renk}" stroke-width="${kalinlik}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  fs.writeFileSync(`/Users/mac14/kttak/assets/img/${ad}.svg`, svg);
  console.log(`${ad}.svg —`, (svg.length / 1024).toFixed(1), 'KB');
}
