# Publikacja w JDM

Docelowy adres: https://www.spektrometrgorzow.pl/
Panel podany przez właściciela: https://panel.jdm.pl/

## Przygotowane
- Strona statyczna: nie potrzebuje WordPressa, Node.js ani bazy danych do działania.
- Wszystkie podstrony mają adresy canonical dla domeny www.
- `robots.txt` i `sitemap.xml` zawierają docelową domenę.
- Paczka do wgrania: `python3 tools/package_site.py /tmp/spektrometrgorzow-strona.zip`.
- ZIP zawiera pliki strony, zdjęcia i film. Nie zawiera Git, sekretów ani testów.

## Stan
Domena, aktywność hostingu i konfiguracja DNS nie zostały jeszcze zweryfikowane. Dostęp HTTP do domeny i panelu blokuje polityka sieci środowiska. Nie podłączono konta JDM ani dostępu do plików serwera. Próba aktualizacji listy domen środowiska zakończyła się konfliktem nieaktualnej wersji szkicu; zapis nie został potwierdzony. Nie oznacza to błędu samej domeny lub hostingu.

## Do ustalenia w panelu
1. Czy istnieje aktywna usługa hostingowa i czy obsługuje tę domenę.
2. Adres IP / serwer docelowy oraz sposób zarządzania DNS.
3. Katalog strony przypisany do domeny i metoda wgrywania plików (menedżer plików, SFTP lub inna dostępna metoda).
4. Konfiguracja `www`, certyfikat SSL dla www i domeny bez www, następnie przekierowanie na docelowy adres.

Nie zmieniać istniejących rekordów pocztowych MX/TXT ani działających usług bez sprawdzenia ich przeznaczenia. Nie zgadywać IP hostingu. Haseł i tokenów nie zapisywać w repozytorium ani w rozmowie.

## Po publikacji
Sprawdzić HTTPS, nawigację, zdjęcia, film, kalkulator z publicznym API oraz odczyt `/sitemap.xml` i `/robots.txt`. Zweryfikować jeden docelowy adres dla www i bez www. Dopiero udane żądania do domeny potwierdzają publikację — sam commit ani pakiet ZIP jej nie potwierdzają.
