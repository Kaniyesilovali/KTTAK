// İMZA: Örgü — dağınık ipliklerin birbirine tutunarak örülmesi.
// Solda iplikler farklı yerlerden, farklı zamanlarda başlar ve kendi
// yollarında dalgalanır (tek tek insanlar). Sağa doğru birbirine yaklaşır
// ve tek bir halat gibi örülür (dayanışma). Sağ uç düz bir çizgiye inmez;
// örgü sürer. Renk logonun geçişidir: dağınıkken mavi, örülünce yeşil.
//
// Deterministik: her çalıştırmada aynı çizim çıkar.
//   node build/gen-orgu.js  ->  assets/img/orgu.svg
const fs = require('fs');
const path = require('path');

// H'de üstte ve altta 40px pay bırakılır: kutu basık kalıp görsel kırpıldığında
// (object-fit: cover) iplikler kenardan kesilmesin.
const W = 1440, H = 280, ORTA = H / 2;
const N = 5;               // iplik sayısı
const R = 13;              // örgünün yarıçapı
const P = 270;             // örgünün bir tam dönüş boyu (px)

let seed = 20261108;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

const yumusak = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Her iplik: başlangıç noktası, soldaki yüksekliği ve kendi dalgalanması
const iplikler = Array.from({ length: N }, (_, i) => ({
  bas: 48 + Math.round(rnd() * 240),                    // farklı zamanlarda katılır; nokta kenara değmez
  ofset: ((i + 0.5) / N - 0.5) * 150 + (rnd() - 0.5) * 8, // solda dağınık
  f1: 0.004 + rnd() * 0.004, f2: 0.011 + rnd() * 0.006,
  p1: rnd() * Math.PI * 2, p2: rnd() * Math.PI * 2,
  faz: (Math.PI * 2 * i) / N,                           // örgüdeki yeri
  kalinlik: 1.7 + rnd() * 0.5,
  saydam: 0.8 + rnd() * 0.2,
}));

function yol(ip) {
  const pts = [];
  for (let x = ip.bas; x <= W; x += 6) {
    const c = yumusak(W * 0.12, W * 0.62, x);           // 0 dağınık -> 1 örülü
    const gezinme = Math.sin(x * ip.f1 + ip.p1) * 9 + Math.sin(x * ip.f2 + ip.p2) * 4;
    const dagin = ip.ofset + gezinme;
    // Örgüye girerken yarıçap yavaşça açılır, halat sağa doğru hafifçe kalınlaşır
    const orgu = (R + 3 * yumusak(W * 0.6, W, x)) * Math.sin((2 * Math.PI * x) / P + ip.faz);
    pts.push([x, ORTA + (1 - c) * dagin + c * orgu]);
  }
  // Catmull-Rom -> kübik Bezier
  let d = `M ${pts[0][0]} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(2)}, ${p2[0]} ${p2[1].toFixed(2)}`;
  }
  return d;
}

// İki varyant: açık zemin (iç sayfa başlıkları) ve koyu zemin (kapak alanları).
// Koyu zeminde iplikler açık tonlardadır ve kalındır: dokunulabilir bir halat gibi.
const VARYANT = [
  { dosya: 'orgu.svg', kalin: 1, saydam: 1,
    renk: [[0, '#135E8B'], [0.3, '#10778C'], [0.55, '#4C9785'], [0.85, '#80B674']] },
  { dosya: 'orgu-gece.svg', kalin: 1.9, saydam: 1,
    renk: [[0, '#7FB4C9'], [0.35, '#8CC7C4'], [0.6, '#A9D6B4'], [0.9, '#C3E3B7']] },
];

for (const v of VARYANT) {
  const durak = v.renk.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  const yollar = iplikler.map((ip) =>
    `<path d="${yol(ip)}" vector-effect="non-scaling-stroke" stroke-width="${(ip.kalinlik * v.kalin).toFixed(2)}" stroke-opacity="${(ip.saydam * v.saydam).toFixed(2)}"/>`
  ).join('');
  // Her ipliğin başına küçük bir nokta: "buradan katıldı"
  const noktalar = iplikler.map((ip) => {
    const c = yumusak(W * 0.12, W * 0.62, ip.bas);
    const y = ORTA + (1 - c) * (ip.ofset + Math.sin(ip.bas * ip.f1 + ip.p1) * 9 + Math.sin(ip.bas * ip.f2 + ip.p2) * 4)
      + c * R * Math.sin((2 * Math.PI * ip.bas) / P + ip.faz);
    return `<circle cx="${ip.bas}" cy="${y.toFixed(2)}" r="${(2.6 * Math.sqrt(v.kalin)).toFixed(1)}"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="presentation"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">${durak}</linearGradient><linearGradient id="s" gradientUnits="userSpaceOnUse" x1="${W * 0.82}" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#s)"/></mask></defs><g mask="url(#m)"><g fill="none" stroke="url(#g)" stroke-linecap="round" stroke-linejoin="round">${yollar}</g><g fill="url(#g)">${noktalar}</g></g></svg>`;
  fs.writeFileSync(path.join(__dirname, '..', 'assets/img', v.dosya), svg);
  console.log(v.dosya, '—', (svg.length / 1024).toFixed(1), 'KB');
}
