/* KTTAK — arayüz davranışları. Bağımlılık yok, derleme yok. */
(function () {
  'use strict';

  /* --- Mobil menü --- */
  var acButon = document.querySelector('[data-menu-ac]');
  var menu = document.getElementById('mobil-menu');

  if (acButon && menu) {
    acButon.addEventListener('click', function () {
      var acik = acButon.getAttribute('aria-expanded') === 'true';
      acButon.setAttribute('aria-expanded', String(!acik));
      menu.hidden = acik;
      document.documentElement.classList.toggle('menu-acik', !acik);
      acButon.querySelector('.sr-only').textContent = acik ? 'Menüyü aç' : 'Menüyü kapat';
    });

    // Menüdeki bir bağlantıya basınca kapat. Aynı sayfadaki bir bölüme
    // (#çapa) giden bağlantılarda sayfa yenilenmediği için menü açık kalıyordu.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href]') && acButon.getAttribute('aria-expanded') === 'true') acButon.click();
    });

    // Esc ile kapat — her yerde tutarlı bir çıkış yolu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && acButon.getAttribute('aria-expanded') === 'true') {
        acButon.click();
        acButon.focus();
      }
    });
  }

  /* --- Masaüstü açılır menü ---
     Panel :focus-within ile açık durur; aynı sayfadaki bir bölüme gidilince
     odak bağlantıda kaldığı için panel içeriğin üstünde asılı kalıyordu. */
  document.querySelectorAll('.menu-panel').forEach(function (panel) {
    panel.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (a) a.blur();
    });
  });

  /* --- Altbilgideki yıl --- */
  var yil = document.querySelector('[data-yil]');
  if (yil) yil.textContent = String(new Date().getFullYear());

  /* --- IBAN kopyala --- */
  document.querySelectorAll('[data-kopyala]').forEach(function (dugme) {
    dugme.addEventListener('click', function () {
      var deger = dugme.getAttribute('data-kopyala').replace(/\s+/g, '');
      var bildir = function (metin) {
        var eski = dugme.dataset.eskiMetin || dugme.textContent;
        dugme.dataset.eskiMetin = eski;
        dugme.textContent = metin;
        setTimeout(function () { dugme.textContent = eski; }, 2400);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(deger).then(
          function () { bildir(dugme.dataset.basarili || 'Kopyalandı'); },
          function () { bildir(dugme.dataset.hata || 'Kopyalanamadı — elle seçin'); }
        );
      } else {
        bildir(dugme.dataset.hata || 'Kopyalanamadı — elle seçin');
      }
    });
  });

  /* --- Bağış tutarı seçimi --- */
  var tutarAlan = document.getElementById('tutar');
  document.querySelectorAll('[data-tutar]').forEach(function (dugme) {
    dugme.addEventListener('click', function () {
      document.querySelectorAll('[data-tutar]').forEach(function (d) {
        d.setAttribute('aria-pressed', 'false');
      });
      dugme.setAttribute('aria-pressed', 'true');
      if (tutarAlan) tutarAlan.value = dugme.getAttribute('data-tutar');
    });
  });
})();

/* --- Sözlük: terim arama (sozluk.html / glossary.html) --- */
(function () {
  'use strict';
  var ara = document.querySelector('[data-sozluk-ara]');
  if (!ara) return;
  var terimler = Array.prototype.slice.call(document.querySelectorAll('[data-sozluk] [data-terim]'));
  var bos = document.querySelector('[data-sozluk-bos]');
  var sade = function (s) {
    return s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
  };
  ara.addEventListener('input', function () {
    var q = sade(ara.value.trim());
    var gorunen = 0;
    terimler.forEach(function (t) {
      var eslesir = !q || sade(t.textContent).indexOf(q) !== -1;
      t.hidden = !eslesir;
      if (eslesir) gorunen++;
    });
    if (bos) bos.hidden = gorunen !== 0;
  });
})();

/* --- Kütüphane: konuya ve dile göre süzgeç (kutuphane.html / library.html) ---
   Konu: belgenin altında bulunduğu <h3 id>. Dil: başlıktaki lang="en" işareti. */
