# Plan implementacji widoku rejestracji

## 1. Przegląd
Widok rejestracji umożliwia nowym użytkownikom utworzenie konta w aplikacji. Proces rejestracji obejmuje podanie podstawowych danych uwierzytelniających (e-mail, hasło, nazwa użytkownika) oraz opcjonalnych informacji profilowych dotyczących gospodarstwa domowego (liczba domowników, ich wiek) i preferencji żywieniowych. Po pomyślnej rejestracji użytkownik otrzymuje token JWT, który jest wykorzystywany do autoryzacji w aplikacji, oraz zostaje przekierowany na stronę główną lub logowania.

## 2. Routing widoku
Widok rejestracji będzie dostępny pod ścieżką `/register` w aplikacji Astro.

## 3. Struktura komponentów
```
RegisterPage.astro (strona Astro)
└── Layout.astro (układ strony)
    ├── RegisterForm.tsx (komponent React)
    │   ├── EmailInput (Shadcn/ui Input)
    │   ├── PasswordInput (Shadcn/ui Input)
    │   ├── ConfirmPasswordInput (Shadcn/ui Input)
    │   ├── UserNameInput (Shadcn/ui Input)
    │   ├── HouseholdSizeSelect (Shadcn/ui Select)
    │   ├── AgesInputGroup (dynamiczna grupa Shadcn/ui Input)
    │   ├── DietaryPreferencesCheckboxGroup (dynamiczna grupa Shadcn/ui Checkbox)
    │   ├── FormErrors.tsx (komponent React, reużywany)
    │   └── SubmitButton (Shadcn/ui Button, reużywany)
    └── LoginLink.astro (komponent Astro, link do /login)
```

## 4. Szczegóły komponentów

### RegisterPage.astro
- Opis komponentu: Główny komponent strony rejestracji, renderujący układ (`Layout.astro`) i osadzający interaktywny formularz `RegisterForm.tsx`. Zawiera również link do strony logowania.
- Główne elementy: `<Layout>`, `<RegisterForm client:load />`, `<LoginLink />`.
- Obsługiwane interakcje: Nawigacja do strony logowania.
- Obsługiwana walidacja: Brak (przekazana do `RegisterForm`).
- Typy: Brak specyficznych typów.
- Propsy: Brak.

### RegisterForm.tsx
- Opis komponentu: Interaktywny formularz React służący do zbierania danych rejestracyjnych użytkownika. Zarządza stanem formularza, walidacją danych wejściowych oraz komunikacją z API w celu utworzenia nowego konta.
- Główne elementy: `<form>`, `EmailInput`, `PasswordInput`, `ConfirmPasswordInput`, `UserNameInput`, `HouseholdSizeSelect`, `AgesInputGroup`, `DietaryPreferencesCheckboxGroup`, `FormErrors`, `SubmitButton`.
- Obsługiwane interakcje:
    - Wprowadzanie danych w polach formularza.
    - Dynamiczne dostosowywanie liczby pól wieku na podstawie wybranej liczby domowników.
    - Przesłanie formularza (submit).
    - Wyświetlanie błędów walidacji i odpowiedzi API.
- Obsługiwana walidacja: Szczegółowa walidacja wszystkich pól (patrz sekcja 9).
- Typy: `RegisterFormData`, `RegisterFormErrors`, `RegisterFormState`.
- Propsy:
    - `onSuccess?: (authResponse: AuthResponse) => void` (opcjonalny callback po pomyślnej rejestracji, np. do przekierowania).

### EmailInput
- Opis komponentu: Pole formularza (oparte na Shadcn/ui `Input`) do wprowadzania adresu e-mail.
- Główne elementy: `Input` z `type="email"`, `Label`, komunikat błędu.
- Obsługiwane interakcje: Wprowadzanie tekstu, `onChange`, `onBlur`.
- Obsługiwana walidacja: Wymagane, poprawny format adresu e-mail.
- Typy: Standardowe dla `HTMLInputElement`.
- Propsy: `value`, `onChange`, `onBlur`, `error?`, `disabled?`, `name="email"`.

