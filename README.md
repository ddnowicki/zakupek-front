# Zakupek – AI-powered Shopping List Application
*This project was created by me when I was **16 years old** as part of the **10xDevs** course, making me the youngest participant.*

[![Astro Version](https://img.shields.io/badge/Astro-5.5.5-blue)](https://astro.build)
[![Node Version](https://img.shields.io/badge/Node-22.14.0-green)](https://nodejs.org/)

## Table of Contents
1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Available Scripts](#available-scripts)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

## Project Description
Zakupek is a web application designed to simplify and streamline the creation of shopping lists by leveraging AI-driven recommendations and user purchase history. Users can generate personalized shopping lists, edit them manually, and review past lists to make better shopping decisions.

## Tech Stack

### Frontend
- **Astro 5** – Minimal JavaScript, fast static rendering
- **React 19** – Interactive UI components
- **TypeScript 5** – Static typing for reliability
- **Tailwind CSS 4** – Utility-first styling
- **Shadcn/ui** – Prebuilt React component library

### Testing
- **Vitest** – Unit and component testing for Astro and React components
- **Playwright** – End-to-end testing with cross-browser support
- **Testing Library** – Component testing utilities
- **MSW (Mock Service Worker)** – API mocking for tests

### Backend & Services
- **.NET 8 & ASP.NET Core** – High-performance REST API
- **Entity Framework Core** – ORM with code-first migrations
- **FastEndpoints** – Lightweight endpoint definitions
- **Scrutor** – Assembly scanning and DI registration
- **FluentValidation** – Fluent model validation
- **ErrorOr** – Unified error handling
- **Supabase** – Authentication and database
- **Openrouter.ai** – AI model integration for generating lists

### CI/CD & Hosting
- **GitHub Actions** – Automated workflows
- **Self-Hosted Server** – Full control over infrastructure

## Getting Started

### Prerequisites
- Node.js v22.14.0 (see [.nvmrc](.nvmrc))
- npm or yarn
- (Optional) Supabase project and credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/zakupek-front.git
cd zakupek-front

# Install dependencies
npm install
# or
# yarn install
```

### Environment Variables
Copy `.env.example` to `.env` and modify if needed:
```dotenv
PUBLIC_API_URL="https://localhost:5133"
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
Open your browser at `http://localhost:3000` to view the app.

## Available Scripts
| Command          | Description                         |
|------------------|-------------------------------------|
| `npm run dev`    | Start Astro in development mode     |
| `npm run build`  | Build the production site           |
| `npm run preview`| Preview the production build locally|
| `npm run astro`  | Run Astro CLI commands              |
| `npm run lint`   | Run ESLint                          |
| `npm run lint:fix` | Run ESLint with auto-fix          |
| `npm run format` | Format code with Prettier           |

## Project Scope

### Core Features (MVP)
- **User Authentication** – Register and log in via email/password
- **Profile Setup** – Capture household size, ages, and dietary preferences
- **AI-powered List Generation** – Generate shopping lists based on user history, seasonality, and household size
- **Manual List Management** – Create, edit, and delete lists; schedule purchase dates; assign stores
- **Item Status Tracking** – Mark items as “to buy” or “bought” in real time
- **History & Search** – Browse, sort, and paginate previous lists; basic product search

### Out of Scope for MVP
- Brand-specific recommendations
- Advanced filtering and reporting
- List sharing with other users
- Receipt validation
- Mobile-specific app (web-only MVP)

## Project Status
This project is currently in **Active Development**. The MVP stage has been implemented, and further improvements and features are planned for upcoming releases.

## License
This project is licensed under the [MIT License](LICENSE).
