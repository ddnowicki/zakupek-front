# Dokument wymagań produktu (PRD) - Aplikacja do generowania list zakupów

## 1. Przegląd produktu

Aplikacja webowa, której głównym celem jest ułatwienie tworzenia list zakupów za pomocą systemu AI oraz historii poprzednich zakupów. Pozwala ona na dostosowanie proponowanych list zgodnie z danymi demograficznymi użytkownika oraz jego preferencjami żywieniowymi. Aplikacja ma zapewnić zarówno wygodny sposób ręcznego edytowania list, jak i automatyczne sortowanie produktów w kategoriach.

## 2. Problem użytkownika

Użytkownicy często tracą czas na ręczne tworzenie list zakupów, a dodatkowo mogą zapominać o ważnych pozycjach. W efekcie listy bywają niepełne, powtarzalne i chaotycznie skonstruowane. Rozwiązanie ma zautomatyzować proces, uwzględniając sezonowość oraz preferencje żywieniowe, aby generować trafniejsze listy zakupów.

## 3. Wymagania funkcjonalne

1. Rejestracja i logowanie użytkowników w celu przechowywania spersonalizowanych list:
    - Podawanie liczby i wieku domowników
    - Podawanie preferencji żywieniowych
    - Rejestracja poprzez podanie adresu e-mail, hasła oraz nazwy użytkownika
2. Automatyczne generowanie list zakupów z wykorzystaniem AI:
    - Analiza historii poprzednich zakupów
    - Uwzględnianie sezonowości produktów
    - Dopasowywanie ilości produktów do liczby domowników
3. Ręczne tworzenie, edycja i usuwanie list zakupów:
    - Dodawanie nowych pozycji i ich ilości
    - Redagowanie wybranych elementów
    - Usuwanie zbędnych pozycji
    - Planowanie daty zakupów
    - Przypisywanie listy do określonego sklepu
4. Zarządzanie statusem produktów na liście:
    - Oznaczanie produktów jako "do kupienia" lub "kupione"
    - Śledzenie zmian statusu produktów w czasie rzeczywistym
5. Sortowanie list zakupów według podstawowych kategorii (np. napoje, pieczywo, nabiał).
6. Przeglądanie poprzednich list zapisanych w historii konta:
    - Sortowanie list według różnych kryteriów (najnowsze, najstarsze, alfabetycznie)
    - Paginacja wyników dla lepszej nawigacji
7. Podstawowa wyszukiwarka produktów w czasie tworzenia lub edycji listy.
8. Brak rekomendacji związanych z konkretnymi markami w ramach MVP.
9. Brak rozbudowanych filtrów i zaawansowanego systemu raportowania (przeznaczone na dalsze etapy).

## 4. Granice produktu

1. Wyłączone z MVP:
    - Współdzielenie list z innymi użytkownikami
    - Walidacja paragonów
    - Wersje mobilne (rozwiązanie ogranicza się do wersji webowej w MVP)
    - Propozycje konkretnych marek produktów
    - Zaawansowane raporty i analizy dostępne bezpośrednio dla użytkownika
2. Analiza logów oraz raportów będzie dostępna tylko dla zespołu tworzącego aplikację.
3. W MVP nie przewiduje się żadnych dodatkowych ograniczeń prawnych w zakresie przetwarzania danych poza standardowymi wymogami prawnymi.
4. Uwierzytelnianie będzie realizowane poprzez tokeny JWT (JSON Web Tokens).

## 5. Historyjki użytkowników

### US-001

Tytuł: Rejestracja użytkownika z danymi o domownikach i preferencjach
Opis: Jako nowy użytkownik chcę zarejestrować konto, podając liczbę i wiek domowników oraz preferencje żywieniowe, aby aplikacja mogła trafniej generować listy zakupów.
Kryteria akceptacji:

- Możliwość utworzenia konta z adresem e-mail, hasłem i nazwą użytkownika
- Formularz do wypełnienia liczby i wieku domowników
- Sekcja wyboru preferencji żywieniowych (np. wegetariańskie, bez laktozy)
- Uwierzytelnione konto jest aktywne w systemie
- Po rejestracji użytkownik otrzymuje token dostępowy do API

### US-002

Tytuł: Logowanie i bezpieczny dostęp
Opis: Jako zarejestrowany użytkownik chcę móc zalogować się do aplikacji w bezpieczny sposób, aby uzyskać dostęp do moich zapisanych list zakupów.
Kryteria akceptacji:

- Wprowadzenie poprawnych danych logowania (e-mail oraz hasło) skutkuje dostępem do aplikacji
- Gdy dane logowania są nieprawidłowe, wyświetlany jest komunikat o błędzie
- Sesja uwierzytelniająca musi być zabezpieczona (np. szyfrowanym połączeniem)
- Użytkownik otrzymuje token JWT po zalogowaniu

### US-003

