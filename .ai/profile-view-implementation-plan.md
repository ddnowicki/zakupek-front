# Plan implementacji widoku Profilu Użytkownika

## 1. Przegląd

Widok profilu użytkownika umożliwia zalogowanym użytkownikom przeglądanie oraz edycję swoich danych profilowych, takich jak nazwa użytkownika, informacje o gospodarstwie domowym (liczba osób, wiek) oraz preferencje żywieniowe. Adres e-mail jest wyświetlany, ale nie podlega edycji z poziomu tego widoku.

## 2. Routing widoku

- **Ścieżka**: `/profile`
- Widok powinien być chroniony i dostępny tylko dla zalogowanych użytkowników. Niezalogowani użytkownicy próbujący uzyskać dostęp do tej ścieżki powinni zostać przekierowani na stronę logowania.

## 3. Struktura komponentów

```
src/pages/profile.astro (Strona Astro)
  └── src/layouts/Layout.astro (Główny layout)
      └── src/components/auth/ProfileFormWrapper.tsx (Wrapper React dla logiki i stanu)
          └── src/components/auth/ProfileForm.tsx (Formularz React z polami)
              ├── components/ui/Input (dla nazwy użytkownika)
              ├── components/ui/Input (dla liczby domowników)
              ├── Dynamicznie generowane components/ui/Input (dla wieku domowników)
              ├── components/auth/DietaryCombobox.tsx (dla preferencji żywieniowych)
              └── components/ui/Button (Przycisk "Zapisz zmiany")
```

## 4. Szczegóły komponentów

### `src/pages/profile.astro`

- **Opis komponentu**: Strona Astro obsługująca ścieżkę `/profile`. Odpowiedzialna za ochronę trasy, pobranie początkowych danych profilu użytkownika po stronie serwera (jeśli to możliwe i bezpieczne) lub przygotowanie do pobrania po stronie klienta. Renderuje komponent `ProfileFormWrapper.tsx` w trybie `client:visible`.
- **Główne elementy**: Wykorzystuje `Layout.astro`. Renderuje `<ProfileFormWrapper client:visible {...props} />`.
- **Obsługiwane interakcje**: Nawigacja do strony.
- **Obsługiwana walidacja**: Sprawdzenie statusu autentykacji użytkownika (np. poprzez odczytanie tokena z `Astro.cookies`). Jeśli użytkownik nie jest zalogowany, przekierowanie do `/login`.
- **Typy**: `UserProfileResponse` (dla przekazania jako props do wrappera).
- **Propsy**: Potencjalnie `initialProfileData: UserProfileResponse | null`.

### `src/components/auth/ProfileFormWrapper.tsx`

- **Opis komponentu**: Komponent React pełniący rolę kontenera/wrappera. Zarządza stanem danych profilowych, obsługuje komunikację z API (pobieranie i aktualizacja profilu) za pomocą hooka `useUserProfile`. Przekazuje dane i funkcje do prezentacyjnego komponentu `ProfileForm`.
- **Główne elementy**: Renderuje `<ProfileForm />` oraz ewentualne komunikaty o ładowaniu lub błędach.
- **Obsługiwane interakcje**: Inicjuje pobieranie danych profilu przy montowaniu. Obsługuje akcję zapisu danych wywołaną z `ProfileForm`.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji; deleguje logikę walidacji pól do `ProfileForm` i obsługuje błędy walidacyjne zwrócone przez API.
- **Typy**: `UserProfileResponse`, `UpdateUserProfileRequest`.
- **Propsy**: `initialProfileData?: UserProfileResponse`.

### `src/components/auth/ProfileForm.tsx`

- **Opis komponentu**: Prezentacyjny komponent React renderujący formularz edycji profilu. Wykorzystuje komponenty Shadcn/ui do budowy interfejsu. Odpowiada za walidację pól formularza po stronie klienta.
- **Główne elementy**:
  - Pole `Input` (Shadcn) dla `email` (tylko do odczytu).
  - Pole `Input` (Shadcn) dla `userName`.
  - Pole `Input` typu `number` (Shadcn) dla `householdSize`.
  - Dynamicznie renderowana lista pól `Input` typu `number` (Shadcn) dla `ages`, ich liczba zależy od `householdSize`.
  - Komponent `DietaryCombobox.tsx` (istniejący) dla `dietaryPreferences`.
  - Przycisk `Button` (Shadcn) do zapisu zmian.