(function () {
  'use strict';
  var kutu = document.querySelector('[data-kutuphane-suzgec]');
  if (!kutu) return;
  var bolum = kutu.closest('section');
  var secim = { konu: '', dil: '' };
  var belgeler = [];
  bolum.querySelectorAll('h3[id]').forEach(function (h3) {
    var liste = h3.nextElementSibling;
    while (liste && liste.tagName !== 'UL') liste = liste.nextElementSibling;
    if (!liste) return;
    liste.querySelectorAll(':scope > li').forEach(function (li) {
      var baslik = li.querySelector('p');
      var dil = baslik && baslik.querySelector('[lang="en"]') ? 'en' : 'tr';
      belgeler.push({ li: li, konu: h3.id, dil: dil, h3: h3, ul: liste });
    });
  });
  var bos = bolum.querySelector('[data-suzgec-bos]');
  // Her düğmeye belge sayısını ekle: boş bir süzgeç (ör. henüz Türkçe belge yok) seçilmeden görünsün.
  kutu.querySelectorAll('[data-grup]').forEach(function (grup) {
    var ad = grup.getAttribute('data-grup');
    grup.querySelectorAll('button').forEach(function (d) {
      var deger = d.getAttribute('data-' + ad);
      var n = belgeler.filter(function (b) { return !deger || b[ad] === deger; }).length;
      var sayi = document.createElement('span');
      sayi.className = 'suzgec-sayi';
      sayi.textContent = String(n);
      d.appendChild(sayi);
    });
  });
  var uygula = function () {
    var gorunen = 0, dolu = {};
    belgeler.forEach(function (b) {
      var ok = (!secim.konu || b.konu === secim.konu) && (!secim.dil || b.dil === secim.dil);
      b.li.hidden = !ok;
      if (ok) { gorunen++; dolu[b.konu] = true; }
    });
    belgeler.forEach(function (b) { b.h3.hidden = !dolu[b.konu]; b.ul.hidden = !dolu[b.konu]; });
    if (bos) bos.hidden = gorunen !== 0;
    // Sonsuz kaydırma varsa süzülmüş listeyle baştan başlasın
    var sonsuz = bolum.querySelector('[data-sonsuz]') || bolum.closest('[data-sonsuz]');
    if (sonsuz) sonsuz.dispatchEvent(new CustomEvent('sonsuz:yenile'));
  };
  kutu.querySelectorAll('[data-grup]').forEach(function (grup) {
    var ad = grup.getAttribute('data-grup');
    grup.querySelectorAll('button').forEach(function (d) {
      d.addEventListener('click', function () {
        secim[ad] = d.getAttribute('data-' + ad);
        grup.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === d)); });
        uygula();
      });
    });
  });
})();

/* --- Sonsuz kaydırma: [data-sonsuz="N"] (kutuphane.html 5.2, haberler.html) ---
   Tüm öğeler HTML'de durur: JS'siz ziyaretçi, arama motoru ve yazdırma tam
   listeyi görür. Betik ilk N öğeden sonrasını gizler; liste sonuna yaklaşınca
   sıradaki N öğeyi açar. "Daha fazla göster" düğmesi her zaman vardır —
   klavye ve ekran okuyucu kullanıcıları için. Kapsayıcı bir <ul>/<ol> ise
   öğeleri onun <li>'leridir; değilse içindeki listelerin <li>'leri sırayla
   tek akış sayılır ve tümüyle kapalı kalan listenin başlığı da gizlenir.
   Süzgeç gibi başka bir betik öğeleri [hidden] ile gizleyebilir; değişince
   kapsayıcıya 'sonsuz:yenile' olayı gönderir, sayfalama baştan başlar. */
