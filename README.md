# MeetingMindAI – Yapay Zekâ Destekli Toplantı Özetleme Sistemi

## Proje Hakkında

MeetingMindAI, toplantı ses kayıtlarını otomatik olarak metne dönüştüren, toplantı özetleri oluşturan ve kullanıcıların toplantı içerikleri hakkında soru sorabilmesini sağlayan yapay zekâ destekli bir uygulamadır.

Proje kapsamında konuşma tanıma (Speech-to-Text), doğal dil işleme (NLP), metin özetleme, anlamsal arama (Semantic Search) ve Retrieval-Augmented Generation (RAG) teknikleri kullanılmıştır.

## Proje Amaçları

* Ses kayıtlarını otomatik olarak yazıya dönüştürmek
* Uzun toplantı metinlerinden yapılandırılmış özetler oluşturmak
* Toplantılardaki önemli bilgileri saklamak
* Kullanıcıların toplantı içerikleri üzerinde soru-cevap yapabilmesini sağlamak
* Toplantı geçmişini görüntüleyebilmek

## Kullanılan Teknolojiler

### Backend

* Python
* FastAPI
* SQLite
* Uvicorn

### Yapay Zekâ ve NLP

* Faster Whisper
* Turkish LLaMA 8B Instruct
* Sentence Transformers
* RAG (Retrieval-Augmented Generation)

### Diğer Teknolojiler

* Google Colab
* Google Drive
* Ngrok

## Sistem Mimarisi

### 1. Ses Dosyasının Yüklenmesi

Kullanıcı tarafından yüklenen ses dosyası FastAPI sunucusuna gönderilir.

### 2. Konuşmanın Metne Dönüştürülmesi

Faster Whisper modeli kullanılarak ses kaydı metne çevrilir.

### 3. Metin Temizleme

Oluşan transkript içerisindeki gereksiz tekrarlar ve dolgu kelimeler temizlenir.

Örnek:

* eee
* ııı
* yani
* şey
* falan

### 4. Metnin Parçalara Ayrılması

Uzun metinler belirli boyutlarda parçalara bölünerek işlenebilir hale getirilir.

### 5. Embedding Oluşturulması

Sentence Transformer modeli kullanılarak her metin parçası için vektör temsilleri oluşturulur.

### 6. Toplantı Özeti Üretimi

Turkish LLaMA 8B modeli kullanılarak aşağıdaki başlıklarda toplantı özeti oluşturulur:

1. Konuşmanın Konusu
2. Önemli Noktalar
3. Alınan Kararlar
4. Yapılacak İşler
5. Sonuç

### 7. Veritabanına Kayıt

Oluşturulan transkript ve özet SQLite veritabanında saklanır.

### 8. Soru-Cevap Sistemi

Kullanıcı toplantı hakkında soru sorduğunda:

* Soru embedding'e dönüştürülür.
* En ilgili metin parçaları bulunur.
* LLaMA modeli bağlamı kullanarak cevap üretir.

## API Endpointleri

### POST /process-audio

Ses dosyasını işler.

Çıktı:

* Transkript
* Toplantı Özeti

### POST /chat

Toplantı içerikleri hakkında soru sorulmasını sağlar.

Çıktı:

* Soruya ait cevap

### GET /history

Daha önce oluşturulmuş toplantı özetlerini listeler.

## Kazanımlar

Bu proje kapsamında:

* FastAPI ile REST API geliştirme
* Speech-to-Text sistemleri
* Büyük Dil Modelleri (LLM)
* Metin özetleme sistemleri
* Embedding tabanlı anlamsal arama
* Retrieval-Augmented Generation (RAG)
* SQLite veritabanı işlemleri
* Yapay zekâ tabanlı uygulama geliştirme

konularında uygulamalı deneyim kazanılmıştır.

## Gelecekte Yapılması Planlanan Geliştirmeler

* Konuşmacı ayrıştırma (Speaker Diarization)
* Chat geçmişinin veritabanında saklanması
* FAISS veya ChromaDB entegrasyonu
* Docker desteği
* PostgreSQL entegrasyonu
* Gerçek zamanlı toplantı işleme
* Kullanıcı giriş sistemi
* Bulut ortamına dağıtım (AWS/Azure)
* Çoklu dil desteği
* Toplantı aksiyon maddelerinin otomatik çıkarılması
##Arayüz Görselleri
<img width="1867" height="899" alt="Ekran görüntüsü 2026-06-03 221339" src="https://github.com/user-attachments/assets/ae5d4f53-f051-4151-a75d-de5a222fa6dd" />
<img width="1873" height="908" alt="Ekran görüntüsü 2026-06-03 221404" src="https://github.com/user-attachments/assets/e5d2d956-6aff-4009-abb7-203d995fb2c9" />
<img width="1915" height="918" alt="Ekran görüntüsü 2026-06-03 221417" src="https://github.com/user-attachments/assets/313fbbf5-d0fd-473d-bf33-35281fec7b85" />



