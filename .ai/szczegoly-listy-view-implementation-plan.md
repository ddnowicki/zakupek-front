# Plan implementacji widoku Szczegóły listy i edycja

## 1. Przegląd
Widok ma za zadanie wyświetlić szczegóły istniejącej listy zakupów (tytuł, sklep, data, produkty) oraz umożliwić jej edycję. Użytkownik może modyfikować dane listy (np. tytuł, nazwa sklepu, data) i produkty (np. zmieniać nazwy, ilość) lub usunąć listę z systemu.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką:  
`/lists/:id`  

Parametr `:id` reprezentuje identyfikator listy, którą chcemy wyświetlić lub edytować.

## 3. Struktura komponentów
- **ListDetailsPage** (główny kontener widoku)
  - **InlineEdit** (tytuł listy)
  - **StoreNameEdit** (input do nazwy sklepu)
  - **DateEdit** (data planowanych zakupów)
  - **ProductTable** (lista produktów)
    - **StatusBadge** (informacje o stanie produktu)
    - **InlineEdit** (edycja nazw i ilości)
  - **SaveButton** (zapis zmian w liście)
  - **DeleteListButton** (usunięcie listy)

## 4. Szczegóły komponentów

### ListDetailsPage
- **Opis:** Główny komponent zarządzający logiką, pobiera dane listy z API i odpowiada za wyświetlanie oraz zapis zmian.
- **Główne elementy:** `<header>`, sekcje edycji (`InlineEdit`, `StoreNameEdit`, `DateEdit`) i tabela produktów.
- **Obsługiwane interakcje:**  
  - Załadowanie danych po wejściu na stronę.  
  - Kliknięcie przycisku „Zapisz” (wywołanie metody PUT do API).  
  - Kliknięcie przycisku „Usuń” (wywołanie metody DELETE do API).
- **Obsługiwana walidacja:**  
  - Weryfikacja poprawności typów i minimalnych wartości wpisywanych w edycji (np. ilość produktu > 0).  
  - Weryfikacja wymaganych pól (np. nazwa produktu nie jest pusta).
- **Typy:**  
  - `ShoppingListDetailResponse` (odczyt z API).  
  - `UpdateShoppingListRequest` (wysyłka do API).  
- **Propsy:**  
  - Brak (Component rodzic jest tu najczęściej stroną Astro lub React Router, który przekazuje `id` z route).

### ProductTable
- **Opis:** Tabela wyświetlająca produkty z aktualnymi statusami i ilościami. Pozwala na edycję inline nazwy i ilości.
- **Główne elementy:** `<table>` z wierszami zawierającymi nazwy produktów, ilość oraz status.
- **Obsługiwane interakcje:**  
  - Zmiana nazwy produktu (wywołanie `onEditProductName`).  
  - Zmiana ilości (wywołanie `onEditProductQuantity`).  
- **Obsługiwana walidacja:**  
  - Sprawdzenie, czy ilość > 0.  
- **Typy:**  
  - `ProductInListResponse` (dane wejściowe).  
  - `UpdateProductRequest` (zmiany produktu).
- **Propsy:**  
  - `products: ProductInListResponse[]` – lista produktów.  
  - `onUpdateProduct: (updatedProduct: UpdateProductRequest) => void` – wywoływane, gdy dane produktu są zmieniane.

### StatusBadge
- **Opis:** Komponent prezentujący label z aktualnym statusem produktu (np. „To buy”, „Bought”).  
- **Główne elementy:** `<span>` z odpowiednim stylem.  
- **Obsługiwane interakcje:** Brak bezpośrednich akcji (tylko odczyt).
- **Obsługiwana walidacja:** Brak.
- **Typy:**  
  - `ProductStatus` (np. Pending=1, InCart=2, Purchased=3).  
- **Propsy:**  
  - `status: string` – tekst statusu.

### InlineEdit
- **Opis:** Komponent do edycji tekstu w miejscu. Wyświetla zwykły tekst lub pole edycyjne w zależności od tego, czy trwa edycja.
- **Główne elementy:** `<span>` lub `<input>`.
- **Obsługiwane interakcje:**  
  - Kliknięcie wywołuje tryb edycji.  
  - Zatwierdzenie/wyjście z edycji wywołuje aktualizację wartości.
- **Obsługiwana walidacja:**  
  - Możliwość wprowadzenia minimalnej długości.  
- **Typy:**  
  - `string` (lub `number`, zależnie od integracji).  
- **Propsy:**  
  - `value: string | number` – wartość do wyświetlania.  
  - `onChange: (newValue: string | number) => void` – callback do zapisu.

### SaveButton
- **Opis:** Przycisk do wysłania zmian na serwer.
- **Główne elementy:** `<button>` z etykietą „Zapisz”.
- **Obsługiwane interakcje:**  
  - Kliknięcie wywołuje funkcję `onSave`.