(function () {
  'use strict';
  var en = document.documentElement.lang === 'en';
  var metin = en
    ? { daha: 'Show more', kalan: function (n) { return n + ' left'; }, acildi: function (n) { return n + ' more items shown.'; } }
    : { daha: 'Daha fazla göster', kalan: function (n) { return n + ' kaldı'; }, acildi: function (n) { return n + ' öğe daha gösterildi.'; } };
  var LISTE = /^(UL|OL)$/;
  var BASLIK = /^H[2-6]$/;

  document.querySelectorAll('[data-sonsuz]').forEach(function (kap) {
    var adim = parseInt(kap.getAttribute('data-sonsuz'), 10) || 10;
    var tekListe = LISTE.test(kap.tagName);
    var listeler = tekListe ? [kap] : Array.prototype.filter.call(
      kap.querySelectorAll('ul, ol'), function (l) { return !l.parentElement.closest('li'); });
    var ogeler = [];
    listeler.forEach(function (l) {
      Array.prototype.forEach.call(l.children, function (li) { if (li.tagName === 'LI') ogeler.push(li); });
    });
    if (ogeler.length <= adim) return;

    var acik = adim;
    var adaylar = function () { return ogeler.filter(function (li) { return !li.hidden; }); };
    var gorunur = function (li) { return !li.hidden && !li.hasAttribute('data-sonsuz-gizli'); };

    var cubuk = document.createElement('div');
    cubuk.className = 'sonsuz-cubuk yazdir-yok';
    var dugme = document.createElement('button');
    dugme.type = 'button';
    dugme.className = 'dugme dugme-ikincil';
    var canli = document.createElement('p');
    canli.className = 'sr-only';
    canli.setAttribute('aria-live', 'polite');
    cubuk.appendChild(dugme);
    cubuk.appendChild(canli);
    if (tekListe) kap.parentNode.insertBefore(cubuk, kap.nextSibling);
    else kap.appendChild(cubuk);

    var ciz = function () {
      var liste = adaylar();
      ogeler.forEach(function (li) { li.removeAttribute('data-sonsuz-gizli'); });
      liste.forEach(function (li, i) { if (i >= acik) li.setAttribute('data-sonsuz-gizli', ''); });
      if (!tekListe) {
        // Hiç açık öğesi kalmayan listeyi ve ondan önceki başlığa kadar olan her şeyi gizle
        listeler.forEach(function (l) {
          var bos = !Array.prototype.some.call(l.children, gorunur);
          var parca = [l], s = l.previousElementSibling;
          while (s && !LISTE.test(s.tagName) && !s.hasAttribute('data-kutuphane-suzgec')) {
            parca.push(s);
            if (BASLIK.test(s.tagName)) break;
            s = s.previousElementSibling;
          }
          if (!s || !BASLIK.test(s.tagName)) parca = [l];
          parca.forEach(function (el) {
            if (bos) el.setAttribute('data-sonsuz-gizli', ''); else el.removeAttribute('data-sonsuz-gizli');
          });
        });
      }
      var kalan = Math.max(0, liste.length - acik);
      cubuk.hidden = kalan === 0;
      dugme.textContent = metin.daha + ' (' + metin.kalan(kalan) + ')';
    };

    var ac = function (odakla) {
      var once = adaylar().filter(gorunur);
      acik += adim;
      ciz();
      var yeni = adaylar().filter(gorunur).filter(function (li) { return once.indexOf(li) === -1; });
      if (!yeni.length) return;
      canli.textContent = metin.acildi(yeni.length);
      if (odakla) {
        var hedef = yeni[0].querySelector('a[href], button');
        if (hedef) hedef.focus();
      }
    };

    dugme.addEventListener('click', function () { ac(true); });

    var gozcu = null;
    kap.addEventListener('sonsuz:yenile', function () {
      acik = adim;
      ciz();
      if (gozcu) { gozcu.unobserve(cubuk); gozcu.observe(cubuk); }
    });

    // Bağlantı listedeki bir başlığa/öğeye gidiyorsa (ör. kutuphane.html#dogrulama) oraya kadar aç
    var hedefeAc = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      var h = id && document.getElementById(id);
      if (!h || !kap.contains(h)) return;
      var li = h.closest('li');
      if (!li) {
        var s = h.nextElementSibling;
        while (s && !LISTE.test(s.tagName)) s = s.nextElementSibling;
        li = s && s.firstElementChild;
      }
      var i = adaylar().indexOf(li);
      if (i === -1 || i < acik) return;
      acik = i + adim;
      ciz();
      h.scrollIntoView();
      // Sayfa ilk açılırken yazı tipleri/görseller sonradan yerleşince konum kayar
      if (document.readyState !== 'complete') {
        window.addEventListener('load', function () { h.scrollIntoView(); }, { once: true });
      }
    };

    ciz();
    hedefeAc();
    window.addEventListener('hashchange', hedefeAc);

    // Çubuk görüş alanına yaklaşınca otomatik aç. Açtıktan sonra çubuk hâlâ
    // yakındaysa (kısa öğeler) yeniden gözle ki zincir sürsün.
    if ('IntersectionObserver' in window) {
      gozcu = new IntersectionObserver(function (girdiler) {
        if (!girdiler[0].isIntersecting || cubuk.hidden) return;
        ac(false);
        gozcu.unobserve(cubuk);
        if (!cubuk.hidden) requestAnimationFrame(function () { gozcu.observe(cubuk); });
      }, { rootMargin: '0px 0px 300px 0px' });
      gozcu.observe(cubuk);
    }
  });
})();

