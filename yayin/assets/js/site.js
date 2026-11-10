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

    // Esc ile kapat — her yerde tutarlı bir çıkış yolu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && acButon.getAttribute('aria-expanded') === 'true') {
        acButon.click();
        acButon.focus();
      }
    });
  }

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
