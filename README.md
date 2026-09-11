# Kıbrıs Türk Travma Afet ve Kriz Derneği — Web Sitesi

Statik HTML + Tailwind CSS ile yapılmış, iki dilli (TR/EN) dernek sitesi.
Sunucuda hiçbir kurulum, veritabanı veya build adımı gerektirmez —
dosyaları FileZilla ile yükleyip bırakırsınız.

İçerik ve mevzuat referansları **KKTC**'ye göre yazılmıştır: Dernekler Yasası
(23/2016), Kişisel Verilerin Korunması Yasası (89/2007). Türkiye'ye özgü hiçbir
kurum veya kanun atıfı bırakılmamıştır.

---

## 1. FileZilla ile yayına alma

Sunucunun kök klasörüne (genelde `public_html/` veya `httpdocs/`) **şunları** yükleyin:

```
✅ Tüm .html dosyaları (index.html, hakkimizda.html, 404.html, ...)
✅ en/                 (İngilizce sayfalar)
✅ assets/             (css, js, img, dosyalar)
✅ robots.txt
✅ sitemap.xml
✅ .htaccess           (gizli dosya — FileZilla'da "gizli dosyaları göster" açık olmalı)
```

**Yüklemeyin:**

```
❌ node_modules/       (çok büyük, sunucuda işe yaramaz)
❌ build/              (kaynak dosyalar, tarayıcı bunları okumaz)
❌ package.json, package-lock.json
❌ assets/dosyalar/BURAYA-BELGELERI-KOYUN.txt
❌ README.md, .gitignore
```

FileZilla'da aktarım modunu **Auto** bırakın; SVG ve PDF dosyaları bozulmasın
diye önemlidir.

### Yükledikten sonra kontrol listesi

- [ ] `siteadi.org` açılıyor ve yazı tipleri doğru görünüyor
- [ ] `siteadi.org/en/` İngilizce açılıyor
- [ ] Üstteki TR / EN geçişi çalışıyor
- [ ] Mobilde hamburger menü açılıyor
- [ ] Olmayan bir adres (`siteadi.org/xyz`) 404 sayfasına düşüyor
- [ ] Üstteki acil numaralar tıklanınca arama başlatıyor

---

## 1b. Bilgisayarınızda önizleme

Yüklemeden önce siteyi gerçek bir sunucu gibi görmek için:

```bash
npm run sunucu          # http://localhost:8080
PORT=3000 npm run sunucu # başka bir port isterseniz
```

Türkçe `http://localhost:8080/`, İngilizce `http://localhost:8080/en/`.
Durdurmak için Ctrl+C.

HTML dosyalarına çift tıklayarak da açabilirsiniz ama sunucuyu tercih edin:
klasör adresleri (`/en/`) çalışır, 404 sayfası gerçekten devreye girer ve
tarayıcı dosyaları önbelleğe almaz. `build/` klasörü sunucuda kapalıdır —
yayındaki durumu birebir taklit eder.

`.htaccess` kuralları burada çalışmaz; onlar Apache'ye özgüdür ve ancak
gerçek sunucuda devreye girer.

---

## 2. ⚠ Yayına almadan önce mutlaka gözden geçirin

### 2.1 Alan adı ve e-posta

Şu an her yerde `kttak.org` geçici olarak duruyor. Alan adını aldığınızda
**tek bir dosyayı** değiştirin — `build/ayarlar.json`:

```json
{
  "alanAdi": "https://gercekalanadiniz.org",
  "eposta": "info@gercekalanadiniz.org"
}
```

Sonra:

```bash
npm run iskele -- --force && npm run yayina-hazirla
```

Canonical adresler, hreflang etiketleri, schema.org verisi, `sitemap.xml` ve
`robots.txt` birlikte güncellenir. Sayfa içindeki e-posta adreslerini ayrıca
değiştirmeniz gerekir:

```bash
grep -rl '@kttak.org' --include='*.html' . | grep -v node_modules \
  | xargs sed -i '' 's/@kttak.org/@gercekalanadiniz.org/g'
```

Kullanılan adresler: `info@`, `gonullu@`, `bagis@`, `basin@`, `etik@`, `kvkk@`