### PasswordInput
- Opis komponentu: Pole formularza (oparte na Shadcn/ui `Input`) do wprowadzania hasła, z opcją pokazania/ukrycia znaków.
- Główne elementy: `Input` z `type="password"`/`type="text"`, `Label`, przycisk do przełączania widoczności, komunikat błędu.
- Obsługiwane interakcje: Wprowadzanie tekstu, `onChange`, `onBlur`, kliknięcie przycisku widoczności.
- Obsługiwana walidacja: Wymagane, minimalna długość (np. 8 znaków), może zawierać dodatkowe kryteria siły hasła.
- Typy: Standardowe dla `HTMLInputElement`.
- Propsy: `value`, `onChange`, `onBlur`, `error?`, `disabled?`, `name="password"`.

### ConfirmPasswordInput
- Opis komponentu: Pole formularza (oparte na Shadcn/ui `Input`) do potwierdzenia hasła.
- Główne elementy: `Input` z `type="password"`/`type="text"`, `Label`, przycisk do przełączania widoczności, komunikat błędu.
- Obsługiwane interakcje: Wprowadzanie tekstu, `onChange`, `onBlur`.
- Obsługiwana walidacja: Wymagane, musi być identyczne z wartością pola `PasswordInput`.
- Typy: Standardowe dla `HTMLInputElement`.
- Propsy: `value`, `onChange`, `onBlur`, `error?`, `disabled?`, `name="confirmPassword"`.

### UserNameInput
- Opis komponentu: Pole formularza (oparte na Shadcn/ui `Input`) do wprowadzania nazwy użytkownika.
- Główne elementy: `Input` z `type="text"`, `Label`, komunikat błędu.
- Obsługiwane interakcje: Wprowadzanie tekstu, `onChange`, `onBlur`.
- Obsługiwana walidacja: Wymagane, niepuste.
- Typy: Standardowe dla `HTMLInputElement`.
- Propsy: `value`, `onChange`, `onBlur`, `error?`, `disabled?`, `name="userName"`.

### HouseholdSizeSelect
- Opis komponentu: Pole wyboru (oparte na Shadcn/ui `Select`) do określenia liczby osób w gospodarstwie domowym.
- Główne elementy: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `Label`, komunikat błędu.
- Obsługiwane interakcje: Wybór wartości, `onValueChange`.
- Obsługiwana walidacja: Opcjonalne. Jeśli wybrane, musi być liczbą całkowitą >= 0.
- Typy: Wartość jako `string`, konwertowana na `number`.
- Propsy: `value` (string), `onValueChange` ((value: string) => void), `options` (np. `{ value: string, label: string }[]`), `error?`, `disabled?`.

### AgesInputGroup
- Opis komponentu: Dynamicznie generowana grupa pól (opartych na Shadcn/ui `Input type="number"`) do wprowadzenia wieku każdego domownika. Liczba pól zależy od wartości wybranej w `HouseholdSizeSelect`.
- Główne elementy: Wiele komponentów `Input type="number"`, `Label` dla grupy, komunikaty błędów dla poszczególnych pól.
- Obsługiwane interakcje: Wprowadzanie liczb, `onChange`, `onBlur` dla każdego pola.
- Obsługiwana walidacja: Opcjonalne. Jeśli `householdSize` > 0, każde pole wieku musi być wypełnione poprawną, dodatnią liczbą całkowitą.
- Typy: Wartości jako `(number | string)[]` w stanie formularza, konwertowane na `number[]` dla API.
- Propsy: `ages` (array), `householdSize` (number), `onAgeChange` ((index: number, value: string) => void), `errors?` (array of strings), `disabled?`.

### DietaryPreferencesCheckboxGroup
- Opis komponentu: Grupa pól wyboru (opartych na Shadcn/ui `Checkbox`) umożliwiająca użytkownikowi wskazanie swoich preferencji żywieniowych.
- Główne elementy: Wiele komponentów `Checkbox` z `Label`, `Label` dla grupy.
- Obsługiwane interakcje: Zaznaczanie/odznaczanie checkboxów, `onCheckedChange` dla każdego checkboxa.
- Obsługiwana walidacja: Opcjonalne.
- Typy: Wartości jako `string[]`.
- Propsy: `selectedPreferences` (string[]), `options` (`{ id: string, label: string }[]`), `onPreferenceChange` ((preferenceId: string, checked: boolean) => void), `disabled?`.

