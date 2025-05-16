# Plan implementacji widoku logowania

## 1. Przegląd

Widok logowania pozwala użytkownikowi na uwierzytelnienie się w aplikacji poprzez wprowadzenie adresu e-mail i hasła. Po pomyślnej weryfikacji danych, użytkownik otrzymuje token JWT, który umożliwia autoryzację w kolejnych żądaniach do API. Widok jest zgodny z wymogami dostępności i bezpieczeństwa, zapewniając walidację danych wejściowych w czasie rzeczywistym oraz odpowiednie zarządzanie tokenem uwierzytelniającym.

## 2. Routing widoku

Widok logowania będzie dostępny pod ścieżką `/login` w aplikacji Astro.

## 3. Struktura komponentów

```
LoginPage (Astro)
├── LoginForm (React)
│   ├── EmailInput (Shadcn/ui)
│   ├── PasswordInput (Shadcn/ui)
│   ├── FormErrors (React)
│   └── SubmitButton (Shadcn/ui)
└── RegistrationLink (Astro)
```

## 4. Szczegóły komponentów

### LoginPage (Astro)

- Opis komponentu: Główny komponent strony logowania, który renderuje układ strony i zawiera formularz logowania
- Główne elementy: Layout, LoginForm, RegistrationLink
- Obsługiwane interakcje: Brak (komponent statyczny)
- Obsługiwana walidacja: Brak (przekazana do LoginForm)
- Typy: Brak specyficznych typów
- Propsy: Brak

### LoginForm (React)

- Opis komponentu: Interaktywny formularz do wprowadzania danych logowania, zawierający pola email i hasło oraz przycisk submit
- Główne elementy: Form, EmailInput, PasswordInput, FormErrors, SubmitButton
- Obsługiwane interakcje:
  - Zmiana wartości pól formularza
  - Przesłanie formularza (submit)
  - Obsługa błędów walidacji i odpowiedzi API
- Obsługiwana walidacja:
  - Email: niepusty, poprawny format adresu e-mail
  - Hasło: niepuste
  - Błędy z API: niewłaściwe poświadczenia, nieznany użytkownik
- Typy:
  - LoginFormData
  - LoginFormErrors
- Propsy:
  - onSuccess?: (authResponse: AuthResponse) => void

### EmailInput (Shadcn/ui)

- Opis komponentu: Pole formularza do wprowadzania adresu e-mail
- Główne elementy: Input, Label, ErrorMessage
- Obsługiwane interakcje: Zmiana wartości pola, focus, blur
- Obsługiwana walidacja: Niepusty, poprawny format adresu e-mail
- Typy: Standardowe typy dla input
- Propsy:
  - value: string
  - onChange: (e: ChangeEvent<HTMLInputElement>) => void
  - error?: string
  - disabled?: boolean

### PasswordInput (Shadcn/ui)

- Opis komponentu: Pole formularza do wprowadzania hasła z opcją pokazania/ukrycia znaków
- Główne elementy: Input, Label, ErrorMessage, ToggleVisibilityButton
- Obsługiwane interakcje: Zmiana wartości pola, focus, blur, przełączanie widoczności hasła
- Obsługiwana walidacja: Niepuste
- Typy: Standardowe typy dla input
- Propsy:
  - value: string
  - onChange: (e: ChangeEvent<HTMLInputElement>) => void
  - error?: string
  - disabled?: boolean

### FormErrors (React)

- Opis komponentu: Komponent do wyświetlania błędów formularza
- Główne elementy: Lista błędów
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: FormErrors
- Propsy:
  - errors: string[]

### SubmitButton (Shadcn/ui)

- Opis komponentu: Przycisk do wysyłania formularza z obsługą stanu ładowania
- Główne elementy: Button, LoadingIndicator
- Obsługiwane interakcje: Kliknięcie
- Obsługiwana walidacja: Brak
- Typy: Standardowe typy dla button
- Propsy:
  - isLoading?: boolean
  - disabled?: boolean
  - text: string

### RegistrationLink (Astro)

- Opis komponentu: Link przekierowujący do strony rejestracji
- Główne elementy: Link
- Obsługiwane interakcje: Kliknięcie
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych typów
- Propsy: Brak

## 5. Typy

```typescript
// LoginFormData - dane formularza logowania
interface LoginFormData {
  email: string;
  password: string;
}

// LoginFormErrors - błędy formularza logowania
interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string; // ogólne błędy formularza, np. z API
}

// LoginFormState - stan formularza logowania
type LoginFormState = {
  isLoading: boolean;
  data: LoginFormData;
  errors: LoginFormErrors;
  isSubmitted: boolean;
};

// Typy z istniejącego pliku types.ts
// LoginRequest - dane wysyłane do API
// AuthResponse - odpowiedź z API po udanym logowaniu
```

## 6. Zarządzanie stanem

Zarządzanie stanem będzie realizowane za pomocą hooka `useLoginForm`:

