# Plan implementacji widoku Dashboard (Lista list)

## 1. Przegląd

Widok służy do prezentacji wszystkich list zakupów użytkownika z możliwością sortowania i paginacji.

## 2. Routing widoku

- Ścieżka: `/lists`

## 3. Struktura komponentów

- **DashboardPage** (kontener główny)
  - **SortSelect** (selektor sortowania)
  - **ListCard** (lista kart)
  - **Pagination** (paginacja)

## 4. Szczegóły komponentów

### DashboardPage

- **Opis**: Kontener widoku zarządzający stanem i wywołaniami API.
- **Elementy**:
  - Nagłówek z tytułem widoku.
  - Komponenty: `SortSelect`, `ListCard[]`, `Pagination`.
- **Interakcje**:
  - Zmiana sortowania.
  - Kliknięcie paginacji.
- **Walidacja**: Sprawdzanie dostępności tokenu przed załadowaniem list.
- **Typy**: `GetShoppingListsRequest`, `ShoppingListsResponse`
- **Propsy**: Brak (główny widok).

### SortSelect

- **Opis**: Umożliwia wybór sposobu sortowania list.
- **Elementy**: `select` z opcjami ("newest", "oldest", "name").
- **Interakcje**: Zmiana wartości wywołuje funkcję odświeżenia list.
- **Walidacja**: Brak (predefiniowane opcje).
- **Typy**: `SortOption` (string)
- **Propsy**: `selectedSort: string`, `onChangeSort: (value: string) => void`

### ListCard

- **Opis**: Karta prezentująca pojedynczą listę.
- **Elementy**:
  - Tytuł listy, data planowana, nazwa sklepu, źródło, liczba produktów.
- **Interakcje**: Kliknięcie przekierowuje do widoku szczegółowego (poza zakresem).
- **Walidacja**: Brak (dane tylko do wyświetlenia).
- **Typy**: `ShoppingListResponse`
- **Propsy**: `list: ShoppingListResponse`

### Pagination

- **Opis**: Steruje numerem strony.
- **Elementy**: Przyciski "Poprzednia" / "Następna" i obecny nr strony.
- **Interakcje**: Kliknięcie zmiania stronę i odświeża listy.
- **Walidacja**: Brak (blokada przy braku kolejnych stron).
- **Typy**: `PaginationMetadata`
- **Propsy**: `pagination: PaginationMetadata`, `onPageChange: (page: number) => void`

## 5. Typy

- **GetShoppingListsRequest** { page: number; pageSize: number; sort: string }
- **PaginationMetadata** { page: number; pageSize: number; totalItems: number; totalPages: number }
- **ShoppingListResponse** { id: number; title?: string; productsCount: number; ... }

## 6. Zarządzanie stanem

- Przechowywany w `DashboardPage` (React `useState` lub `useReducer`).
- Stan: lista pobranych list, bieżąca strona, wybrany sort.

## 7. Integracja API

- Endpoint: `GET /api/shoppinglists`
- Zapytanie: `GetShoppingListsRequest` (page, pageSize, sort).
- Odpowiedź: `ShoppingListsResponse` (data, pagination).

## 8. Interakcje użytkownika

- Zmiana sortowania → aktualizacja stanu → wywołanie API.
- Zmiana paginacji → aktualizacja stanu → wywołanie API.

## 9. Warunki i walidacja

- Sprawdzenie tokenu (401 → przekierowanie do logowania).
- Walidacja istniejących stron (blokada przy krańcach paginacji).

## 10. Obsługa błędów

- Błędy sieciowe: wyświetlenie komunikatu lub ekranu błędu.
- Brak list (pusta odpowiedź) → placeholder empty state.

## 11. Kroki implementacji

1. Utworzenie ścieżki `/lists` i komponentu `DashboardPage`.
2. Zaimplementowanie wyświetlania list z paginacją i sortowaniem.
3. Stworzenie komponentów `SortSelect`, `ListCard`, `Pagination`.
4. Integracja z API w `DashboardPage`.
5. Obsługa stanów ładowania i błędów.
6. Finalne testy i poprawki.