- **Obsługiwana walidacja:** Brak wewnętrznej walidacji – rely w warstwie wyżej.
- **Typy:** Brak specyficznych.
- **Propsy:**  
  - `onSave: () => void`.

### DeleteListButton
- **Opis:** Przycisk umożliwiający usunięcie listy.  
- **Główne elementy:** `<button>` z etykietą „Usuń listę”.  
- **Obsługiwane interakcje:**  
  - Kliknięcie wywołuje `onDelete`.  
- **Obsługiwana walidacja:** Brak.  
- **Typy:** Brak specyficznych.  
- **Propsy:**  
  - `onDelete: () => void`.

## 5. Typy
- **ShoppingListDetailResponse**:  
  - `id: number`  
  - `title?: string`  
  - `storeName?: string`  
  - `plannedShoppingDate?: string`  
  - `createdAt: string`  
  - `updatedAt: string`  
  - `source: string`  
  - `products: ProductInListResponse[]`
- **UpdateShoppingListRequest**:  
  - `title?: string`  
  - `storeName?: string`  
  - `plannedShoppingDate?: string`  
  - `products?: UpdateProductRequest[]`
- **ProductInListResponse**:  
  - `id: number`  
  - `name: string`  
  - `quantity: number`  
  - `statusId: number`  
  - `status: string`  
  - `createdAt: string`
- **UpdateProductRequest**:  
  - `id?: number`  
  - `name: string`  
  - `quantity: number`

## 6. Zarządzanie stanem
- Logika stanu w `ListDetailsPage`:  
  - Przechowuje:  
    - `listData: ShoppingListDetailResponse | null` (aktualny stan listy).  
    - `isLoading: boolean` (stan ładowania).  
  - Funkcje:  
    - `fetchListDetails(id: number)` – pobiera listę przez GET.  
    - `updateListData(changes: UpdateProductRequest[])` – modyfikuje stan `listData.products`.
    - `saveChanges()` – wywołuje PUT do `/api/shoppinglists/:id`.  
    - `deleteList()` – wywołuje DELETE do `/api/shoppinglists/:id`.  

## 7. Integracja API
- **GET** `/api/shoppinglists/{id}`:  
  - Odpowiedź: `ShoppingListDetailResponse`.  
  - Używana w `fetchListDetails(id)`.
- **PUT** `/api/shoppinglists/{id}`:  
  - Body: `UpdateShoppingListRequest`.  
  - Odpowiedź: `boolean` (true przy powodzeniu).  
  - Używana w `saveChanges()`.
- **DELETE** `/api/shoppinglists/{id}`:  
  - Brak body, odpowiedź 204 No Content.  
  - Używana w `deleteList()`.

## 8. Interakcje użytkownika
1. Załadowanie strony powoduje pobranie listy przez `fetchListDetails()`.
2. Użytkownik może zmienić tytuł, sklep lub datę na polach edycyjnych i zaktualizować produkty.  
3. Użytkownik klikając „Zapisz”, wysyła PUT z nowymi danymi listy.  
4. Użytkownik może usunąć listę klikając „Usuń listę”.

## 9. Warunki i walidacja
- Tytuł listy może być pusty, choć zalecana jest wartość do 100 znaków.  
- Nazwa sklepu max. 100 znaków.  
- Ilość produktu > 0.  
- Walidacje błędów z backendu (np. 400 Bad Request) powinny być obsługiwane i wyświetlane w interfejsie (np. toast/informacja błędu).

## 10. Obsługa błędów
- **Brak uprawnień (401)**: wyświetlenie komunikatu i przekierowanie do logowania.  
- **List nie istnieje (404)**: wyświetlenie komunikatu i przekierowanie do strony 404.  
- **Błędy walidacji (400)**: prezentacja użytkownikowi szczegółowego błędu (np. toast).  
- **Inne błędy sieci**: ponowna próba lub wyświetlenie komunikatu alertu.

## 11. Kroki implementacji
1. Utworzenie pliku widoku `ListDetailsPage.tsx` w katalogu `src/pages`.
2. Zaimplementowanie w nim logiki pobrania danych (GET) i stanu lokalnego.  
3. Stworzenie komponentu `ProductTable` i komponentów podrzędnych (`InlineEdit`, `StatusBadge`).  
4. Zaimplementowanie logiki edycji (metody `onUpdateProduct`).  
5. Dodanie przycisku `SaveButton` i logiki wywołującej PUT `/api/shoppinglists/:id`.  
6. Dodanie przycisku `DeleteListButton` i logiki DELETE `/api/shoppinglists/:id`.  
7. Obsługa błędów i walidacji (np. ilość > 0).  
8. Testy manualne i ewentualne testy jednostkowe komponentów.  
9. Code review i poprawki.  
10. Wdrożenie w środowisku testowym, weryfikacja.  
11. Wdrożenie w środowisku produkcyjnym.
```