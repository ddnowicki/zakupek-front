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
6. [Success Metrics](#success-metrics)
7. [Project Status](#project-status)
8. [License](#license)

## Project Description
Zakupek is a web application designed to simplify and streamline the creation of shopping lists by leveraging AI-driven recommendations and user purchase history. Users can generate personalized shopping lists based on household demographics and dietary preferences, edit them manually, and review past lists to make better shopping decisions. The application addresses the common problem of time wasted on creating repetitive shopping lists and forgetting important items by automating the process with AI technology.

## Tech Stack

### Frontend
- **Astro 5** – Minimal JavaScript, fast static rendering
- **React 19** – Interactive UI components
- **TypeScript 5** – Static typing for reliability
- **Tailwind CSS 4** – Utility-first styling
- **Shadcn/ui** – Prebuilt React component library

### Backend & Services
- **.NET 8 & ASP.NET Core** – High-performance REST API
- **Entity Framework Core** – ORM with code-first migrations
- **FastEndpoints** – Lightweight endpoint definitions
- **Scrutor** – Assembly scanning and DI registration
- **FluentValidation** – Fluent model validation
- **ErrorOr** – Unified error handling
- **JWT Authentication** – Secure token-based authentication
- **Supabase** – Authentication and database
- **OpenRouter.ai** – AI integration using deepseek/deepseek-prover-v2:free model for generating lists

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
- **User Authentication** – Register and log in via email/password with JWT token authentication
- **Profile Setup** – Capture household size, ages, and dietary preferences for personalized recommendations
- **AI-powered List Generation** – Generate shopping lists based on:
  - User purchase history (up to 5 previous lists)
  - Household demographics
  - Dietary preferences
  - Seasonal considerations
- **Manual List Management** – Create, edit, and delete lists; schedule purchase dates; assign specific stores
- **Item Status Tracking** – Track products with statuses (AI generated, Partially by AI, Manual, Deleted)
- **History & Search** – Browse, sort (newest, oldest, alphabetically), and paginate previous lists; basic product search

### Out of Scope for MVP
- Brand-specific product recommendations
- Advanced filtering and reporting systems
- List sharing with other users
- Receipt validation
- Mobile-specific app (web-only MVP)

## Success Metrics
- **AI Recommendation Acceptance Rate** – At least 75% of AI-suggested items are kept by users
- **AI Utilization Rate** – 75% of all created lists use AI generation
- **User Engagement** – Growth in active accounts and login frequency
- **Time Efficiency** – Measurable reduction in time needed to create shopping lists compared to traditional methods

## Project Status
This project is currently in **Active Development**. The MVP stage has been implemented, and further improvements and features are planned for upcoming releases.

## License
This project is licensed under the [MIT License](LICENSE).
