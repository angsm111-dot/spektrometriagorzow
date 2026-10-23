# Kontynuacja projektu SEZAM

## Punkt wyjścia
- Repozytorium strony: https://github.com/angsm111-dot/spektrometriagorzow — gałąź `main`.
- Repozytorium panelu cen: https://github.com/angsm111-dot/nowa-skup-zlota-gorzow — gałąź `main`; ostatnia poprawka API `9c16ceb`.
- Każda sesja chmurowa jest już izolowana. Korzystaj z istniejącego checkoutu; nie twórz worktree bez wyraźnej prośby użytkownika.
- To statyczny HTML/CSS/JS; bez instalowania zależności aplikacji i bez bundlera. Serwer: `python3 -m http.server 8000 --bind 127.0.0.1` w katalogu strony. Proces trzeba uruchomić ponownie w nowej sesji.

## Wygląd i treść zatwierdzone przez właściciela
- Jasna, kremowo-złota witryna z osobnymi podstronami, nie jeden długi landing.
- Geometryczne logo SEZAM w `assets/sezam-logo.svg`, odtworzone z przesłanego wzoru. Podpis „Spektrometria Gorzów” wycentrowany pod samym napisem SEZAM, z cienką linią.
- Hasło główne: „Badamy sprzętem Helmut Fischer”. Właściciel potwierdził informację o używaniu marki przez urzędy probiercze w całej Polsce i na świecie, powołując się na potwierdzenie od Helmut Fischer. Nie utożsamiać marki z identycznym modelem urządzenia ani rekomendacją urzędów.
- Urządzenie: GOLDSCOPE SD® 300, detektor SDD, kolimator 0,6 mm i autofocus. Nie dodawać nieudokumentowanego światowego rankingu.
- Cennik badań: 1 pomiar 25 zł; 3 pomiary 60 zł; Multi — sprawdzenie w 5 miejscach 80 zł.
- Telefon i WhatsApp: +48 601 775 146. Adres: ul. Pocztowa 11, Gorzów Wielkopolski.
- Film właściciela jest w `assets/video/`; przycisk „Obejrzyj film” w menu prowadzi do `prezentacja.html`.

## Skup złota — najnowszy układ
- Krótki wstęp, kompaktowa cena giełdowa złota 999,9, następnie zwykła tabela: próba / cena za 1 g. Nie przywracać kafelków ani przycisków z cenami — właściciel wyraźnie je odrzucił ze względu na telefon.
- Kalkulator pod tabelą, krótkie informacje na dole; bez długich opisów przed cenami.
- Źródło: https://skup-zlota-gorzow.angsm111.workers.dev/api/prices . Cena giełdowa: `metals.gold.spot`. Ceny skupu: `metals.gold.purities[próba].price`; nie naliczać ponownie potrąceń.
- Aktualizacja co minutę. Nie wyświetlać wyceny po błędzie, przy danych zapasowych lub starszych niż 15 minut.
- Publiczny GET ma CORS `*` za zgodą właściciela; nie dotyczy to administracji ani zapisu. Brak haseł i tokenów w repozytorium. Odczyt publicznych cen nie wymaga tokenu Cloudflare.

## Oryginalne zdjęcia urządzenia
- Właściciel dodał pliki bezpośrednio do repozytorium: `assets/Screenshot_134.jpg` (przód, 864×674) i `assets/Screenshot_131.jpg` (bok, 767×587).
- Na prośbę właściciela hero ponownie używa wcześniejszego `assets/fischer-sd300-cutout.png` z widocznym prawym bokiem urządzenia. Przy parametrach pozostaje oryginalne ujęcie od przodu `Screenshot_134.jpg`. Profil `Screenshot_131.jpg` jest zachowany, ale nie jest wyświetlany.
- Zachować oryginalne pliki i napisy urządzenia bez generatywnej obróbki. Szare tło dopasowano stylem otoczenia, nie zmieniano pikseli zdjęć.
- `fischer-sd300-cutout.png` jest wcześniejszym ujęciem z tłem usuniętym generatywnie, przywróconym na wyraźną prośbę właściciela. Nie używać ponownie zniekształconego drugiego ujęcia `fischer-sd300-front.png`.

## Edycja i sprawdzanie
- Po zmianie `css/base.css` lub `css/light.css`: `python3 tools/embed_styles.py`. Style są osadzone w HTML, żeby zewnętrzny podgląd nie migał przed wczytaniem CSS.
- Test kalkulatora z Playwright: `node tests/calculator.cjs`. Inny port serwera: `SITE_URL=http://127.0.0.1:8001 node tests/calculator.cjs`. Test używa kontrolowanych odpowiedzi API, nie potwierdza dostępności produkcji.
- Sprawdź rzeczywiste odtwarzanie filmu, lokalne linki, brak przewijania na boki przy 320/390 px i dostępność produkcyjnego cennika, gdy ich dotyczą zmiany.
- Podgląd użytkownika: `https://htmlpreview.github.io/?https://github.com/angsm111-dot/spektrometriagorzow/blob/main/index.html` . W razie cache użyj pełnego SHA commita zamiast `main`.
- Wysłanie kodu na GitHub nie jest dowodem opublikowania strony na osobnej domenie.
