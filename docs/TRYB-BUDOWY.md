# Publiczna zaślepka i dalszy rozwój

## Aktywny tryb
`deployment.json` zawiera `"mode": "maintenance"`.

Push do `main` publikuje na JDM wyłącznie anonimową stronę „Strona w budowie”. Każdy znany adres HTML (również stare artykuły i kontakt) otrzymuje tę samą zaślepkę z `noindex`. Publikacja usuwa z hostingu wyłącznie śledzone pliki tego projektu z `assets`, `css` i `js`. Nie usuwa całych katalogów ani ustawień hostingu, `.htaccess` czy plików innych usług.

Pełne źródła, oryginalne zdjęcia i film pozostają w GitHubie. Nie zastępować źródłowego `index.html` zaślepką.

## Podgląd i edycja
- Edytuj jak dotąd pliki HTML, CSS i JS w katalogu głównym.
- Po edycji wspólnych stylów: `python3 tools/embed_styles.py`.
- Lokalny podgląd pełnego projektu: `python3 -m http.server 8000 --bind 127.0.0.1` w repozytorium.
- Eksport pełnego projektu do podglądu: `python3 tools/package_site.py /tmp/podglad.zip --preview`.
- Dotychczasowy podgląd WWW: https://htmlpreview.github.io/?https://github.com/angsm111-dot/spektrometriagorzow/blob/main/index.html
- Repozytorium i ten podgląd są publiczne. Nie są prywatnym środowiskiem chronionym hasłem. Zaślepka nie usuwa wcześniejszych kopii z wyszukiwarek i cudzych archiwów.

## Przywrócenie pełnej witryny
Dopiero na wyraźne polecenie właściciela ustaw `"mode": "live"` w `deployment.json`, zatwierdź i wyślij zmianę na `main`. Publikacja ponownie wgra pełną stronę i materiały. Do tego czasu nowe wpisy i poprawki nie odsłaniają witryny na domenie.

## Kontrola publikacji
Workflow sprawdza tryb wdrożenia. W trybie budowy weryfikuje wszystkie znane adresy HTML, brak firmy i telefonu, `noindex`, aktualny numer wersji oraz niedostępność poprzednich śledzonych plików graficznych i skryptów. W trybie live sprawdza blog i zgodność wersji podstron.