- **Obsługiwane interakcje**:
  - Zmiana wartości w polach formularza.
  - Dynamiczne dodawanie/usuwanie pól wieku w zależności od `householdSize`.
  - Przesłanie formularza (submit).
- **Obsługiwana walidacja** (zgodnie z `RegisterRequestValidator` dla analogicznych pól i logiką biznesową):
  - `userName`: Wymagane, niepuste, maksymalna długość (np. 100 znaków).
  - `householdSize`: Opcjonalne. Jeśli podane, musi być liczbą całkowitą >= 1. Wartość "0" lub pusta oznacza brak danych.
  - `ages`: Opcjonalne. Jeśli `householdSize` > 0, lista `ages` musi zawierać dokładnie tyle samo elementów, ile wynosi `householdSize`. Każdy wiek musi być liczbą całkowitą > 0.
  - `dietaryPreferences`: Opcjonalna lista stringów.
- **Typy**: `ProfileFormData` (lokalny stan formularza), `UpdateUserProfileRequest` (dla funkcji `onSubmit`).
- **Propsy**:
  - `initialData: Partial<UserProfileResponse>` (lub dedykowany ViewModel)
  - `onSubmit: (data: UpdateUserProfileRequest) => Promise<void>`
  - `isLoading: boolean` (do wyświetlania stanu ładowania na przycisku)
  - `apiError?: string` (do wyświetlania błędów z API)

## 5. Typy

### `UserProfileResponse` (z `src/types.ts`)

```typescript
export interface UserProfileResponse {
  id: number;
  email: string; // Wyświetlany, read-only
  userName: string;
  householdSize?: number;
  ages?: number[];
  dietaryPreferences?: string[];
  createdAt: string; // Wyświetlany, read-only
  listsCount: number; // Wyświetlany, read-only
}
```

### `UpdateUserProfileRequest` (Nowy typ, do wysłania do API)

_Założenie: Backend udostępni endpoint `PUT /api/users/profile` akceptujący ten typ._

```typescript
export interface UpdateUserProfileRequest {
  userName: string;
  householdSize?: number | null; // null jeśli użytkownik chce usunąć wartość
  ages?: number[]; // Jeśli householdSize jest ustawione i > 0, ages musi być tablicą o tej długości.
  dietaryPreferences?: string[];
}
```

### `ProfileFormData` (Lokalny typ dla stanu formularza w `ProfileForm.tsx`)

```typescript
export interface ProfileFormData {
  userName: string;
  householdSize: string; // Przechowuje wartość z inputu, parsowane do number przed wysłaniem
  ages: string[]; // Jak wyżej, parsowane do number[]
  dietaryPreferences: string[];
  // email, createdAt, listsCount są tylko do wyświetlania z UserProfileResponse
}
```

## 6. Zarządzanie stanem

Główna logika zarządzania stanem (dane profilu, stan ładowania, błędy API) będzie realizowana w `ProfileFormWrapper.tsx` przy użyciu hooka `useState` i `useEffect`.

Zalecane jest stworzenie customowego hooka `useUserProfile`:

### `src/components/hooks/useUserProfile.ts`

- **Cel**: Enkapsulacja logiki pobierania i aktualizowania profilu użytkownika.
- **Funkcjonalność**:
  - `profile: UserProfileResponse | null`: Aktualne dane profilu.
  - `isLoading: boolean`: Status ładowania (dla pobierania i aktualizacji).
  - `error: string | null`: Komunikaty błędów z API.
  - `fetchProfile: () => Promise<void>`: Funkcja do pobrania danych profilu.
  - `updateProfile: (data: UpdateUserProfileRequest) => Promise<boolean>`: Funkcja do aktualizacji profilu, zwraca `true` w przypadku sukcesu.
- **Użycie**: Hook będzie używany w `ProfileFormWrapper.tsx` do zarządzania danymi i interakcjami z API. Wykorzysta istniejący `src/lib/api.ts` do komunikacji HTTP.

## 7. Integracja API

