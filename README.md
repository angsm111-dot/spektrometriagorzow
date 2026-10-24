# SEZAM LAB — spektrometriagorzow

Strona promująca badanie **złota (Au), srebra (Ag), palladu (Pd) i platyny (Pt)** spektrometrem **Helmut Fischer GOLDSCOPE SD® 300** z **detektorem SDD**.

## Informacje biznesowe
- Lokalizacja: Lombard SEZAM, ul. Pocztowa 11, Gorzów Wielkopolski
- Telefon: 601 775 146
- Reklama: badanie od ręki; typowy pojedynczy pomiar około minuty, zależnie od próbki i ustawień
- Film: własny plik `assets/video/goldscope-video.webm`, używany w prezentacji i dziale Technologia; bez osadzeń YouTube.

## Struktura projektu
- `index.html`: strona główna dodana do repozytorium
- `versions/google-ads.html`: wersja kampanijna
- `docs/CONTENT.md`: wytyczne komunikacji i dokładności
- `assets/`: docelowe miejsce na autentyczne zdjęcia SD300
- `versions/`: docelowe miejsce na pozostałe wersje Premium oraz WOW

## Kontynuacja pracy w Codexie
Otwórz repozytorium `angsm111-dot/spektrometriagorzow`, gałąź `main`. Przed zmianami przeczytaj [stan projektu i ustalenia](docs/KONTYNUACJA.md) oraz [wytyczne treści](docs/CONTENT.md). Aktualna wersja jest witryną wielostronicową; zachowaj ją jako punkt wyjścia. Starsze nazwy WOW/Premium to historia projektu, nie instrukcja zastąpienia bieżącej strony.

## Publikacja
Strony HTML są statyczne. Repozytorium samo w sobie nie oznacza, że witryna została opublikowana. Do hostingu można wykorzystać GitHub Pages lub własny serwer po weryfikacji materiałów.

## Witryna wielostronicowa
- `index.html`: skrócona strona główna
- `technologia.html`: urządzenie, zalety i film
- `analiza-xrf.html`: wyniki, przebieg i ograniczenia badania
- `skup-zlota.html`: dział „Skup metali szlachetnych”, tabela cen i kalkulator złota, srebra, palladu i platyny (dotychczasowy adres zachowany dla zgodności)
- `blog.html`: lista poradników; `proby-zlota.html` i `jak-wycenic-zloto.html`: artykuły
- `kontakt.html`: telefon, adres, dojazd i WhatsApp
- `cennik.html`: ceny pomiarów
- `prezentacja.html`: prezentacja wideo urządzenia
- `css/base.css`, `css/light.css`: wspólne style; `js/site.js`: obsługa prezentacji; `js/calculator.js`: kalkulator

Uruchom lokalnie: `python3 -m http.server 8000 --bind 127.0.0.1` w katalogu repozytorium.
Kalkulator pobiera gotowe ceny skupu (po ustawieniach panelu) z `https://skup-zlota-gorzow.angsm111.workers.dev/api/prices`, z pola `metals[metal].purities[próba].price`. Odświeża je co minutę i po powrocie do karty. Cena jest tylko do odczytu; lista prób pochodzi z API. Nie liczymy ponownie potrąceń ani wartości spot. Przy błędzie, danych starszych niż 15 minut lub dostawcy „Dane zapasowe” kalkulator ukrywa wycenę. Nie przechowuje zapasowej kopii cen.

Style są także osadzone w każdej podstronie, aby zewnętrzny podgląd HTML nie wyświetlał najpierw niesformatowanego dokumentu. Po zmianie `css/base.css` lub `css/light.css` uruchom `python3 tools/embed_styles.py`. Skrypt odświeża istniejący blok stylów bez jego duplikowania.

## Status połączenia z panelem
Właściciel zaakceptował publiczny odczyt cen. Przywrócono nagłówek `Access-Control-Allow-Origin: *` wyłącznie dla GET `/api/prices` w repozytorium `nowa-skup-zlota-gorzow`. Kalkulator odczytuje gotowe stawki bez haseł i bez dostępu do tras administracyjnych. CORS nie jest uwierzytelnieniem ani ochroną przed kopiowaniem publicznych cen.

W tej sesji potwierdzono na żywo odpowiedź HTTP 200 i nagłówek CORS z produkcyjnego Workera oraz działanie interfejsu na pobranych danych. Nie wykonywano bezpośredniego wdrożenia przez Wrangler; aktualizacja została zaobserwowana po przesłaniu kodu na GitHub. W nowej sesji ponownie sprawdź dostępność API. Token Cloudflare nie jest wymagany do odczytu cen.

Test interfejsu: przy działającym serwerze lokalnym i dostępnym Playwright uruchom `node tests/calculator.cjs`. Test używa danych testowych i nie potwierdza produkcyjnego połączenia.

## Cennik badań
`cennik.html`: 1 pomiar — 25 zł; 3 pomiary — 60 zł; Multi, sprawdzenie w 5 miejscach — 80 zł. Stawki podane przez właściciela.

## Prezentacja wideo
`prezentacja.html` odtwarza przesłany przez właściciela `assets/video/goldscope-video.webm` (VP9/Opus, 1920×1080, około 91 s). Film ma sterowanie, odtwarzanie inline i plakat, bez autoplay. W menu wszystkich podstron jest przycisk „Obejrzyj film”.

Kalkulator ma wspólny wybór metalu nad tabelą (gold/silver/palladium/platinum). Zmiana metalu przełącza tabelę cen, notowanie `metals[metal].spot`, listę prób i wycenę. Brak danych jednego metalu blokuje wyłącznie jego wycenę i nie przenosi stawek z innego metalu.

## Blog i lokalne SEO
Blog zawiera osiem osobnych artykułów HTML z unikalnymi tytułami, opisami, nagłówkami H1 oraz danymi Article w JSON-LD. Lista artykułów jest w `blog.html` (CollectionPage / ItemList). Frazy lokalne są wplecione w treść, bez powielania identycznych tekstów.

Tematy: podstawy XRF, badanie złota w Gorzowie, próby złota, przygotowanie do wyceny, badanie srebra, platyna i pallad, kolimator/autofocus/SDD oraz przygotowanie biżuterii, monet i sztabek. Trzy ilustracje w `assets/blog/` są wygenerowanymi zdjęciami ilustracyjnymi w WebP; zdjęcie spektrometru pozostaje oryginalnym plikiem właściciela.

Po ustaleniu docelowej domeny można uzupełnić absolutne adresy canonical, sitemap i zgłosić witrynę do Google Search Console. Nie wpisywać domeny na podstawie domysłów ani nie gwarantować pozycji w wynikach wyszukiwania.
