# Travma Afet Kriz Derneği (TAK-DER) — Web Sitesi

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

### 2.1 Alan adı, e-posta ve sosyal medya — tek dosya

Brif gereği **resmî e-posta, iletişim bilgileri ve tescil olmadan site yayına
alınmaz.** Şu an `tak-der.org` / `info@tak-der.org` GEÇİCİ değerlerdir ve
sosyal medya bağlantıları `#`'dir. Hepsi tek dosyada: `build/ayarlar.json`

```json
{
  "alanAdi": "https://gercekalanadi.org",
  "eposta": "info@gercekalanadi.org",
  "instagram": "https://www.instagram.com/...",
  "facebook": "https://www.facebook.com/...",
  "linkedin": "https://www.linkedin.com/company/..."
}
```

Sonra:

```bash
npm run iskele -- --force && npm run yayina-hazirla
```

Gövdelerde ve başlık/altbilgide `{{EPOSTA}}`, `{{INSTAGRAM}}`, `{{FACEBOOK}}`,
`{{LINKEDIN}}` yer tutucuları kullanılır; e-posta tüm sitede tek adrestir.
Canonical, hreflang, schema.org (`sameAs` dahil), `sitemap.xml` ve
`robots.txt` birlikte güncellenir.

Alan adı, hosting ve formlar **derneğin resmî e-postasıyla ve derneğin adına**
açılmalı (tüzük md. 32/3, 38): iki adımlı doğrulama, en az iki yönetici (site
yöneticisi + Koordinatör veya Sekreter), ortak şifre yöneticisi, yenileme
tarihleri Sekreterlikte.

### 2.2 `kvkk.html` — hukuki metin, olduğu gibi yayımlamayın