Tytuł: Generowanie listy zakupów z wykorzystaniem AI
Opis: Jako zalogowany użytkownik chcę otrzymać propozycję listy zakupów na podstawie historii oraz danych o domownikach i preferencjach, aby zaoszczędzić czas na planowaniu zakupów.
Kryteria akceptacji:

- System AI przedstawia listę produktów z uwzględnieniem sezonowości
- Lista zawiera sugerowane ilości produktów na podstawie liczby domowników
- Użytkownik może przejrzeć propozycje i zaakceptować je lub odrzucić
- Możliwość określenia planowanej daty zakupów i przypisania listy do konkretnego sklepu

### US-004

Tytuł: Ręczne tworzenie i edycja listy zakupów
Opis: Jako zalogowany użytkownik chcę móc samodzielnie tworzyć listę zakupów oraz dodawać, edytować i usuwać pozycje, aby modyfikować listę zgodnie z własnymi potrzebami.
Kryteria akceptacji:

- Możliwość rozpoczęcia nowej listy i dodawania produktów z określoną ilością
- Edycja nazwy, ilości i statusu produktu
- Usuwanie wybranych pozycji z listy
- Możliwość zmiany tytułu listy, przypisanego sklepu i planowanej daty zakupów

### US-005

Tytuł: Sortowanie listy zakupów według kategorii
Opis: Jako użytkownik chcę posortować wygenerowaną lub ręcznie stworzoną listę zakupów według podstawowych kategorii (np. napoje, pieczywo, nabiał), aby ułatwić robienie zakupów w sklepie.
Kryteria akceptacji:

- Aplikacja automatycznie przypisuje produkty do kategorii
- Użytkownik może wyświetlić listę w układzie kategoria-po-kategorii
- Kiedy brak określonej kategorii, produkt zostaje oznaczony jako "inne"

### US-006

Tytuł: Przeglądanie poprzednich list
Opis: Jako zalogowany użytkownik chcę mieć dostęp do historii stworzonych lub wygenerowanych wcześniej list, aby móc przejrzeć starsze listy zakupów.
Kryteria akceptacji:

- Wyświetlenie listy poprzednich zakupów z możliwością sortowania (od najnowszych do najstarszych, alfabetycznie)
- Możliwość wglądu w szczegóły każdej zapisanej listy
- Użytkownik może skopiować wybraną listę i ponownie ją użyć lub modyfikować
- Paginacja wyników dla łatwiejszej nawigacji

### US-007

Tytuł: Wyszukiwarka produktów
Opis: Jako zalogowany użytkownik chcę móc wyszukiwać konkretne produkty w trakcie dodawania lub edycji list, aby szybciej i łatwiej tworzyć listę zakupów.
Kryteria akceptacji:

- Pole tekstowe do wpisania nazwy produktu
- Filtrowanie po wpisanych znakach
- Brak zaawansowanych filtrów w MVP (np. po marce)

### US-008

Tytuł: Powiadomienie o sezonowości produktów
Opis: Jako zalogowany użytkownik chcę otrzymywać proste informacje o sezonowości wybranych produktów, aby nie otrzymywać propozycji nieodpowiednich w danym okresie.
Kryteria akceptacji:

- System informuje, kiedy dany produkt jest poza sezonem
- Ograniczona lista sezonowych produktów bazująca na uproszczonej bazie lub statycznych danych
- Możliwość zignorowania ostrzeżenia i dodania produktu poza sezonem

### US-009

Tytuł: Zarządzanie statusem produktów
Opis: Jako zalogowany użytkownik chcę móc oznaczać produkty jako kupione lub do kupienia podczas realizacji zakupów.
Kryteria akceptacji:

- Możliwość zmiany statusu produktu z "do kupienia" na "kupiony" i odwrotnie
- Wizualne rozróżnienie produktów o różnym statusie na liście
- Automatyczne aktualizowanie statusu na serwerze po zmianie

### US-010

Tytuł: Przypisanie listy do konkretnego sklepu
Opis: Jako zalogowany użytkownik chcę móc oznaczyć, w którym sklepie planuję zrealizować zakupy z danej listy.
Kryteria akceptacji:

- Możliwość wyboru sklepu podczas tworzenia lub edycji listy
- Wyświetlanie nazwy przypisanego sklepu w podglądzie listy zakupów
- Możliwość pozostawienia pola sklepu jako nieprzypianego (null)

## 6. Metryki sukcesu

1. Przynajmniej 75% pozycji na wygenerowanych listach jest akceptowanych przez użytkownika (mierzona liczba akceptacji względem ogólnej liczby sugerowanych pozycji przez AI).
2. 75% list zakupowych tworzonych jest z wykorzystaniem rekomendacji AI (odsetek list wygenerowanych przez AI w stosunku do wszystkich nowo utworzonych list).
3. Tempo wzrostu liczby aktywnych kont i częstotliwość logowań (pokazują, czy użytkownicy chętnie korzystają z aplikacji).
4. Czas potrzebny na przygotowanie listy zakupów (ocena, czy aplikacja realnie skraca ten proces względem tradycyjnych metod).