```typescript
function useLoginForm(onSuccess?: (authResponse: AuthResponse) => void) {
  const [state, setState] = useState<LoginFormState>({
    isLoading: false,
    data: { email: "", password: "" },
    errors: {},
    isSubmitted: false,
  });

  const authService = new AuthService(new ApiClient());

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  const validateForm = (): boolean => {
    const errors: LoginFormErrors = {};
    let isValid = true;

    // Walidacja email
    if (!state.data.email) {
      errors.email = "Email jest wymagany";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.data.email)) {
      errors.email = "Nieprawidłowy format adresu e-mail";
      isValid = false;
    }

    // Walidacja hasła
    if (!state.data.password) {
      errors.password = "Hasło jest wymagane";
      isValid = false;
    }

    setState((prev) => ({ ...prev, errors }));
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitted: true }));

    if (!validateForm()) return;

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login(state.data);
      if (onSuccess) onSuccess(response);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          form: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas logowania",
        },
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleInputChange,
    handleSubmit,
  };
}
```

## 7. Integracja API

Integracja z API będzie realizowana za pomocą istniejących klas `ApiClient` i `AuthService`:

1. Użytkownik wypełnia formularz i klika przycisk "Zaloguj"
2. Dane formularza są walidowane po stronie klienta
3. Jeśli walidacja jest poprawna, dane są przesyłane do API
4. Wywołana zostanie metoda `authService.login(loginData)`, która wywołuje odpowiednie endpoint API
5. API zwraca odpowiedź zawierającą token JWT lub informację o błędzie
6. W przypadku sukcesu, token JWT jest zapisywany i użytkownik jest przekierowywany na stronę główną
7. W przypadku błędu, odpowiednia informacja jest wyświetlana użytkownikowi

## 8. Interakcje użytkownika

1. **Wprowadzanie danych** - użytkownik wprowadza adres e-mail i hasło

   - Podczas wprowadzania, formularz może pokazywać błędy walidacji w czasie rzeczywistym
   - Pola otrzymują focus i blur zgodnie ze standardami dostępności

2. **Przełączanie widoczności hasła** - użytkownik może przełączyć widoczność hasła

   - Kliknięcie na ikonę "oka" obok pola hasła przełącza między wyświetlaniem gwiazdek a czystym tekstem

3. **Przesłanie formularza** - użytkownik klika przycisk "Zaloguj"

   - Przycisk zmienia wygląd na "ładowanie" podczas przetwarzania żądania
   - Pola formularza są dezaktywowane podczas ładowania

4. **Przekierowanie na stronę rejestracji** - użytkownik klika link "Zarejestruj się"
   - Użytkownik zostaje przekierowany na stronę rejestracji

## 9. Warunki i walidacja

### Walidacja pól formularza

- **Email**:

  - Jest wymagany
  - Musi być poprawnym adresem e-mail
  - Walidacja odbywa się przy utracie fokusu (blur) oraz przy przesłaniu formularza
  - Komunikaty błędów są wyświetlane pod polem

- **Hasło**:
  - Jest wymagane
  - Walidacja odbywa się przy utracie fokusu (blur) oraz przy przesłaniu formularza
  - Komunikaty błędów są wyświetlane pod polem

### Walidacja formularza

- Formularz nie może zostać przesłany, jeśli jakiekolwiek pole zawiera błędy
- Podczas ładowania wszystkie pola formularza i przycisk są dezaktywowane

## 10. Obsługa błędów

### Błędy walidacji formularza

- Błędy walidacji są wyświetlane pod odpowiednimi polami
- Ogólne błędy formularza są wyświetlane na górze formularza

### Błędy API

- Jeśli API zwróci status 401, wyświetlany jest komunikat "Nieprawidłowy email lub hasło"
- Jeśli API zwróci status 400, wyświetlany jest komunikat z odpowiedzi API
- W przypadku innych błędów (np. problemy z siecią), wyświetlany jest ogólny komunikat o błędzie

### Obsługa przypadków brzegowych

- Wielokrotne próby logowania są obsługiwane poprzez dezaktywację przycisku podczas ładowania
- W przypadku utraty połączenia podczas przesyłania formularza, wyświetlany jest komunikat o problemach z siecią
- W przypadku wygaśnięcia sesji, użytkownik jest przekierowywany na stronę logowania z odpowiednim komunikatem

## 11. Kroki implementacji

1. Utworzenie pliku strony `/src/pages/login.astro` i skonfigurowanie routingu
2. Implementacja komponentu `LoginPage` z podstawowym układem strony
3. Utworzenie pliku `/src/components/auth/LoginForm.tsx` dla komponentu formularza logowania
4. Implementacja hooka `useLoginForm` do zarządzania stanem formularza
5. Implementacja komponentów `EmailInput` i `PasswordInput` z wykorzystaniem Shadcn/ui
6. Implementacja komponentu `FormErrors` do wyświetlania błędów
7. Implementacja komponentu `SubmitButton` z obsługą stanu ładowania
8. Implementacja komponentu `RegistrationLink` do przekierowania na stronę rejestracji
9. Integracja formularza z serwisem `AuthService` i API
10. Implementacja walidacji formularza
11. Implementacja obsługi błędów API
12. Testowanie formularza pod kątem poprawności działania, dostępności i UX
13. Optymalizacja i finalizacja implementacji