### FormErrors.tsx (reużywany)
- Opis komponentu: Wyświetla listę ogólnych błędów formularza (np. błędy API).
- Główne elementy: Lista (`ul`/`div`) komunikatów błędów.
- Typy: `string[]`.
- Propsy: `errors: string[]`.

### SubmitButton (Shadcn/ui Button, reużywany)
- Opis komponentu: Przycisk (Shadcn/ui `Button`) do wysłania formularza, obsługujący stan ładowania.
- Główne elementy: `Button`, wskaźnik ładowania.
- Obsługiwane interakcje: Kliknięcie.
- Typy: Standardowe dla `HTMLButtonElement`.
- Propsy: `isLoading?: boolean`, `disabled?: boolean`, `text: string` (np. "Zarejestruj się").

### LoginLink.astro
- Opis komponentu: Prosty link (Astro) przekierowujący użytkownika na stronę logowania (`/login`).
- Główne elementy: `<a>`.
- Obsługiwane interakcje: Kliknięcie.
- Typy: Brak.
- Propsy: Brak.

## 5. Typy

### Typy DTO (z `src/types.ts`)
- `RegisterRequest`:
  ```typescript
  interface RegisterRequest {
    email: string;
    password: string;
    userName: string;
    householdSize?: number;
    ages?: number[];
    dietaryPreferences?: string[];
  }
  ```
- `AuthResponse`:
  ```typescript
  interface AuthResponse {
    userId: number;
    userName: string;
    accessToken: string;
    expiresAt: string;
  }
  ```

### Typy ViewModel (dla stanu formularza i błędów)
- `RegisterFormData`:
  ```typescript
  interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword?: string; // Dla walidacji po stronie klienta
    userName: string;
    householdSize: string; // Przechowuje string z Select, konwertowany na number
    ages: (string | number)[]; // Przechowuje stringi/liczby z Input, konwertowane na number[]
    dietaryPreferences: string[];
  }
  ```
- `RegisterFormErrors`:
  ```typescript
  interface RegisterFormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userName?: string;
    householdSize?: string;
    ages?: (string | undefined)[]; // Błędy dla poszczególnych pól wieku
    dietaryPreferences?: string; // Ogólny błąd dla grupy, jeśli potrzebny
    form?: string; // Ogólne błędy formularza (np. z API)
  }
  ```
- `RegisterFormState`:
  ```typescript
  type RegisterFormState = {
    isLoading: boolean;
    data: RegisterFormData;
    errors: RegisterFormErrors;
    isSubmitted: boolean;
  };
  ```
- `DietaryPreferenceOption`:
  ```typescript
  interface DietaryPreferenceOption {
    id: string; // Wartość wysyłana do API, np. "vegetarian"
    label: string; // Etykieta wyświetlana użytkownikowi, np. "Wegetariańskie"
  }
  // Przykładowa lista opcji:
  // const DIETARY_PREFERENCES_OPTIONS: DietaryPreferenceOption[] = [
  //   { id: "vegetarian", label: "Wegetariańskie" },
  //   { id: "vegan", label: "Wegańskie" },
  //   { id: "gluten-free", label: "Bezglutenowe" },
  // ];
  ```
- `HouseholdSizeOption`:
  ```typescript
  interface HouseholdSizeOption {
    value: string; // Wartość dla komponentu Select
    label: string; // Etykieta wyświetlana użytkownikowi
  }
  // Przykładowa lista opcji (np. dla 0-10 osób):
  // const HOUSEHOLD_SIZE_OPTIONS: HouseholdSizeOption[] = 
  //   Array.from({ length: 11 }, (_, i) => ({ value: i.toString(), label: i.toString() }));
  ```

## 6. Zarządzanie stanem
Zarządzanie stanem formularza `RegisterForm` będzie realizowane za pomocą niestandardowego hooka React `useRegisterForm`.

