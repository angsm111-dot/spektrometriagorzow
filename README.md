# SEZAM LAB — spektrometriagorzow

Strona promująca badanie **złota (Au), srebra (Ag), palladu (Pd) i platyny (Pt)** spektrometrem **Helmut Fischer GOLDSCOPE SD® 300** z **detektorem SDD**.

## Informacje biznesowe
- Lokalizacja: Lombard SEZAM, ul. Pocztowa 11, Gorzów Wielkopolski
- Telefon: 601 775 146
- Reklama: badanie od ręki; typowy pojedynczy pomiar około minuty, zależnie od próbki i ustawień
- Materiał filmowy: https://www.youtube.com/watch?v=EQ3gu8VWePY (przed publikacją zweryfikować poprawność i dostępność osadzenia)

## Struktura projektu
- `index.html`: strona główna dodana do repozytorium
- `versions/google-ads.html`: wersja kampanijna
- `docs/CONTENT.md`: wytyczne komunikacji i dokładności
- `assets/`: docelowe miejsce na autentyczne zdjęcia SD300
- `versions/`: docelowe miejsce na pozostałe wersje Premium oraz WOW

## Ważne dla Codexa
Projekt powstał jako kilka niezależnych plików HTML z obrazami osadzonymi jako `data:image/...;base64`. **Pełne oryginalne pliki `sezam_fischer_sd300_wow.html`, `sezam_fischer_sd300_premium.html`, `sezam_fischer_sd300_google_ads.html` nie zostały jeszcze w całości zaimportowane do repozytorium.** Nie utożsamiaj aktualnego `index.html` z pełną wersją WOW. Po otrzymaniu źródeł:
1. zachowaj pełny projekt WOW jako główne `index.html`;
2. rozdziel CSS, JS i obrazy do `css/`, `js/`, `assets/`;
3. zachowaj pozostałe warianty w `versions/`;
4. zweryfikuj linki, formularze, RWD i prawa do materiałów producenta.

## Publikacja
Strony HTML są statyczne. Repozytorium samo w sobie nie oznacza, że witryna została opublikowana. Do hostingu można wykorzystać GitHub Pages lub własny serwer po weryfikacji materiałów.

## Witryna wielostronicowa
- `index.html`: skrócona strona główna
- `technologia.html`: urządzenie, zalety i film
- `analiza-xrf.html`: wyniki, przebieg i ograniczenia badania
- `skup-zlota.html`: informacje o skupie i kalkulator
- `blog.html`: lista poradników; `proby-zlota.html` i `jak-wycenic-zloto.html`: artykuły
- `kontakt.html`: telefon, adres i dojazd
- `css/base.css`, `css/light.css`: wspólne style; `js/site.js`: obsługa prezentacji; `js/calculator.js`: kalkulator

Uruchom lokalnie: `python3 -m http.server 8000 --bind 127.0.0.1` w katalogu repozytorium.
Kalkulator pobiera gotowe ceny skupu (po ustawieniach panelu) z `https://skup-zlota-gorzow.angsm111.workers.dev/api/prices`, z pola `metals.gold.purities[próba].price`. Odświeża je co minutę i po powrocie do karty. Cena jest tylko do odczytu; lista prób pochodzi z API. Nie liczymy ponownie potrąceń ani wartości spot. Przy błędzie, danych starszych niż 15 minut lub dostawcy „Dane zapasowe” kalkulator ukrywa wycenę. Nie przechowuje zapasowej kopii cen.

Style są także osadzone w każdej podstronie, aby zewnętrzny podgląd HTML nie wyświetlał najpierw niesformatowanego dokumentu. Po zmianie `css/base.css` lub `css/light.css` uruchom `python3 tools/embed_styles.py`. Skrypt odświeża istniejący blok stylów bez jego duplikowania.

## Wdrożenie wspólnego cennika
W repozytorium `angsm111-dot/nowa-skup-zlota-gorzow` poprawka Workera dodaje `Access-Control-Allow-Origin: *` wyłącznie do publicznego GET `/api/prices`. Nie udostępnia tras administracyjnych ani poświadczeń. Zmianę należy wdrożyć do istniejącego Workera `skup-zlota-gorzow` przez jego połączony proces wdrażania Cloudflare (albo `wrangler deploy` z autoryzowanej maszyny). Sam push do GitHuba nie potwierdza wdrożenia.

Po wdrożeniu sprawdź w przeglądarce stronę `skup-zlota.html`: stawka dla 585 musi zgadzać się z panelem, a po opublikowaniu zmiany w panelu przycisk „Odśwież ceny” powinien pobrać nową wartość. Nie publikuj haseł panelu ani tokenów Cloudflare w kodzie strony.

Test interfejsu: przy działającym serwerze lokalnym i dostępnym Playwright uruchom `node tests/calculator.cjs`. Test przechwytuje API i sprawdza kontrolowane dane testowe, nie dostępność produkcji.