1.  **Pobieranie profilu użytkownika**:

    - **Endpoint**: `GET /api/users/profile`
    - **Metoda**: `GET`
    - **Nagłówki**: `Authorization: Bearer {token}`
    - **Typ odpowiedzi**: `UserProfileResponse`
    - **Obsługa**: Wywoływane przy montowaniu `ProfileFormWrapper.tsx` (lub inicjalnie w `profile.astro`). Wynik zasila formularz.

2.  **Aktualizacja profilu użytkownika** (Hipotetyczny endpoint):
    - **Endpoint**: `PUT /api/users/profile`
    - **Metoda**: `PUT`
    - **Nagłówki**: `Authorization: Bearer {token}`
    - **Ciało żądania**: `UpdateUserProfileRequest`
    - **Typ odpowiedzi**: Oczekiwany kod 200 OK lub 204 No Content w przypadku sukcesu. Może zwracać zaktualizowany `UserProfileResponse` lub boolean.
    - **Obsługa**: Wywoływane po pomyślnej walidacji i przesłaniu formularza w `ProfileForm.tsx`, zarządzane przez `ProfileFormWrapper.tsx` i `useUserProfile`.

## 8. Interakcje użytkownika

- **Ładowanie widoku**:
  - Użytkownik przechodzi na `/profile`.
  - Aplikacja sprawdza autentykację. Jeśli brak, przekierowuje do `/login`.
  - Dane profilu są pobierane i wyświetlane w formularzu. Pola `email`, `createdAt`, `listsCount` są tylko do odczytu.
- **Edycja pól**:
  - `userName`: Użytkownik może edytować nazwę.
  - `householdSize`: Użytkownik może zmienić liczbę. Zmiana tej wartości dynamicznie dostosowuje liczbę pól na `ages`. Wprowadzenie 0 lub usunięcie wartości czyści pola `ages`.
  - `ages`: Użytkownik może wprowadzić wiek dla każdego domownika. Pola są dostępne tylko jeśli `householdSize` > 0.
  - `dietaryPreferences`: Użytkownik może wybrać preferencje z `DietaryCombobox`.
- **Zapis zmian**:
  - Użytkownik klika "Zapisz zmiany".
  - Formularz jest walidowany po stronie klienta.
  - Jeśli walidacja nie przejdzie, wyświetlane są błędy przy odpowiednich polach.
  - Jeśli walidacja przejdzie, wysyłane jest żądanie `PUT` do API.
  - W trakcie wysyłania, przycisk "Zapisz zmiany" pokazuje stan ładowania.
  - Po sukcesie: Wyświetlany jest komunikat o sukcesie (np. "Profil zaktualizowany!"). Formularz jest aktualizowany o nowe dane (lub dane są ponownie pobierane).
  - Po błędzie API: Wyświetlany jest komunikat o błędzie.

## 9. Warunki i walidacja

Walidacja odbywa się na poziomie komponentu `ProfileForm.tsx` przed wysłaniem danych do API. Zaleca się użycie biblioteki takiej jak Zod do definicji schematu walidacji, zintegrowanej z `react-hook-form` lub walidacją manualną.

- **`userName`**:
  - Warunek: Musi być podane.
  - Walidacja: `!isEmpty()`, `maxLength(100)`.
  - Stan interfejsu: Wyświetlenie błędu pod polem, jeśli walidacja nie przejdzie.
- **`householdSize`**:
  - Warunek: Opcjonalne. Jeśli podane, musi być liczbą.
  - Walidacja: `isInteger()`, `value >= 1` (jeśli niepuste).
  - Stan interfejsu: Wyświetlenie błędu. Zmiana liczby pól `ages`.
- **`ages`**:
  - Warunek: Wymagane i walidowane tylko jeśli `householdSize` jest podane i `householdSize > 0`.
  - Walidacja: `ages.length === householdSize`. Każdy element `ages[i]` musi być `isInteger()` i `value > 0`.
  - Stan interfejsu: Wyświetlenie błędu pod listą pól wieku lub dla konkretnego pola.
- **Ogólne dla formularza**: Przycisk "Zapisz zmiany" jest aktywny tylko jeśli formularz jest poprawny (lub walidacja jest uruchamiana przy próbie zapisu).

## 10. Obsługa błędów

