Frontend:

- Astro 5 pozwala na tworzenie szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 zapewnia interaktywność tam, gdzie jest potrzebna
- TypeScript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- Tailwind 4 pozwala na wygodne stylowanie aplikacji
- Shadcn/ui zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI

Testy:

- Testy jednostkowe:

  - Vitest jako szybki i kompatybilny z Vite framework do testów jednostkowych
  - Testing Library dla testowania komponentów React w sposób skupiający się na UI
  - MSW (Mock Service Worker) do mockowania API w testach
  - Happy-DOM lub jsdom jako środowisko uruchomieniowe dla testów

- Testy e2e:
  - Playwright dla kompleksowych testów end-to-end z obsługą wielu przeglądarek
  - Możliwość nagrywania testów i generowania kodu
  - Testy wizualne i porównywanie migawek interfejsu
  - Możliwość równoległego uruchamiania testów

Backend:

- .NET 8
  - Najnowsza wersja frameworka z wysoką wydajnością
  - Wsparcie dla aplikacji wieloplatformowych
  - Długoterminowe wsparcie (LTS) zapewniające stabilność
- ASP.NET Core
  - Lekki i modułowy framework do budowy REST API
  - Wbudowane mechanizmy bezpieczeństwa i autoryzacji
  - Zaawansowane możliwości routingu i obsługi żądań
- Entity Framework Core
  - ORM dla łatwego mapowania obiektowo-relacyjnego
  - Wsparcie dla Code-First i migracji bazy danych
  - Optymalizacja wydajności zapytań do bazy danych
- FastEndpoints
  - Lekka alternatywa dla ASP.NET Core endpoints redukująca ilość kodu szablonowego
- Scrutor
  - Skanowanie i dekorowanie assembly dla Microsoft DI w celu uproszczenia rejestracji usług
- FluentValidation
  - Biblioteka walidacji w stylu fluent dla wyrażeniowej i łatwej w utrzymaniu walidacji modeli
- ErrorOr
  - Ujednolicone zarządzanie błędami i typ wynikowy dla funkcjonalnego zarządzania błędami

Komunikacja z modelami AI:

- Openrouter.ai
  - Jednolity dostęp do wielu modeli AI
  - Elastyczne API upraszczające integrację
  - Optymalizacja kosztów przez wybór odpowiednich modeli

CI/CD i Hosting:

- Github actions
  - Automatyzacja procesów CI/CD
  - Integracja z repozytorium kodu
  - Konfigurowalne workflow dla różnych środowisk
- Serwer domowy
  - Pełna kontrola nad infrastrukturą
  - Redukcja kosztów hostingu
  - Łatwość wprowadzania zmian w konfiguracji
