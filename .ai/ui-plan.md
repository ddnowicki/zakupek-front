# Architektura UI dla Aplikacji do generowania list zakupów

## 1. Przegląd struktury UI
Aplikacja oparta na SSR w Astro z warstwą React uruchamianą w głównym layoucie. Po zalogowaniu użytkownik wchodzi w chronioną strefę z bottom navigation (Tailwind + Shadcn/ui). OKienka treści renderowane przez React Router v6 (nested routes). Globalne Context Providers dla autoryzacji i UI oraz ToastProvider.

## 2. Lista widoków

### 2.1. Login
- Ścieżka: `/login`
- Cel: Uwierzytelnienie użytkownika
- Kluczowe informacje: pola email, hasło, przycisk „Zaloguj”
- Komponenty: `AuthForm`, `Input`, `Button`
- UX/Dostępność/Bezpieczeństwo: aria-label do pól; HTTP-only cookie; walidacja inline; focus management

### 2.2. Rejestracja
- Ścieżka: `/register`
- Cel: Utworzenie konta z profilem domowników i preferencjami
- Kluczowe informacje: pola email, hasło, nazwa użytkownika, liczba domowników, wiek, preferencje dietetyczne
- Komponenty: `AuthForm`, `Select`, `CheckboxGroup`, `DateInput`
- UX/Dostępność/Bezpieczeństwo: walidacja Yup; aria-describedby dla błędów; captcha opcjonalnie

### 2.3. Dashboard (Lista list)
- Ścieżka: `/lists`
- Cel: Przegląd wszystkich list zakupów użytkownika
- Kluczowe informacje: tytuł, data planowana, status źródła, nazwa sklepu, liczba produktów
- Komponenty: `ListCard`, `Pagination`, `SortSelect`
- UX/Dostępność/Bezpieczeństwo: klikalne karty; skeleton loader; placeholder empty state; ochrona trasy

### 2.4. Szczegóły listy i edycja
- Ścieżka: `/lists/:id`
- Cel: Wyświetlenie i edycja wybranej listy zakupów
- Kluczowe informacje: lista produktów (status, ilość), tytuł, sklep, data, przyciski edytuj/zapisz
- Komponenty: `ProductTable`, `StatusBadge`, `InlineEdit`, `SaveButton`, `DeleteListButton`
- UX/Dostępność/Bezpieczeństwo: inline validation; aria-live dla statusów; ochrona danych

### 2.5. Tworzenie listy ręcznie
- Ścieżka: `/lists/create`
- Cel: Dodanie nowej listy zakupów ręcznie
- Kluczowe informacje: tytuł, sklep, data, dynamiczny formularz produktów (nazwa, ilość)
- Komponenty: `FormList`, `ProductFormRow`, `AddRowButton`
- UX/Dostępność/Bezpieczeństwo: dynamiczne aria-labels; ograniczenia ilości; zapobieganie duplikatom

### 2.6. Generowanie listy AI
- Ścieżka: `/lists/generate`
- Cel: Wygenerowanie listy AI na podstawie danych użytkownika z opcjonalnym wyborem terminu i sklepu przed wykonaniem
- Kluczowe informacje: opcjonalne pola: data zakupów, sklep; po wygenerowaniu przerzucenie urzytkownika do `/lists/:id`
- Komponenty: `DatePicker`, `StoreSelect`, `GenerateButton`, `AIListPreview`, `AcceptButton`, `RejectButton`, `AdjustQuantityInput`
- UX/Dostępność/Bezpieczeństwo: loading spinner; informacja o sezonowości; sanitacja odpowiedzi; aria-label dla opcji daty i sklepu; pola opcjonalne

### 2.7. Profil użytkownika
- Ścieżka: `/profile`
- Cel: Wyświetlenie i edycja profilu (domownicy, preferencje)
- Kluczowe informacje: email, nazwa, householdSize, ages, dietaryPreferences
- Komponenty: `ProfileForm`, `SaveButton`
- UX/Dostępność/Bezpieczeństwo: masked pola; walidacja profilowa; ochrona trasy

### 2.8. NotFound
- Ścieżka: `*`
- Cel: Obsługa nieznanych tras
- Kluczowe informacje: komunikat, przycisk powrotu
- Komponenty: `ErrorPage`, `Button`
- UX/Dostępność/Bezpieczeństwo: aria-live dla komunikatów błędów

## 3. Mapa podróży użytkownika
1. Użytkownik niezalogowany → `/login` lub `/register`
2. Po udanym loginie → przekierowanie do `/lists`
3. Na dashboardzie wybiera listę → `/lists/:id`
4. Edytuje lub usuwa elementy lub wraca do `(create|generate)`
5. Tworzy listę ręcznie → `/lists/create`, zapisuje → powrót do `/lists`
6. Generuje listę AI → `/lists/generate`, akceptuje → przekierowanie do `/lists/:newId}`
7. Przechodzi do profilu → `/profile`
8. Wylogowanie → przekierowanie do `/login`

## 4. Układ i struktura nawigacji
- Główne menu dolne (po autoryzacji):
  • Lista (ikonka listy) → `/lists`
  • Utwórz (ikonka plus) → `/lists/create`
  • AI (ikonka żarówki) → `/lists/generate`
  • Profil (ikonka user) → `/profile`
  • Wyloguj (ikonka logout) → `/login`
- Header w widokach wewnętrznych z breadcrumb i przyciskiem powrotu
- Routers: public routes `/login`, `/register`; protected routes w `ProtectedRoute`

## 5. Kluczowe komponenty
- Layout (Context Providers + React Router Outlet)
- ProtectedRoute (sprawdzenie tokena, refresh, redirect)
- AuthForm (formularz logowania/rejestracji z RHF + Yup)
- ListCard & ProductTable (wizualizacja list)
- FormList & ProductFormRow (dynamiczne formularze produktów)
- AIListPreview (podgląd generowanej listy)
- ToastProvider & useToast (globalne powiadomienia)
- BottomNavigation (dostępne ikony + aria-label)
- ErrorPage & NotFound (obsługa błędów przeglądarki)
- Accessibility utilities (FocusTrap, SkipLink, ARIA roles)