- **Brak autentykacji (401 Unauthorized)**:
  - Zarówno przy `GET` jak i `PUT`.
  - Przekierowanie użytkownika na stronę `/login`. Może być obsługiwane globalnie w `api.ts` lub w `useUserProfile`.
- **Błędy walidacji z serwera (400 Bad Request)**:
  - Po żądaniu `PUT`.
  - Serwer może zwrócić szczegóły błędów. Należy je sparsować i wyświetlić użytkownikowi przy odpowiednich polach lub jako ogólny błąd formularza.
- **Inne błędy serwera (5xx, błędy sieci)**:
  - Wyświetlenie generycznego komunikatu o błędzie, np. "Wystąpił błąd. Spróbuj ponownie później."
- **Błędy walidacji po stronie klienta**:
  - Wyświetlenie komunikatów bezpośrednio przy polach formularza.
  - Zablokowanie możliwości wysłania formularza.

## 11. Kroki implementacji

1.  **Przygotowanie środowiska**:
    - Upewnij się, że istnieje mechanizm pobierania tokena JWT (np. z `Astro.cookies` lub `localStorage`).
    - Sprawdź/zaimplementuj funkcje w `src/lib/api.ts` do komunikacji z `/api/users/profile` (GET i zakładany PUT).
2.  **Stworzenie typów**:
    - Zdefiniuj `UpdateUserProfileRequest` i `ProfileFormData` w `src/types.ts` lub w pliku komponentu.
3.  **Implementacja hooka `useUserProfile`**:
    - Stwórz plik `src/components/hooks/useUserProfile.ts`.
    - Zaimplementuj logikę pobierania (`fetchProfile`) i aktualizacji (`updateProfile`) danych, zarządzanie stanem `isLoading` i `error`.
4.  **Implementacja strony `src/pages/profile.astro`**:
    - Dodaj ochronę trasy (sprawdzenie autentykacji).
    - Zintegruj `Layout.astro`.
    - Renderuj `<ProfileFormWrapper client:visible />`, przekazując ewentualne początkowe dane (jeśli pobierane po stronie serwera).
5.  **Implementacja komponentu `ProfileFormWrapper.tsx`**:
    - Użyj hooka `useUserProfile` do zarządzania danymi.
    - Przekaż potrzebne propsy (dane, funkcje, stany ładowania/błędów) do `ProfileForm`.
    - Obsłuż logikę wywołania `updateProfile` na podstawie akcji z `ProfileForm`.
6.  **Implementacja komponentu `ProfileForm.tsx`**:
    - Zbuduj strukturę formularza używając komponentów Shadcn/ui (`Input`, `Button`) oraz istniejącego `DietaryCombobox.tsx`.
    - Zaimplementuj wyświetlanie pola `email` (read-only) oraz `createdAt` i `listsCount` jeśli jest taka potrzeba.
    - Zaimplementuj logikę dynamicznego renderowania pól `ages` na podstawie wartości `householdSize`.
    - Podłącz stan formularza (np. używając `useState` lub `react-hook-form`).
    - Zaimplementuj walidację po stronie klienta (np. z użyciem Zod).
    - Obsłuż zdarzenie `onSubmit`, wywołując funkcję `onSubmit` przekazaną z propsów.
    - Wyświetlaj komunikaty o błędach walidacji oraz błędy API.
    - Stylowanie za pomocą Tailwind CSS zgodnie z wytycznymi projektu.
7.  **Testowanie**:
    - Przetestuj pobieranie danych profilu.
    - Przetestuj edycję i zapisywanie każdego pola.
    - Sprawdź działanie walidacji (po stronie klienta i serwera).
    - Przetestuj obsługę błędów (401, 400, 500).
    - Sprawdź dynamiczne pola `ages`.
    - Upewnij się, że ochrona trasy działa poprawnie.
8.  **Refaktoryzacja i poprawki**:
    - Przejrzyj kod pod kątem czystości, wydajności i zgodności z wytycznymi projektu.
    - Popraw ewentualne błędy i niedociągnięcia.
    - Upewnij się, że wszystkie elementy UX/dostępności są zaimplementowane.

_Uwaga: Plan zakłada istnienie hipotetycznego endpointu `PUT /api/users/profile` do aktualizacji danych. Należy to potwierdzić i ewentualnie dostosować implementację po stronie backendu._