/* --- Canlı örgü: sitedeki tüm örgüler ---
   · img.orgu (kapak, ana sayfa bantları, altbilgi şeridi) yerine aynı yerde
     canlı çizilen bir <svg class="orgu …"> konur; sınıflar korunur.
   · .sayfa-basi'nin arka planındaki orgu.svg yerine içine .orgu-katman eklenir
     (konum/ölçü input.css'te; .orgu-js arka plan görselini kaldırır).
   Çizim build/gen-orgu.js ile aynı tohum ve ölçüleri kullanır: iplikler
   başlangıç noktalarından farklı zamanlarda uzar, örgüye katılır; sonra halat
   sağa doğru yavaşça akar, dağınık uçlar hafifçe salınır. Açılış, örgü ilk kez
   görüş alanına girdiğinde oynar. Travma-bilinçli: yavaş, sürekli, ani hareket
   yok. Hareket azaltma tercihinde ya da JS yoksa sabit görseller kalır.
   Görüş alanı dışındaki örgüler ve gizli sekme çizilmez; tek döngü hepsini sürer. */
(function () {
  'use strict';
  if (!window.requestAnimationFrame || !window.matchMedia) return;
  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  var imgler = document.querySelectorAll('img.orgu');
  var basliklar = document.querySelectorAll('.sayfa-basi');
  if (!imgler.length && !basliklar.length) return;

  // gen-orgu.js ile birebir aynı parametreler
  var W = 1440, H = 280, ORTA = H / 2, N = 5, R = 13, P = 270;
  var seed = 20261108;
  var rnd = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  var yumusak = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  var iplikler = [];
  for (var i = 0; i < N; i++) {
    iplikler.push({
      bas: 48 + Math.round(rnd() * 240),
      ofset: ((i + 0.5) / N - 0.5) * 150 + (rnd() - 0.5) * 8,
      f1: 0.004 + rnd() * 0.004, f2: 0.011 + rnd() * 0.006,
      p1: rnd() * Math.PI * 2, p2: rnd() * Math.PI * 2,
      faz: (Math.PI * 2 * i) / N,
      kalinlik: 1.7 + rnd() * 0.5,
      saydam: 0.8 + rnd() * 0.2
    });
  }
  var VARYANT = {
    acik: { kalin: 1, renk: [[0, '#135E8B'], [0.3, '#10778C'], [0.55, '#4C9785'], [0.85, '#80B674']] },
    gece: { kalin: 1.9, renk: [[0, '#7FB4C9'], [0.35, '#8CC7C4'], [0.6, '#A9D6B4'], [0.9, '#C3E3B7']] }
  };

  var AKIS = 14;      // halatın bir tam dönüşü (sn) — sakin
  var SALINIM = 0.22; // dağınık uçların salınım hızı (rad/sn)
  var ACILIS = 3.4;   // her ipliğin uzama süresi (sn)
  var ADIM = 8;       // nokta aralığı (px)
  var gecikme = iplikler.map(function (ip) { return 0.15 + (ip.bas - 48) / 240 * 0.9; });
  var yavas = function (u) { return 1 - Math.pow(1 - u, 3); };

  var y = function (ip, x, t) {
    var c = yumusak(W * 0.12, W * 0.62, x);
    var gezinme = Math.sin(x * ip.f1 + ip.p1 + t * SALINIM) * 9
                + Math.sin(x * ip.f2 + ip.p2 - t * SALINIM * 1.6) * 4;
    var orgu = (R + 3 * yumusak(W * 0.6, W, x)) *
               Math.sin((2 * Math.PI * x) / P + ip.faz - (2 * Math.PI * t) / AKIS);
    return ORTA + (1 - c) * (ip.ofset + gezinme) + c * orgu;
  };
  var yol = function (ip, t, son) {
    var pts = [];
    for (var x = ip.bas; x < son; x += ADIM) pts.push([x, y(ip, x, t)]);
    pts.push([son, y(ip, son, t)]);
    var d = 'M' + pts[0][0] + ' ' + pts[0][1].toFixed(2);
    for (var k = 0; k < pts.length - 1; k++) {
      var p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) +
           ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) +
           ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(2);
    }
    return d;
  };

  var NS = 'http://www.w3.org/2000/svg';
  var sayac = 0;
  var orguler = [];

  // Sabit SVG'deki defs'i (renk geçişi + sağ uçtaki solma) aynen kurar
  var kur = function (v, sinif, oran) {
    var uid = 'orgu' + (++sayac);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', oran);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    if (sinif) svg.setAttribute('class', sinif);
    var durak = v.renk.map(function (r) { return '<stop offset="' + r[0] + '" stop-color="' + r[1] + '"/>'; }).join('');
    svg.innerHTML =
      '<defs><linearGradient id="' + uid + 'g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + W + '" y2="0">' + durak + '</linearGradient>' +
      '<linearGradient id="' + uid + 's" gradientUnits="userSpaceOnUse" x1="' + W * 0.82 + '" y1="0" x2="' + W + '" y2="0">' +
      '<stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<mask id="' + uid + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#' + uid + 's)"/></mask></defs>' +
      '<g mask="url(#' + uid + 'm)"><g fill="none" stroke="url(#' + uid + 'g)" stroke-linecap="round" stroke-linejoin="round"></g>' +
      '<g fill="url(#' + uid + 'g)"></g></g>';
    var gIp = svg.querySelector('g[fill="none"]'), gNo = gIp.nextSibling;
    var parca = iplikler.map(function (ip) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('vector-effect', 'non-scaling-stroke');
      p.setAttribute('stroke-width', (ip.kalinlik * v.kalin).toFixed(2));
      p.setAttribute('stroke-opacity', ip.saydam.toFixed(2));
      gIp.appendChild(p);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', (2.6 * Math.sqrt(v.kalin)).toFixed(1));
      c.setAttribute('cx', ip.bas);
      c.setAttribute('opacity', '0');
      gNo.appendChild(c);
      return { p: p, c: c };
    });
    var o = { svg: svg, parca: parca, gecen: 0, gorunur: false };
    orguler.push(o);
    return o;
  };

  var ciz = function (o) {
    iplikler.forEach(function (ip, n) {
      var u = Math.min(1, Math.max(0, (o.gecen - gecikme[n]) / ACILIS));
      var q = o.parca[n];
      q.c.setAttribute('opacity', Math.min(1, Math.max(0, (o.gecen - gecikme[n] + 0.4) / 0.4)).toFixed(2));
      q.c.setAttribute('cy', y(ip, ip.bas, o.gecen).toFixed(2));
      var son = ip.bas + (W - ip.bas) * yavas(u);
      q.p.setAttribute('d', son - ip.bas < 1 ? '' : yol(ip, o.gecen, son));
    });
  };

  // img.orgu -> svg (object-position 0% 50% => xMinYMid slice)
  Array.prototype.forEach.call(imgler, function (img) {
    var v = /orgu-gece/.test(img.getAttribute('src')) ? VARYANT.gece : VARYANT.acik;
    var sinif = img.getAttribute('class').replace(/\s*\borgu-canli\b/, '');
    var o = kur(v, sinif, 'xMinYMid slice');
    img.parentNode.replaceChild(o.svg, img);
  });
  // .sayfa-basi arka planı -> katman
  Array.prototype.forEach.call(basliklar, function (b) {
    var katman = document.createElement('div');
    katman.className = 'orgu-katman yazdir-yok';
    katman.setAttribute('aria-hidden', 'true');
    var o = kur(VARYANT.acik, '', 'xMidYMid meet');
    katman.appendChild(o.svg);
    b.insertBefore(katman, b.firstChild);
    b.classList.add('orgu-js');
  });

  // Tek döngü: yalnızca görünen örgüler ilerler ve çizilir
  var onceki = null, calisiyor = false, donuk = false, sonCizim = 0;
  var kare = function (an) {
    if (!calisiyor) return;
    var dt = onceki === null ? 0 : Math.min(0.1, (an - onceki) / 1000);
    onceki = an;
    var acilan = false;
    orguler.forEach(function (o) {
      if (!o.gorunur) return;
      o.gecen += dt;
      if (o.gecen < ACILIS + 1.2) acilan = true;
    });
    // Açılış bitince ~30 kare/sn yeter
    if (acilan || an - sonCizim >= 33) {
      sonCizim = an;
      orguler.forEach(function (o) { if (o.gorunur) ciz(o); });
    }
    if (orguler.some(function (o) { return o.gorunur; })) requestAnimationFrame(kare);
    else calisiyor = false;
  };
  var baslat = function () {
    if (calisiyor || donuk || document.hidden) return;
    if (!orguler.some(function (o) { return o.gorunur; })) return;
    calisiyor = true; onceki = null;
    requestAnimationFrame(kare);
  };

  if ('IntersectionObserver' in window) {
    var gozcu = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        orguler.forEach(function (o) { if (o.svg === g.target) o.gorunur = g.isIntersecting; });
      });
      baslat();
    });
    orguler.forEach(function (o) { gozcu.observe(o.svg); });
  } else {
    orguler.forEach(function (o) { o.gorunur = true; });
    baslat();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) calisiyor = false; else baslat();
  });

  // Ziyaretçi sonradan hareket azaltmayı açarsa hepsini tamamlanmış hâliyle dondur
  var dinle = function () {
    if (!mq.matches || donuk) return;
    donuk = true; calisiyor = false;
    orguler.forEach(function (o) { o.gecen = Math.max(o.gecen, ACILIS + 2); ciz(o); });
  };
  mq.addEventListener ? mq.addEventListener('change', dinle) : mq.addListener(dinle);
})();