KKTC'nin **89/2007 sayılı Kişisel Verilerin Korunması Yasası**'na göre
uyarlandı ve şikâyet mercii olarak
[Kişisel Verileri Koruma Kurulu](https://kvkk.gov.ct.tr) gösterildi. Ancak
**yasa madde numaraları bilinçli olarak yazılmadı** — yanlış atıf yapmamak
için. Derneğin gerçek veri işleme envanterine göre güncellenmeli ve KKTC'de
yetkili bir hukukçu kontrol etmelidir. Aynı durum yardım toplama izninin
dayandığı yasa için de geçerli: metinde yalnızca "İçişleri Bakanlığı izni"
deniyor, yasa numarası eklenmedi.

### 2.3 Acil durum numaraları — dernek kriz hattı DEĞİLDİR

Her sayfanın en üstünde **112 Acil/Ambulans · 101 Sivil Savunma · 177 Orman
Yangını · 155 Polis** ve "TAK-DER bir kriz hattı değildir" bağlantısı durur.
İletişim sayfasında (`iletisim.html#kriz`) "Kriz anında nereye başvurulur"
kutusu var. **Sosyal Hizmetler Dairesi numarası** teyit edilmediği için
eklenmedi; yerinde HTML yorumu bekliyor. Yayından önce numaraları yeniden
teyit edin. Eski sürümdeki 0850 "danışma hattı" tüm sayfalardan kaldırıldı.

### 2.4 Brifin içerik kuralları (tüzük md. 5, 31, 32)

Site şu kurallara göre yazıldı; yeni içerik eklerken de geçerlidir:

- Metinler Temsil Organı'nın belirlediği kişilerin onayından sonra yayımlanır.
- **"Kurulduk" ifadesi yalnızca tescilden sonra.** Kuruluş duyurusu
  `build/govde/tr-haberler.html` / `en-news.html` içinde HTML yorumu olarak
  hazır bekliyor.
- Doğrulanmamış olay bilgisi kesin bilgi gibi paylaşılmaz.
- Destek alanların yüzü, sesi, adı, öyküsü onamsız kullanılmaz; çocuk
  fotoğrafı ve afet bölgesinden yıkım/yaralı/acı görüntüsü kullanılmaz.
- Siyasi parti, aday veya kampanya içeriği yok; dernek adı ticari/kişisel
  tanıtımda kullanılmaz.
- **Açık adres ve harita yok** (merkez bir üyenin konutu). Konum yalnızca
  "Lefkoşa". schema.org verisinde de yalnızca ilçe var.
- Telefon belirlenmediği için hiçbir yerde telefon yok.

Sitede geçmişe dair iddia (kuruluş yılı, gönüllü sayısı, rapor arşivi, saha
deneyimi, kütük no, yardım toplama izni, aidat tutarı) **yoktur**. Kaynak
sayfalarındaki "sahada kullandığımız" gibi ifadeler "sahada kullanılmak üzere
hazırlanan" biçimine çevrildi.

### 2.5 Site haritası (brif Bölüm 6) ve eksik bilgiler

| Brifteki sayfa | Dosya (TR / EN) | Eksik olan |
|---|---|---|
| Ana Sayfa | `index.html` | — |
| Hakkımızda → Biz Kimiz, Değerlerimiz | `hakkimizda.html` (`#biz-kimiz`, `#degerlerimiz`) / `about.html` | Onaylı "Biz Kimiz" metni ve kuruluş hikâyesi |
| Hakkımızda → Yönetim, Tüzük | `kurumsal.html` (`#yonetim`, `#tuzuk`) / `governance.html` | Kurucu üye listesi (yayın onayıyla), tescilli tüzük PDF'i, sicil no |
| Ne Yapıyoruz | `calisma-alanlarimiz.html` / `what-we-do.html` | Örnek çalışmalar |
| Çalışma Grupları | `calisma-gruplari.html` / `working-groups.html` | Kurulan gruplar ve sorumluları |
| Eğitimler ve Atölyeler | `egitimler.html` / `training.html` | Program |
| Kaynaklar | `kaynaklar.html` / `resources.html` | Kaynakça dosyasından eklenecekler |
| Haberler ve Etkinlikler | `haberler.html` / `news.html` | Çalıştay/sempozyum tarih, yer, program, kayıt formu |
| Katılım → Üye Ol | `uye-ol.html` / `membership.html` | Tüzük md. 6 koşulları, başvuru formu, aidat |
| Katılım → Gönüllü Ol | `gonullu.html` / `volunteer.html` | Form servisi, md. 12'deki diğer koşullar |
| Katılım → Destek Ol / Bağış | kapalı (bkz. 2.6) | Tescil ve banka hesabı |
| İletişim | `iletisim.html` / `contact.html` | Resmî e-posta, telefon, sosyal medya bağlantıları |
| Gizlilik ve Kişisel Veriler | `kvkk.html` / `privacy.html` | Hukukçu kontrolü (bkz. 2.2) |

Formlar (`gonullu`, `iletisim`) `action="#"` ile duruyor — derneğin resmî
e-postasına iletecek bir form servisine bağlanmalı; form verileri kişisel
veridir. Logo PNG'leri ve renk kodları tasarımcıdan gelecek vektörel dosyayla
(AI/SVG) teyit edilmeli.

Şeffaflık sayfası brifte olmadığı için kaldırıldı; `.htaccess` eski adresleri
kalıcı (301) olarak `kurumsal.html` / `en/governance.html`'e yönlendirir.
Gövdesi `build/govde/tr-seffaflik.html` olarak duruyor.

### 2.6 Bağış sayfası şu an yayında değil

Brif: bağış sayfası **tescil ve banka hesabı açıldıktan sonra** açılır.
Gövdesi silinmedi: `build/govde/tr-bagis.html` ve `build/govde/en-donate.html`.

Geri açmak için:

1. `build/sayfalar.json` içine iki bağış kaydını ekleyin (`bagis.html` ↔ `donate.html`).
2. `build/senkron.js` içindeki `esles` listesine `'bagis.html': 'donate.html',` ekleyin.
3. Gövdedeki banka bilgilerini ve şeffaflık bağlantılarını güncelleyin.
4. `npm run iskele` → başlık/altbilgiye bağlantı ekleyip `npm run senkron`.
5. `.htaccess` içindeki geçici yönlendirme satırlarını silin.

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

### Dernek adı

Sitede her zaman tam ad ve kısa ad birlikte geçer: **Travma Afet Kriz
Derneği (TAK-DER)**. İngilizce sayfalarda resmî ad Türkçe bırakılır,
yanına açıklama olarak "Trauma, Disaster and Crisis Association" yazılır.
Ad `build/ayarlar.json` (`kisaAd`, `resmiAdTR`, `resmiAdEN`), `build/sayfalar.json`
(sayfa başlıkları) ve başlık/altbilgi parçalarında geçer. Türkçe eklerde
TAK-DER'in, TAK-DER'e, TAK-DER'den biçimi kullanılır.

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

Renkler logodan çıkarılmıştır (tasarımcıdan kesin kodlar teyit edilmeli).
Simge adları eski paletten kalmadır; 50 sayfadaki sınıflar değişmesin diye
yalnızca değerleri değiştirildi.

| Simge | Renk | Kimlikteki adı | Nerede kullanılır |
|---|---|---|---|
| `zemin` | `#ffffff` | Beyaz | Sayfa arka planı |
| `kagit` | `#f2f7f8` | — | Kart, panel ve altbilgi zemini |
| `derin` | `#0c2e44` | — | Gövde metni, yardım şeridi, kriz kutusu |
| `orman` | `#135e8b` | Koyu mavi | Başlıklar, menü, birincil düğme |
| `orman-acik` | `#10778c` | Petrol mavisi | Bağlantılar, odak çerçevesi |
| `deniz` | `#4c9785` | Deniz yeşili | İkon ve liste işaretleri — metin için değil |
| `filiz` | `#80b674` | Açık yeşil | **Yalnızca** "Gönüllü Ol / Destek ol" düğme zemini |
| `fener` | `#427636` | — | Açık yeşilin metin tonu: küçük etiketler |
| `fener-acik` | `#c3e3b7` | — | Koyu mavi zeminde yeşil vurgu metni |
| `sis` | `#557080` | — | İkincil metin |
| `kum` / `kum-acik` | `#cfe4c6` / `#eff6eb` | — | Açık yeşil destek panelleri, kart hover |

**Açık yeşil zeminde beyaz yazı kullanmayın** (2.4:1, okunmaz); düğme yazısı
her zaman `derin`. Logonun maviden yeşile geçişi yalnızca `.kapak`
alanlarında (çağrı bantları), kılcal ayraçlarda ve örgü imzasında kullanılır.

### Logo dosyaları

Logo finaldir; tüzük md. 1/3 gereği renk, oran veya yazısı değiştirilmez.

| Dosya | Kullanım |
|---|---|
| `assets/img/logo-yazili-renkli-{192,400,800}.png` | Üst menü, altbilgi, schema.org |
| `assets/img/logo-isaret-{32,180,512}.png`, `favicon.ico`, `apple-touch-icon.png` | Favicon ve küçük simgeler (yazısız) |
| `assets/img/og-gorsel.png` | Sosyal medya paylaşım görseli |

Yazısız versiyon, yazılı PNG'den harfler ayıklanarak türetildi; amblemin
pikselleri değişmedi. Tasarımcının resmî yazısız dosyası ve SVG'si
geldiğinde bu dosyaların yerine aynı adlarla konmalıdır.

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
│   ├── img/                ← logo, favicon, örgü imzası
│   └── dosyalar/           ← PDF'ler buraya
├── build/                  ← sunucuya YÜKLENMEZ
│   ├── ayarlar.json        ← alan adı, dernek adı, e-posta — TEK KAYNAK
│   ├── input.css           ← Tailwind kaynağı, renkler burada
│   ├── parcalar/           ← ortak başlık ve altbilgi
│   ├── govde/              ← sayfa iskeleti üretirken kullanılan gövdeler
│   ├── senkron.js          ← başlık/altbilgiyi tüm sayfalara işler
│   ├── iskele.js           ← YENİ sayfa oluşturur (var olanın üzerine yazmaz)
│   ├── sitemap.js          ← sitemap.xml + robots.txt üretir
│   └── gen-orgu.js         ← anasayfadaki örgü imzasını üretir
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
  dili, afetten etkilenmiş kişide tetikleyici olabiliyor. Açık yeşil
  (`filiz`) yalnızca gönüllülük ve destek eylemlerinde kullanılır.
- **Yardım şeridi her sayfanın en üstünde.** 112 / 101 / 177 / 155 her zaman
  görünür; bir kullanıcının yardıma ulaşmak için gezinmesi gerekmez.
- **Ani hareket yok.** `prefers-reduced-motion` açık olan kullanıcıda tüm
  animasyonlar tamamen kapanır.
- **Moloz ve mağduriyet fotoğrafı yok.** Etik kodun görsel karşılığı.
- **Kaynak merkezinde içerik uyarısı** ve ara verme daveti bulunur.
- Tüm formlarda görünür etiket, klavye odağı ve KVKK onayı vardır.
- Metin olarak kullanılan tüm renk/zemin kombinasyonları WCAG 2.1 AA
  (4.5:1) eşiğini geçer. Renkleri değiştirirseniz kontrastı yeniden ölçün.

**İmza öğesi:** Anasayfadaki örgü — beş ince iplik farklı yerlerden,
farklı zamanlarda başlar ve birbirine tutunarak tek bir halat gibi örülür:
dayanışma. Renk logonun geçişidir; dağınıkken mavi, örülünce yeşil. Sağ uç
düz çizgiye inmez (ilk sürümdeki sismogramın sönen düz hattı yaşam
monitörünü çağrıştırdığı için bırakıldı). Dosya `assets/img/orgu.svg`;
`build/gen-orgu.js` ile üretilir (deterministik, her çalıştırmada aynı çizgi çıkar).
