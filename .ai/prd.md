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

### US-001 Rejestracja użytkownika
Opis: Jako nowy użytkownik chcę zarejestrować konto podając e-mail, hasło, nazwę użytkownika, liczbę i wiek domowników oraz preferencje żywieniowe, aby otrzymać token JWT i umożliwić korzystanie z API.
Kryteria akceptacji:
- POST /api/auth/register zwraca AuthResponse z tokenem JWT
- Walidacja e-maila i hasła

### US-002 Logowanie użytkownika
Opis: Jako zarejestrowany użytkownik chcę zalogować się przy użyciu e-maila i hasła, aby otrzymać token JWT do kolejnych żądań.
Kryteria akceptacji:
- POST /api/auth/login zwraca AuthResponse z tokenem JWT przy poprawnych danych
- Przy błędnych danych zwraca odpowiedni błąd

### US-003 Pobranie profilu użytkownika
Opis: Jako zalogowany użytkownik chcę pobrać moje dane profilowe, aby wyświetlić informacje o moim koncie.
Kryteria akceptacji:
- GET /api/users/profile zwraca UserProfileResponse z danymi użytkownika

### US-004 Tworzenie listy zakupów
Opis: Jako zalogowany użytkownik chcę utworzyć nową listę zakupów, podając tytuł, datę zakupów, sklep oraz pozycje.
Kryteria akceptacji:
- POST /api/shoppinglists zwraca ShoppingListDetailResponse ze szczegółami utworzonej listy

### US-005 Pobranie listy list zakupów
Opis: Jako zalogowany użytkownik chcę przeglądać moje listy zakupów z paginacją i sortowaniem.
Kryteria akceptacji:
- GET /api/shoppinglists?Page=&PageSize=&Sort= zwraca ShoppingListsResponse z listą wyników i metadanymi

### US-006 Pobranie szczegółów listy zakupów
Opis: Jako zalogowany użytkownik chcę pobrać szczegóły konkretnej listy zakupów.
Kryteria akceptacji:
- GET /api/shoppinglists/{id} zwraca ShoppingListDetailResponse dla podanego identyfikatora

### US-007 Edycja listy zakupów
Opis: Jako zalogowany użytkownik chcę zaktualizować istniejącą listę zakupów, edytując tytuł, datę, nazwę sklepu oraz pozycje. Wszystkie pozycje przesyłane w polu `products` stanowią pełny zestaw — pominięcie istniejącej pozycji oznacza jej usunięcie.
Kryteria akceptacji:
- PUT /api/shoppinglists/{id} zwraca wartość boolean `true` przy pomyślnej aktualizacji
- Request Body zawiera `storeName` zamiast `storeId` oraz pełną listę `products`

### US-008 Usuwanie listy zakupów
Opis: Jako zalogowany użytkownik chcę usunąć istniejącą listę zakupów.
Kryteria akceptacji:
- DELETE /api/shoppinglists/{id} zwraca wartość true przy udanym usunięciu

### US-009 Generowanie listy zakupów
Opis: Jako zalogowany użytkownik chcę wygenerować listę zakupów z wykorzystaniem AI na podstawie historii i preferencji.
Kryteria akceptacji:
- POST /api/shoppinglists/generate zwraca ShoppingListDetailResponse z wygenerowaną listą

## 6. Metryki sukcesu

1. Przynajmniej 75% pozycji na wygenerowanych listach jest akceptowanych przez użytkownika (mierzona liczba akceptacji względem ogólnej liczby sugerowanych pozycji przez AI).
2. 75% list zakupowych tworzonych jest z wykorzystaniem rekomendacji AI (odsetek list wygenerowanych przez AI w stosunku do wszystkich nowo utworzonych list).
3. Tempo wzrostu liczby aktywnych kont i częstotliwość logowań (pokazują, czy użytkownicy chętnie korzystają z aplikacji).
4. Czas potrzebny na przygotowanie listy zakupów (ocena, czy aplikacja realnie skraca ten proces względem tradycyjnych metod).
