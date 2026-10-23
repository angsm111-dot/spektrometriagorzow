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
Kalkulator wymaga ręcznego wpisania aktualnej ceny skupu za gram wybranej próby. Nie pobiera kursów automatycznie. Zmiana próby zeruje stawkę, aby nie przeliczyć nowej próby według poprzedniej ceny.
