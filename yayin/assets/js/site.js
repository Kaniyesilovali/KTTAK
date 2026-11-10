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
