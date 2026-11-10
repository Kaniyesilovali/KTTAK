# Travma Afet Kriz Derneği (TAKDER) — Web Sitesi

Statik HTML + Tailwind CSS ile yapılmış, iki dilli (TR/EN) dernek sitesi.
Sunucuda hiçbir kurulum, veritabanı veya build adımı gerektirmez —
dosyaları FileZilla ile yükleyip bırakırsınız.

İçerik ve mevzuat referansları **KKTC**'ye göre yazılmıştır: Dernekler Yasası
(23/2016), Kişisel Verilerin Korunması Yasası (89/2007). Türkiye'ye özgü hiçbir
kurum veya kanun atıfı bırakılmamıştır.

---

## 1. FileZilla ile yayına alma

### Adım 1 — Paketi hazırlayın (tek komut)

```bash
npm install        # yalnızca ilk seferde
npm run paketle
```

Bu komut sayfaları, CSS'i ve sitemap'i günceller. Sunucuya gidecek **her şey
ve yalnızca onlar** `yayin/` klasöründedir; aynı içerik `takder-yayin.zip`
olarak da hazırlanır. Sonda geçici değerler ve
çalışmayan formlar için uyarı listesi çıkar; yayından önce bu listeyi boşaltın
(bkz. bölüm 2).

### Adım 2 — FileZilla ile yükleyin

1. FileZilla → **Dosya › Site Yöneticisi**'ne hostingin verdiği bilgileri girin
   (sunucu, kullanıcı adı, şifre). Mümkünse protokolü **SFTP** veya
   **FTP – açık TLS** seçin.