### Hook `useRegisterForm`
- **Cel**: Hermetyzacja logiki formularza rejestracji, w tym:
    - Przechowywanie stanu danych formularza (`data`), błędów (`errors`), statusu ładowania (`isLoading`) i faktu przesłania formularza (`isSubmitted`).
    - Obsługa zmian wartości w polach formularza (`handleInputChange`, `handleHouseholdSizeChange`, `handleAgeChange`, `handleDietaryPreferenceChange`).
    - Walidacja danych formularza po stronie klienta (`validateForm`).
    - Komunikacja z `AuthService` w celu wysłania żądania rejestracji (`handleSubmit`).
    - Obsługa odpowiedzi API (sukces, błędy).
- **Struktura (uproszczona)**:
  ```typescript
  function useRegisterForm(onSuccess?: (authResponse: AuthResponse) => void) {
    const [state, setState] = useState<RegisterFormState>({ /* ...stan początkowy... */ });
    const authService = new AuthService(new ApiClient()); // Instancja serwisu autoryzacji

    // Funkcje do obsługi zmian w polach
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { /* ...aktualizacja stanu... */ };
    const handleSelectChange = (name: string, value: string) => { /* ...aktualizacja stanu dla selectów... */ };
    const handleHouseholdSizeChange = (value: string) => {
        const size = parseInt(value, 10);
        const newAges = Array(isNaN(size) || size < 0 ? 0 : size).fill('');
        setState(prev => ({ ...prev, data: { ...prev.data, householdSize: value, ages: newAges }}));
    };
    const handleAgeChange = (index: number, value: string) => { /* ...aktualizacja stanu dla wieku... */ };
    const handleDietaryPreferenceChange = (preferenceId: string, checked: boolean) => { /* ...aktualizacja stanu dla preferencji... */ };

    // Funkcja walidująca formularz
    const validateForm = (): boolean => { /* ...logika walidacji... */ return isValid; };

    // Funkcja do przesyłania formularza
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setState(prev => ({ ...prev, isSubmitted: true }));
      if (!validateForm()) return;

      setState(prev => ({ ...prev, isLoading: true, errors: { ...prev.errors, form: undefined } }));
      
      // Przygotowanie danych do wysłania (konwersja typów, usunięcie zbędnych pól)
      const requestData: RegisterRequest = {
        email: state.data.email,
        password: state.data.password,
        userName: state.data.userName,
        // Opcjonalne pola:
        ...(state.data.householdSize && !isNaN(parseInt(state.data.householdSize)) && { householdSize: parseInt(state.data.householdSize) }),
        ...(state.data.ages.length > 0 && { ages: state.data.ages.map(age => parseInt(String(age))).filter(age => !isNaN(age) && age > 0) }),
        ...(state.data.dietaryPreferences.length > 0 && { dietaryPreferences: state.data.dietaryPreferences }),
      };
      if (requestData.ages && requestData.ages.length === 0) delete requestData.ages;


      try {
        const response = await authService.register(requestData);
        if (onSuccess) onSuccess(response);
      } catch (error: any) {
        // Obsługa błędów API (np. wyświetlenie komunikatu)
        const errorMessage = error?.response?.data?.message || error.message || "Wystąpił nieznany błąd.";
        setState(prev => ({ ...prev, errors: { ...prev.errors, form: errorMessage } }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    return { state, handleInputChange, handleSelectChange, handleHouseholdSizeChange, handleAgeChange, handleDietaryPreferenceChange, handleSubmit };
  }
  ```

## 7. Integracja API
Integracja z backendem będzie realizowana poprzez wywołanie metody `register` z instancji `AuthService` (która korzysta z `ApiClient`).

- **Endpoint**: `POST /api/auth/register`
- **Żądanie (`RegisterRequest`)**: Obiekt zawierający `email`, `password`, `userName` oraz opcjonalnie `householdSize`, `ages`, `dietaryPreferences`. Dane te są zbierane z formularza i odpowiednio transformowane (np. konwersja stringów na liczby) w hooku `useRegisterForm` przed wysłaniem.
- **Odpowiedź (`AuthResponse`)**: W przypadku sukcesu (status 201), API zwraca obiekt zawierający `userId`, `userName`, `accessToken` i `expiresAt`. Token JWT jest automatycznie zapisywany w `localStorage` przez `AuthService`.
- **Obsługa w `useRegisterForm`**:
    - Przed wysłaniem: Ustawienie `isLoading` na `true`, dezaktywacja przycisku submit.
    - Po otrzymaniu odpowiedzi:
        - Sukces: Wywołanie callbacku `onSuccess` (np. w celu przekierowania użytkownika na stronę główną lub logowania z komunikatem o sukcesie).
        - Błąd: Ustawienie komunikatu błędu w `state.errors.form` na podstawie odpowiedzi API lub błędu sieciowego.
    - Zawsze: Ustawienie `isLoading` na `false`.

