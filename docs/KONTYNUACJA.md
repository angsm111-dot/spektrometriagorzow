# Kontynuacja projektu SEZAM

## Punkt wyjścia
- Repozytorium strony: https://github.com/angsm111-dot/spektrometriagorzow — gałąź `main`.
- Repozytorium panelu cen: https://github.com/angsm111-dot/nowa-skup-zlota-gorzow — gałąź `main`; ostatnia poprawka API `9c16ceb`.
- Każda sesja chmurowa jest już izolowana. Korzystaj z istniejącego checkoutu; nie twórz worktree bez wyraźnej prośby użytkownika.
- To statyczny HTML/CSS/JS; bez instalowania zależności aplikacji i bez bundlera. Serwer: `python3 -m http.server 8000 --bind 127.0.0.1` w katalogu strony. Proces trzeba uruchomić ponownie w nowej sesji.

## Wygląd i treść zatwierdzone przez właściciela
- Jasna, kremowo-złota witryna z osobnymi podstronami, nie jeden długi landing. Do szerokości 1100 px menu jest domyślnie zwinięte pod przyciskiem „Menu”, z obsługą aria-expanded, Escape i klawiatury; bez JS linki pozostają dostępne. Nie przywracać stale widocznych rzędów linków na telefonie.
- Geometryczne logo SEZAM w `assets/sezam-logo.svg`, odtworzone z przesłanego wzoru. Podpis „Spektrometria Gorzów” wycentrowany pod samym napisem SEZAM, z cienką linią.
- Hasło główne: „Badamy sprzętem Helmut Fischer”. Właściciel potwierdził informację o używaniu marki przez urzędy probiercze w całej Polsce i na świecie, powołując się na potwierdzenie od Helmut Fischer. Nie utożsamiać marki z identycznym modelem urządzenia ani rekomendacją urzędów.
- Urządzenie: GOLDSCOPE SD® 300, detektor SDD, kolimator 0,6 mm i autofocus. Nie dodawać nieudokumentowanego światowego rankingu.
- Cennik badań: 1 pomiar 25 zł; 3 pomiary 60 zł; Multi — sprawdzenie w 5 miejscach 80 zł.
- Telefon i WhatsApp: +48 601 775 146. Adres: ul. Pocztowa 11, Gorzów Wielkopolski.
- Film właściciela jest w `assets/video/`; przycisk „Obejrzyj film” w menu prowadzi do `prezentacja.html`.

## Skup metali szlachetnych — najnowszy układ
- Wspólny wybór metalu: złoto, srebro, pallad, platyna; krótki wstęp, kompaktowa cena giełdowa wybranego metalu, następnie zwykła tabela: próba / cena za 1 g. Nie przywracać kafelków ani przycisków z cenami — właściciel wyraźnie je odrzucił ze względu na telefon.
- Kalkulator pod tabelą, krótkie informacje na dole; bez długich opisów przed cenami.
- Źródło: https://skup-zlota-gorzow.angsm111.workers.dev/api/prices . Cena giełdowa: `metals[metal].spot`. Ceny skupu: `metals[metal].purities[próba].price`; nie naliczać ponownie potrąceń.
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

Test nawigacji mobilnej: `SITE_URL=http://127.0.0.1:8000 node tests/navigation.cjs` przy działającym serwerze i Playwright.

Responsywność: `SITE_URL=http://127.0.0.1:8000 node tests/responsive.cjs` sprawdza wszystkie podstrony na 7 szerokościach (320–1440 px), wychodzenie treści poza ekran i obcięty tekst. Test używa danych kontrolowanych. Ostatnia kontrola obejmowała też emulację dotyku, menu oraz kalkulator; nie jest testem na fizycznym iPhonie/Safari. Pola formularza mobilnego mają minimum 16 px.

Mobilna strona główna (do 700 px): nagłówek i zdanie o urzędach probierczych, bezpośrednio potem zdjęcie urządzenia, następnie szczegóły i przyciski. Układ desktopowy pozostawiony bez zmian (porównanie zrzutów przed/po). Nie przesuwać zdjęcia za długi opis na telefonie.

## Ostatnia rozbudowa treści
- Slogan na głównej powiększony i skrócony na prośbę właściciela: „Wykorzystywany we wszystkich urzędach probierczych w Polsce i na świecie”. Nie powtarzać słowa „sprzęt” pod nagłówkiem Helmut Fischer. Dolny przycisk „Zadzwoń” pozostaje. Zachowano położenie zdjęcia tuż pod nim w widoku mobilnym.
- Na życzenie właściciela usunięto z publicznych opisów Technologii i Kontaktu uwagi o urzędowym charakterze/cechowaniu. Nie dodawano obietnic o badaniu całego wnętrza przedmiotu.
- 16 osobnych podstron HTML, w tym blog z 8 artykułami (dwa wcześniejsze rozbudowane, sześć nowych). Każdy artykuł ma własny plik, opis meta, H1, ilustrację i dane Article. Menu dalej prowadzi do osobnych HTML.
- Obrazy ilustracyjne bloga są wygenerowane, podpisane jako ilustracyjne i zapisane w lekkim WebP. Nie zastępują autentycznych zdjęć urządzenia.
- Kanoniczne adresy i sitemap do uzupełnienia po otrzymaniu domeny. Pozycje Google nie są gwarantowane.

Optymalizacja głównego zdjęcia: `fischer-sd300-640.webp` (około 37 KB) i `fischer-sd300-1100.webp` (około 83 KB) zastępują pobieranie ciężkiego PNG 1,4 MB. Oryginalny PNG zachowany. Hero używa srcset/sizes, eager + fetchpriority high i dopasowanego preload bez podwójnego pobierania. Zdjęcie powiększone do 108% szerokości pola. Nie przywracać ciężkiego PNG jako src na stronie.

Precyzja: dodano wyróżnienie przy parametrach na głównej i w Technologii oraz sekcję `#precyzja-pomiaru` w poradniku o kolimatorze/autofocusie/SDD. Nie obiecywać identycznej dokładności jak urzędy wyłącznie na podstawie zgodności marki; do takiej gwarancji potrzebne są dane o modelu, kalibracji i warunkach pomiaru.

Ostatnia decyzja właściciela: główna zawiera tylko hero (slogan, pierwsze zdjęcie, parametry i główne przyciski) oraz stopkę. Usunięto drugie zdjęcie, opis „Podejmij świadomą decyzję”, kafelki działów i reklamę cennika. Nie dodawać tych sekcji ponownie bez prośby. Zdjęcia i szczegóły pozostają w Technologii, cennik i blog jako osobne HTML.