2. **Sunucu › Gizli dosyaları göstermeye zorla** açık olsun (`.htaccess` için).
3. Sağ tarafta (sunucu) `public_html/` (Plesk'te `httpdocs/`) klasörüne girin.
4. Sol tarafta (bilgisayar) bu projedeki **`yayin/` klasörünün içine** girin.
5. Soldaki her şeyi seçin (Cmd+A / Ctrl+A) ve sağa sürükleyin. "Dosya zaten
   var" sorulursa **Üzerine yaz** + "Her zaman bu eylemi kullan".

Aktarım modunu **Auto** bırakın; SVG ve PDF dosyaları bozulmasın diye önemlidir.
Güncelleme yaparken de aynı iki adım: `npm run paketle`, sonra yeniden sürükle.

**Daha hızlı yol (cPanel):** `takder-yayin.zip` dosyasını FileZilla ile
`public_html/` içine atın, cPanel **Dosya Yöneticisi**'nde zip'e sağ tıklayıp
**Extract** deyin, sonra zip'i silin.

Proje kökündeki diğer her şey (`build/`, `node_modules/`, `package.json`,
`README.md`) yalnızca bilgisayarınızda kalır, sunucuya yüklenmez. Zip git'e
girmez; her `npm run paketle` onu baştan oluşturur.

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
npm run yayina-hazirla
```

> **Dikkat:** `iskele -- --force` sayfaları `build/govde/` kopyalarından yeniden
> üretir ve `yayin/` içinde sonradan yapılmış düzenlemeleri ezer. Başlık ve
> altbilgi `yayina-hazirla` ile güncellenir; sayfa gövdesindeki bağlantıları
> (ör. iletişim sayfası) ve JSON-LD `sameAs` alanını elle güncelleyin.

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
Yangını · 155 Polis** ve "TAKDER bir kriz hattı değildir" bağlantısı durur.
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

### 2.5 Site haritası (Web Sitesi Taslağı, Kasım 2026) ve eksik bilgiler

Yapı, derneğin "Web Sitesi Taslağı"na göre kuruldu (WHO konu merkezli giriş,
APA'nın halk / meslek elemanı ayrımı, IFRC kaynak kütüphanesi + eğitim takvimi,
UNDRR risk döngüsü ve terminolojisi). Menü ve altbilgi bu tabloyu izler;
`build/sayfalar.json` aynı sırayla tutulur ve `sitemap.xml` ondan üretilir.

| # | Bölüm | Dosya (TR / EN) | Eksik olan |
|---|---|---|---|
| 0 | Sabit üst şerit | tüm sayfalar (`build/parcalar/baslik-*.html`) | Numaraların yeniden teyidi (bkz. 2.3) |
| 1 | Ana sayfa · 1.2 güncel durum şeridi · 1.3 son duyurular | `index.html` | 1.2 ve 1.3 HTML yorumu olarak hazır bekliyor |
| 2.1–2.2 | Kimiz · Vizyon ve ilkeler | `hakkimizda.html` / `about.html` | Onaylı "Biz Kimiz" metni |
| 2.3 | Çalışma modelimiz | `calisma-modelimiz.html` / `working-model.html` | — (eski "Ne Yapıyoruz" içeriği) |
| 2.4 | Alt gruplar ve yapı | `calisma-gruplari.html`, `kurumsal.html` | Grup sorumluları, kurucu üyeler, tüzük PDF |
| 2.5 | Gönüllüler | `gonullu.html` / `volunteer.html` | Form servisi |
| 2.6 | Şeffaflık: faaliyet raporu, finansman, özerklik beyanı | `seffaflik.html` / `transparency.html` | **Özerklik beyanının Temsil Organı onayı**, ilk faaliyet raporu |
| 2.7 | Etik ve gizlilik | `etik.html` / `ethics.html` | Onay |
| 3 | Çalışma alanlarımız (3.1–3.5) | `calisma-alanlarimiz.html` + `afetler`, `travma-ve-siddet`, `toplumsal-krizler`, `ozel-gruplar`, `kibris-risk-profili` (EN: `what-we-do`, `disasters`, …) | Uzman okuması; Kıbrıs'a özgü veriler (her tehlike için ayrı) |
| 4 | Risk ve müdahale döngüsü (4.1–4.5) | `risk-dongusu.html` / `risk-cycle.html` | 4.1 için tehlike bazlı ayrıntılı analizler |
| 5 | Toplum için (5.1–5.4) | `toplum-icin.html` / `for-the-public.html` | — |
| 6 | Meslek elemanları için (6.1–6.4) | `meslek-elemanlari.html` / `for-professionals.html`, `egitimler.html#takvim` | Eğitim programı ve tarihleri |
| 7 | Yayınlar ve kaynaklar (7.1 TAKDER yayınları, 7.2 online kütüphane) | `kutuphane.html` / `library.html` | 7.1.1–7.1.3 ve 7.1.5 rafları boş; 7.2'de Türkçe belge yok |
| 8 | Sözlük | `sozluk.html` / `glossary.html` | Terim listesinin ve tanımların onayı |
| 9 | Medya: sorumlu habercilik, basın odası | `medya.html` / `media.html`, `haberler.html` | Basın bültenleri |
| 10 | Katıl: gönüllü ol, kurumsal işbirliği (+ üyelik) | `katil.html` / `get-involved.html`, `uye-ol.html` | — |
| 11 | Olay sayfası şablonu | `olay.html` / `incident.html` (noindex, sitemap dışı) | Kullanım: dosyadaki yorum |
| 12 | İletişim | `iletisim.html` / `contact.html` | Telefon |
| — | Alt bilgi: gizlilik, çerezler, erişilebilirlik, sorumluluk reddi, dil | `kvkk.html`, `erisilebilirlik.html` / `privacy.html`, `accessibility.html` | Hukukçu kontrolü (bkz. 2.2) |

**Taslak metinler.** 2.6, 2.7, 3, 4, 8, 9 ve erişilebilirlik sayfalarının
gövdeleri yeni yazıldı ve başlarında `TASLAK METİN` yorumu var: Temsil
Organı'nın belirlediği kişilerin onayından önce yayımlanmamalı. Yeni eklenen
dış bağlantılar (apa.org, ifrc.org, preventionweb.net, gbvguidelines.org,
dartcenter.org, who.int intihar rehberi, undrr.org/terminology) tarayıcıdan
doğrulanmalı.

Taşınan adresler `yayin/.htaccess` içinde kalıcı (301) yönlendirilir:
`kaynaklar.html` → `toplum-icin.html`, `en/resources.html` → `en/for-the-public.html`.
Eski `calisma-alanlarimiz.html` adresi artık 3. bölümün genel bakış sayfasıdır.

Formlar (`gonullu`, `iletisim`) `action="#"` ile duruyor — derneğin resmî
e-postasına iletecek bir form servisine bağlanmalı; form verileri kişisel
veridir. Logo PNG'leri ve renk kodları tasarımcıdan gelecek vektörel dosyayla
(AI/SVG) teyit edilmeli.

Yeni sayfa gövdeleri `build/govde/` içinde; menüdeki bölümler
`build/parcalar/baslik-*.html` içinde `data-grup` ile alt sayfalarını tanır
(alt sayfada bölüm başlığı etkin görünür). TR↔EN eşlemesi artık yalnızca
`build/sayfalar.json` içindeki `es` alanından okunur.

### 2.6 Bağış sayfası şu an yayında değil

Brif: bağış sayfası **tescil ve banka hesabı açıldıktan sonra** açılır.
Gövdesi silinmedi: `build/govde/tr-bagis.html` ve `build/govde/en-donate.html`.

Geri açmak için:

1. `build/sayfalar.json` içine iki bağış kaydını ekleyin (`bagis.html` ↔ `donate.html`); dil eşlemesi oradan okunur.
2. (Gerekmez — `senkron.js` eşlemeyi `sayfalar.json`'dan alır.)
3. Gövdedeki banka bilgilerini ve şeffaflık bağlantılarını güncelleyin.
4. `npm run iskele` → başlık/altbilgiye bağlantı ekleyip `npm run senkron`.
5. `yayin/.htaccess` içindeki geçici yönlendirme satırlarını silin.

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

HTML dosyaları **doğrudan düzenlenebilir**. Metni değiştirmek için `yayin/`
içindeki ilgili `.html` dosyasını açıp yazıyı değiştirmeniz yeterli — sonra dosyayı tekrar
FTP'ye yükleyin. Derleme gerekmez.

### Dernek adı

Sitede her zaman tam ad ve kısa ad birlikte geçer: **Travma Afet Kriz
Derneği (TAKDER)**. İngilizce sayfalarda resmî ad Türkçe bırakılır,
yanına açıklama olarak "Trauma, Disaster and Crisis Association" yazılır.
Ad `build/ayarlar.json` (`kisaAd`, `resmiAdTR`, `resmiAdEN`), `build/sayfalar.json`
(sayfa başlıkları) ve başlık/altbilgi parçalarında geçer. Türkçe eklerde
TAKDER'in, TAKDER'e, TAKDER'den biçimi kullanılır.

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
npm run css          # yayin/assets/css/site.css dosyasını üretir
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
| `yayin/assets/img/logo-yazili-renkli-{192,400,800}.png` | Üst menü, altbilgi, schema.org |
| `yayin/assets/img/logo-isaret-{32,180,512}.png`, `favicon.ico`, `apple-touch-icon.png` | Favicon ve küçük simgeler (yazısız) |
| `yayin/assets/img/og-gorsel.png` | Sosyal medya paylaşım görseli |

Yazısız versiyon, yazılı PNG'den harfler ayıklanarak türetildi; amblemin
pikselleri değişmedi. Tasarımcının resmî yazısız dosyası ve SVG'si
geldiğinde bu dosyaların yerine aynı adlarla konmalıdır.

`site.css` derlenmiş çıktıdır — **elle düzenlemeyin**, `npm run css`
çalıştırdığınızda üzerine yazılır.

---

## 5. Klasör yapısı

```
.
├── yayin/                  ← SİTENİN KENDİSİ — içi olduğu gibi sunucuya yüklenir
│   ├── *.html              ← Türkçe sayfalar
│   ├── en/*.html           ← İngilizce sayfalar
│   ├── assets/
│   │   ├── css/site.css    ← derlenmiş Tailwind (elle düzenlemeyin)
│   │   ├── js/site.js      ← menü, IBAN kopyalama (bağış tutarı kodu atıl)
│   │   ├── img/            ← logo, favicon, örgü imzası
│   │   └── dosyalar/       ← PDF'ler buraya (klasörü ilk PDF'te oluşturun)
│   ├── .htaccess           ← Apache ayarları (404, sıkıştırma, önbellek)
│   ├── robots.txt
│   └── sitemap.xml
├── build/                  ← kaynaklar ve betikler — sunucuya YÜKLENMEZ
│   ├── ayarlar.json        ← alan adı, dernek adı, e-posta — TEK KAYNAK
│   ├── input.css           ← Tailwind kaynağı, renkler burada
│   ├── parcalar/           ← ortak başlık ve altbilgi
│   ├── govde/              ← sayfa iskeleti üretirken kullanılan gövdeler
│   ├── senkron.js          ← başlık/altbilgiyi tüm sayfalara işler
│   ├── iskele.js           ← YENİ sayfa oluşturur (var olanın üzerine yazmaz)
│   ├── sitemap.js          ← sitemap.xml + robots.txt üretir
│   ├── paketle.js          ← yayına hazırlar, zip'ler, eksikleri listeler
│   ├── gen-orgu.js         ← anasayfadaki örgü imzasını üretir
│   └── BEKLENEN-BELGELER.txt ← yüklenecek resmî PDF'lerin listesi
├── package.json            ← npm komutları
└── README.md
```

---

## 6. Tek komutla yayına hazırlama

```bash
npm run paketle    # senkron + css + sitemap + zip + eksik listesi
```

Sonra `yayin/` klasörünün içini FileZilla ile yükleyin (bölüm 1).

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
monitörünü çağrıştırdığı için bırakıldı). Dosya `yayin/assets/img/orgu.svg`;
`build/gen-orgu.js` ile üretilir (deterministik, her çalıştırmada aynı çizgi çıkar).