## 8. Interakcje użytkownika
1.  **Wypełnianie formularza**: Użytkownik wprowadza dane w poszczególne pola.
    - Zmiany są odzwierciedlane w stanie hooka `useRegisterForm`.
    - Walidacja `onBlur` lub `onChange` może być zaimplementowana dla natychmiastowego feedbacku (opcjonalnie, główna walidacja przy submit).
2.  **Zmiana liczby domowników**: Wybór wartości w `HouseholdSizeSelect`.
    - Dynamicznie aktualizuje liczbę pól `Input` w `AgesInputGroup`. Pola wieku są resetowane.
3.  **Przełączanie widoczności hasła**: Kliknięcie ikony przy polach hasła.
    - Zmienia typ inputu z `password` na `text` i odwrotnie.
4.  **Przesłanie formularza**: Kliknięcie przycisku "Zarejestruj się".
    - Uruchamia walidację formularza.
    - Jeśli są błędy, są one wyświetlane, a formularz nie jest wysyłany.
    - Jeśli dane są poprawne, przycisk przechodzi w stan ładowania, a żądanie jest wysyłane do API.
    - Po odpowiedzi API, użytkownik widzi komunikat o sukcesie/błędzie lub jest przekierowywany.
5.  **Nawigacja do logowania**: Kliknięcie linku "Masz już konto? Zaloguj się".
    - Przekierowuje użytkownika na stronę `/login`.

## 9. Warunki i walidacja
Walidacja będzie przeprowadzana w hooku `useRegisterForm` w funkcji `validateForm()`, wywoływanej przed wysłaniem formularza.