### 2.2 `kvkk.html` — hukuki metin, olduğu gibi yayımlamayın

KKTC'nin **89/2007 sayılı Kişisel Verilerin Korunması Yasası**'na göre
uyarlandı ve şikâyet mercii olarak
[Kişisel Verileri Koruma Kurulu](https://kvkk.gov.ct.tr) gösterildi. Ancak
**yasa madde numaraları bilinçli olarak yazılmadı** — yanlış atıf yapmamak
için. Derneğin gerçek veri işleme envanterine göre güncellenmeli ve KKTC'de
yetkili bir hukukçu kontrol etmelidir. Aynı durum yardım toplama izninin
dayandığı yasa için de geçerli: metinde yalnızca "İçişleri Bakanlığı izni"
deniyor, yasa numarası eklenmedi.

### 2.3 Acil durum numaraları

Her sayfanın en üstünde **112 Acil · 101 Sivil Savunma · 177 Orman Yangını ·
155 Polis** duruyor. Bunlar KKTC için doğrulandı, ancak yayına almadan önce
bir kez daha teyit edin — yanlış acil numara ciddi bir sorumluluktur.

### 2.4 Sitede geçmişe dair hiçbir iddia yok

Kuruluş yılı, tarihçe, gönüllü sayısı, ulaşılan kişi sayısı, geçmiş yıl
bütçeleri ve rapor arşivi bilinçli olarak yazılmadı. Bunun yerine:

- **Şeffaflık sayfası** geçmiş rakam yerine *taahhüt* sunuyor: neyi ne zaman
  yayımlayacağınız, hangi bağış kaynaklarını kabul edip etmediğiniz. Rapor
  arşivinde boş durum bloğu var; ilk rapor çıktığında o bloğu silip hemen
  altındaki hazır tabloyu HTML yorumundan çıkarmanız yeterli.
- **Haberler sayfası** da boş durum olarak duruyor; içinde kopyalayıp
  kullanacağınız hazır bir haber `<li>` kalıbı yorum içinde bekliyor.
- **Çalışma alanları** ve **anasayfa** rakam yerine yöntem anlatıyor.

Faaliyet geçmişiniz oluştuğunda bu bölümleri doldurursunuz; yapı hazır.

Aynı gerekçeyle sitede **kurumsal ilişki ve denetim iddiası da yok**:

- Sivil Savunma Teşkilatı veya kaymakamlık ile eşgüdüm/koordinasyon altında
  çalışıldığı söylenmiyor. Saha metinleri yalnızca çalışma yöntemini anlatıyor
  ("paralel yapı kurmayız"). Resmî bir protokol imzalarsanız bu iddiayı
  `index.html`, `hakkimizda.html` ve `calisma-alanlarimiz.html` içindeki
  koordinasyon bölümlerine ekleyebilirsiniz.
- Bağımsız denetimden geçmiş mali tablo veya denetim görüşü yayımlama
  taahhüdü verilmiyor. Şeffaflık taahhüdü faaliyet raporu, gider dökümü,
  genel kurul tutanağı ve kurumsal belgelerle sınırlı. İleride bağımsız
  denetim yaptırırsanız `seffaflik.html` içindeki taahhüt listesine bir satır,
  arşiv tablosuna bir sütun eklemeniz yeterli.

### 2.5 Doldurulması gereken bilgiler

Aşağıdaki alanlar örnek değerlerle (`00`, `Ad Soyad`, `Örnek`) bırakıldı:

| Nerede | Ne |
|---|---|
| `kurumsal.html` | Kütük no (Lefkoşa Kaymakamlığı), Gelir ve Vergi Dairesi no, yönetim/denetim kurulu isimleri |
| `iletisim.html` | Merkez adresi, telefon, danışma hattı, saha ofisleri (Gazimağusa / Girne) |
| Altbilgi (tüm sayfalar) | Adres, telefon, kütük no, sosyal medya bağlantıları |
| `kvkk.html` | Sayfa başındaki "Son güncelleme" tarihi — yayına aldığınız tarihi yazın |
| `assets/dosyalar/` | Tüzük, etik kod, izin belgeleri, rehberler (liste klasördeki .txt dosyasında) |
| `assets/img/logo.svg` ve `favicon.svg` | Derneğin kendi logosu (şu an geçici işaret) |

Formlar (`gonullu`, `iletisim`) şu an `action="#"` ile duruyor —
bir form servisine veya sunucu betiğine bağlanması gerekir.

---

### 2.6 Bağış sayfası şu an yayında değil

Bağış toplama şimdilik kullanılmayacağı için `bagis.html` / `en/donate.html`
yayından kaldırıldı; menü, altbilgi ve anasayfadaki bağış çağrıları yerine
gönüllülük çağrısı kondu. Sayfanın gövdesi **silinmedi**:
`build/govde/tr-bagis.html` ve `build/govde/en-donate.html` olduğu gibi duruyor.

Geri açmak için:

1. `build/sayfalar.json` içine iki bağış kaydını geri ekleyin
   (`bagis.html` ↔ `donate.html`).
2. `build/senkron.js` içindeki `esles` listesine `'bagis.html': 'donate.html',`
   satırını geri koyun.
3. `npm run iskele` → sayfalar gövdelerden yeniden üretilir.
4. `build/parcalar/` içindeki başlık ve altbilgiye bağış düğmesini geri ekleyin,
   `npm run senkron` çalıştırın.
5. `.htaccess` içindeki geçici yönlendirme bloğunu silin.

Eski bağlantılar 404 vermesin diye `.htaccess` şu an `/bagis.html` adresini
anasayfaya **geçici (302)** yönlendiriyor. `assets/js/site.js` içindeki bağış
tutarı seçimi kodu duruyor ama sayfa olmadığı için çalışmıyor.

Şeffaflık ve KVKK sayfalarındaki bağış politikası metinleri (kabul edilen /
reddedilen fon kaynakları, bağışçı verisi) **bilinçli olarak korundu** — bunlar
ilke beyanı; bağış yeniden açıldığında olduğu gibi geçerli.

### 2.7 Kaynak künyelerini derneğin onaylaması gerekir

Sayfaların sonundaki **Kaynakça** bölümleri, derneğin yöntemlerinin hangi
belgelere dayandığını beyan eder — bu, kurumun kendisi hakkında verdiği bir
bilgidir, teknik bir ayrıntı değil. Yayına almadan önce yönetim kurulu şunları
teyit etmeli:

- Sahada gerçekten bu standartlar mı uygulanıyor? Uygulanmayan bir belge
  kaynak olarak gösterilmemeli — dayanaksız atıf, atıfsızlıktan daha kötüdür.
- Kaynak merkezindeki PDF'ler henüz yazılmadı. Her materyalin altındaki
  **“Dayanak:”** satırı, o materyali yazarken hangi belgeden uyarlanacağını
  söyler; materyal yazıldığında satırın doğruluğu bir kez daha kontrol edilmeli.
- Kıbrıs'ın deprem riski ve orman yangını bilgileri KKTC kurumlarına
  bağlanmıştır; kurum adları veya adresleri değişirse künyeler güncellenmeli.

Kaynakçada derneğin **kendi program kararları yer almaz** (24 saatlik eğitim,
asgari 24 ay izlem, personel oranları, ücretsizlik). Bunlar tercihtir, kaynak
gösterilecek bir dış belgeye dayanmaz — ve bilerek dışarıda bırakılmıştır.

---

---

## 3. İçeriği değiştirme

HTML dosyaları **doğrudan düzenlenebilir**. Metni değiştirmek için ilgili
`.html` dosyasını açıp yazıyı değiştirmeniz yeterli — sonra dosyayı tekrar
FTP'ye yükleyin. Derleme gerekmez.

### Dernek adını değiştirme

Kısa ad her yerde `KTTAK`, resmî unvan `Kıbrıs Türk Travma Afet ve Kriz Derneği`
(EN: `Turkish Cypriot Trauma, Disaster and Crisis Association`). Kısaltmayı tek
komutla değiştirebilirsiniz:

```bash
grep -rl 'KTTAK' --include='*.html' --include='*.js' --include='*.json' . \
  | grep -v node_modules | xargs sed -i '' 's/KTTAK/YENİADI/g'
```

Resmî unvan `build/ayarlar.json` içinde (`resmiAdTR` / `resmiAdEN`) ve
başlık/altbilgi parçalarında geçer.

### Menüyü veya altbilgiyi değiştirmek

Bunlar 24 sayfada tekrar ettiği için tek kaynaktan yönetilir:

1. `build/parcalar/baslik-tr.html` (veya `-en`, `altbilgi-*`) dosyasını düzenleyin
2. `npm run senkron` çalıştırın → değişiklik tüm sayfalara işlenir
3. `npm run css` → yeni bir Tailwind sınıfı kullandıysanız CSS'i tazeleyin

Betik yalnızca sayfalardaki `<!--#BASLIK-->` ve `<!--#ALTBILGI-->`
işaretleri arasını değiştirir; sayfanın geri kalanına dokunmaz.

### Yeni sayfa eklemek

1. `build/sayfalar.json` dosyasına başlık ve açıklamayla birlikte satır ekleyin
2. `build/govde/tr-yenisayfa.html` içine sayfanın gövdesini yazın
3. `npm run iskele && npm run senkron && npm run css`
4. Menüde görünmesi için `build/parcalar/baslik-tr.html` dosyasına bağlantı ekleyin

`iskele.js` var olan bir sayfanın üzerine **yazmaz** (`--force` vermedikçe) —
elle yaptığınız düzenlemeler güvendedir.

### Kaynakçayı düzenlemek

Her sayfanın sonunda `id="kaynakca"` taşıyan bir bölüm var: solda konu, sağda
o konunun dayandığı belgenin künyesi ve yayıncısına giden bağlantı. Yapısı
sitedeki diğer künye listeleriyle aynı (`<dl class="kunye">`), ek CSS gerekmez.

Kaynak eklemek veya değiştirmek için ilgili gövdeyi düzenleyin — örneğin
`build/govde/tr-calisma-alanlarimiz.html` ve İngilizce karşılığı
`build/govde/en-what-we-do.html` — sonra:

```bash
npm run iskele -- --force && npm run yayina-hazirla
```

Yeni bir satır şu kalıpta:

```html
<div>
  <dt>Konu</dt>
  <dd>Kurum (Yıl). <em>Belgenin adı</em>, baskı. <a href="https://..." class="bag">yayinci.org</a></dd>
</div>
```

Bir konunun birden fazla kaynağı varsa aynı `<div>` içine üst üste `<dd>`
ekleyin; ikinci kaynak da sağ sütunda kalır.

**İki kural:**

1. **Kart ve liste satırlarının içine bağlantı koymayın.** Kaynak merkezindeki
   materyaller ve haber kalıbı zaten birer `<a>`; içlerine ikinci bir `<a>`
   koymak geçersiz HTML üretir. Oralarda kaynak düz metin yazılır
   (`Dayanak: …`), tam künye sayfa sonundaki kaynakçaya girer.
2. **TR ve EN birlikte güncellenir.** İki dilde farklı kaynak listesi kalırsa
   hangisinin doğru olduğu belirsizleşir.

Bağlantılar 10 Eylül 2026'da tek tek denendi. `spherestandards.org`,
`alliancecpha.org` ve `undrr.org` komut satırı isteklerini engellediği için
bu üçü tarayıcıdan doğrulanmalı; adresler yayıncıların resmî sayfalarıdır.

Haber eklerken kaynağın nasıl yazılacağı `build/govde/tr-haberler.html`
içindeki HTML yorumunda kalıp olarak duruyor.

---

## 4. Tasarımı değiştirmek (Tailwind derlemesi)

Yalnızca renk, boşluk veya bileşen stili değiştirecekseniz gereklidir.

```bash
npm install          # bir kez
npm run css          # assets/css/site.css dosyasını üretir
npm run izle         # düzenlerken sürekli derler
```

Tüm renkler ve yazı tipleri `build/input.css` içindeki `@theme` bloğunda tanımlı:

| Simge | Renk | Nerede kullanılır |
|---|---|---|
| `zemin` | `#edeee9` | Sayfa arka planı |
| `kagit` | `#f7f8f4` | Kart ve panel yüzeyleri |
| `derin` | `#122a27` | En koyu mürekkep, altbilgi |
| `orman` | `#1e4a44` | Birincil kurumsal renk |
| `sis` | `#5f6a67` | İkincil metin, küçük etiketler |
| `kum` | `#dcd2be` | Sıcak vurgu panelleri |
| `fener` | `#8a5a08` | **Yalnızca** yardım ve bağış eylemleri |
| `fener-acik` | `#f0c46a` | Koyu zemin üzerindeki sinyal metni |

`site.css` derlenmiş çıktıdır — **elle düzenlemeyin**, `npm run css`
çalıştırdığınızda üzerine yazılır.

---

## 5. Klasör yapısı

```
.
├── *.html                  ← Türkçe sayfalar (kaynak: bunlar)
├── en/*.html               ← İngilizce sayfalar
├── assets/
│   ├── css/site.css        ← derlenmiş Tailwind (elle düzenlemeyin)
│   ├── js/site.js          ← menü, IBAN kopyalama (bağış tutarı kodu atıl)
│   ├── img/                ← logo, favicon, sismik hat
│   └── dosyalar/           ← PDF'ler buraya
├── build/                  ← sunucuya YÜKLENMEZ
│   ├── ayarlar.json        ← alan adı, dernek adı, e-posta — TEK KAYNAK
│   ├── input.css           ← Tailwind kaynağı, renkler burada
│   ├── parcalar/           ← ortak başlık ve altbilgi
│   ├── govde/              ← sayfa iskeleti üretirken kullanılan gövdeler
│   ├── senkron.js          ← başlık/altbilgiyi tüm sayfalara işler
│   ├── iskele.js           ← YENİ sayfa oluşturur (var olanın üzerine yazmaz)
│   ├── sitemap.js          ← sitemap.xml + robots.txt üretir
│   └── gen-sismik.js       ← hero'daki sismogram hattını üretir
├── .htaccess               ← Apache ayarları (404, sıkıştırma, önbellek)
├── robots.txt
└── sitemap.xml
```

---

## 6. Tek komutla yayına hazırlama

```bash
npm run yayina-hazirla    # senkron + css + sitemap.xml + robots.txt
```

Sonra `.html`, `en/`, `assets/`, `robots.txt`, `sitemap.xml` ve `.htaccess`
dosyalarını FTP'ye yükleyin.

---

## Erişilebilirlik ve tasarım notları

Site travma-bilinçli tasarım ilkeleriyle kurgulandı; aşağıdakiler bilinçli
tercihlerdir, hata değildir:

- **Kırmızı ve alarm estetiği yok.** Afet sitelerinde yaygın olan aciliyet
  dili, afetten etkilenmiş kişide tetikleyici olabiliyor. Amber (`fener`)
  rengi yalnızca yardım ve bağış eylemlerinde kullanılır.
- **Yardım şeridi her sayfanın en üstünde.** 112 / 101 / 177 / 155 her zaman
  görünür; bir kullanıcının yardıma ulaşmak için gezinmesi gerekmez.
- **Ani hareket yok.** `prefers-reduced-motion` açık olan kullanıcıda tüm
  animasyonlar tamamen kapanır.
- **Moloz ve mağduriyet fotoğrafı yok.** Etik kodun görsel karşılığı.
- **Kaynak merkezinde içerik uyarısı** ve ara verme daveti bulunur.
- Tüm formlarda görünür etiket, klavye odağı ve KVKK onayı vardır.
- Renk paletindeki 18 metin/zemin kombinasyonunun tamamı WCAG 2.1 AA
  (4.5:1) eşiğini geçer. Renkleri değiştirirseniz kontrastı yeniden ölçün.

**İmza öğesi:** Anasayfadaki sismogram hattı — solda sarsıntı, sağa doğru
düz çizgiye çözülüyor; başlık o sakin tarafta oturuyor. Dosya
`assets/img/sismik-koyu.svg` ve `sismik-acik.svg`; `build/gen-sismik.js`
ile üretilir (deterministik, her çalıştırmada aynı çizgi çıkar).