- **Email (`data.email`)**:
    - Wymagane: "Adres e-mail jest wymagany."
    - Format: "Nieprawidłowy format adresu e-mail." (np. regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- **Hasło (`data.password`)**:
    - Wymagane: "Hasło jest wymagane."
    - Minimalna długość (np. 8 znaków): "Hasło musi mieć co najmniej 8 znaków."
    - (Opcjonalnie) Złożoność: np. "Hasło musi zawierać wielką literę, małą literę i cyfrę."
- **Potwierdzenie hasła (`data.confirmPassword`)**:
    - Wymagane: "Potwierdzenie hasła jest wymagane."
    - Zgodność z hasłem: "Hasła nie są zgodne." (jeśli `data.password !== data.confirmPassword`)
- **Nazwa użytkownika (`data.userName`)**:
    - Wymagane: "Nazwa użytkownika jest wymagana."
- **Liczba domowników (`data.householdSize`)**:
    - Format: Jeśli podane, musi być liczbą całkowitą >= 0. "Nieprawidłowa liczba domowników."
- **Wiek domowników (`data.ages`)**:
    - Jeśli `householdSize` > 0, każde pole wieku musi być wypełnione. "Wiek domownika jest wymagany."
    - Format: Każdy wiek musi być liczbą całkowitą > 0. "Nieprawidłowy wiek." (błędy przypisywane do `errors.ages[index]`)
- **Preferencje żywieniowe (`data.dietaryPreferences`)**:
    - Brak specyficznej walidacji poza poprawnym formatem danych (tablica stringów).

Błędy walidacji są ustawiane w `state.errors` i wyświetlane przy odpowiednich polach lub w komponencie `FormErrors`.

## 10. Obsługa błędów
- **Błędy walidacji klienta**: Wyświetlane bezpośrednio przy polach formularza lub jako ogólna lista, jeśli dotyczą całego formularza. Formularz nie jest wysyłany, dopóki błędy nie zostaną poprawione.
- **Błędy API**:
    - **400 Bad Request**: Zazwyczaj błędy walidacji po stronie serwera (np. nieprawidłowy format danych, brakujące pola). Komunikat błędu z odpowiedzi API powinien być wyświetlony w `FormErrors`.
    - **409 Conflict (Email already exists)**: Specyficzny błąd informujący, że podany adres e-mail jest już zarejestrowany. Wyświetlany w `FormErrors` lub pod polem e-mail: "Ten adres e-mail jest już zajęty."
    - **Inne błędy serwera (5xx)** lub problemy sieciowe: Wyświetlany jest ogólny komunikat w `FormErrors`, np.: "Wystąpił błąd serwera. Spróbuj ponownie później." lub "Brak połączenia z internetem."
- **Stan ładowania**: Podczas komunikacji z API, przycisk "Zarejestruj się" jest nieaktywny i wyświetla wskaźnik ładowania, aby zapobiec wielokrotnemu wysyłaniu formularza.

## 11. Kroki implementacji
1.  **Utworzenie plików**:
    - Strona Astro: `src/pages/register.astro`.
    - Komponent formularza React: `src/components/auth/RegisterForm.tsx`.
    - Hook React: `src/components/hooks/useRegisterForm.ts`.
    - (Opcjonalnie) Komponent Astro dla linku: `src/components/auth/LoginLink.astro`.
2.  **Implementacja `RegisterPage.astro`**:
    - Dodanie podstawowego układu (`Layout.astro`).
    - Osadzenie komponentu `<RegisterForm client:load />`.
    - Dodanie linku do strony logowania (np. `<LoginLink />` lub bezpośrednio `<a>`).
3.  **Zdefiniowanie stałych**:
    - `DIETARY_PREFERENCES_OPTIONS` (lista obiektów `DietaryPreferenceOption`).
    - `HOUSEHOLD_SIZE_OPTIONS` (lista obiektów `HouseholdSizeOption`).
4.  **Implementacja hooka `useRegisterForm.ts`**:
    - Zdefiniowanie typów `RegisterFormData`, `RegisterFormErrors`, `RegisterFormState`.
    - Inicjalizacja stanu.
    - Implementacja funkcji obsługi zmian w polach (`handleInputChange`, `handleSelectChange`, `handleHouseholdSizeChange`, `handleAgeChange`, `handleDietaryPreferenceChange`).
    - Implementacja funkcji walidującej `validateForm()`.
    - Implementacja funkcji `handleSubmit()` z logiką wysyłania danych do `AuthService`, transformacją danych do `RegisterRequest` i obsługą odpowiedzi/błędów.
5.  **Implementacja komponentu `RegisterForm.tsx`**:
    - Użycie hooka `useRegisterForm`.
    - Zbudowanie struktury formularza przy użyciu komponentów Shadcn/ui (`Input`, `Select`, `Checkbox`, `Button`) oraz reużywanego `FormErrors`.
    - Powiązanie wartości pól, obsługi zdarzeń i błędów ze stanem i funkcjami z hooka.
    - Implementacja dynamicznego renderowania `AgesInputGroup` na podstawie `state.data.householdSize`.
    - Implementacja `DietaryPreferencesCheckboxGroup` na podstawie `DIETARY_PREFERENCES_OPTIONS`.
    - Wywołanie `handleSubmit` przy wysyłaniu formularza.
    - Przekazanie `onSuccess` callback (np. `() => { window.location.href = '/'; }` lub do strony logowania).
6.  **Styling**: Dostosowanie stylów Tailwind CSS w razie potrzeby, aby zapewnić spójny wygląd z resztą aplikacji.
7.  **Dostępność (ARIA)**: Zapewnienie, że wszystkie pola formularza są poprawnie etykietowane i że błędy są powiązane z odpowiednimi polami za pomocą `aria-describedby`.
8.  **Testowanie**:
    - Testowanie walidacji dla wszystkich pól.
    - Testowanie poprawnego wysyłania danych i tworzenia użytkownika.
    - Testowanie obsługi błędów API (np. zajęty e-mail, błędy serwera).
    - Testowanie dynamicznego działania `AgesInputGroup`.
    - Testowanie responsywności i dostępności.
9.  **Refaktoryzacja i optymalizacja**: Przegląd kodu, poprawa czytelności, wydajności.
10. **Integracja z `AuthService`**: Upewnienie się, że `AuthService` jest poprawnie używany i token jest zarządzany zgodnie z oczekiwaniami.

