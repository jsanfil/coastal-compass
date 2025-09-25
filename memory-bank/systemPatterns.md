# System Patterns
Architectural conventions and key technical decisions.

- System architecture overview:
  - Full-stack web application with clear client/server separation
  - Frontend: Single-page React application built with Vite
  - Backend: REST API server built with Express.js
  - API proxy pattern: Client never directly calls external APIs; all requests go through Express server
  - Environment-based configuration using dotenv for API keys and settings

- Core design patterns in use:
  - Component-based architecture (React functional components with hooks)
  - Container/Presentational pattern (App.jsx manages state, components handle display)
  - API proxy pattern (server acts as secure intermediary for external API calls)
  - State lifting pattern (filters and properties state managed at App level)
  - Error boundary pattern (try/catch blocks around async operations)

- Component/module relationships:
  - App.jsx (root): Manages global state (filters, properties, loading), orchestrates search
  - FilterPanel.jsx: Child component for filter input controls
  - PropertyGrid.jsx: Child component for displaying search results
  - PropertyCard.jsx: Sub-component for individual property display
  - server/index.js: Single route handler (/api/search) that proxies to Zillow API

- Critical implementation paths:
  - Search flow: User input → FilterPanel → App state update → search() function → fetch to /api/search → server proxy → Zillow API → response normalization → PropertyGrid display
  - Data normalization: Server maps varying Zillow API response structures to consistent client format
  - Error handling: Client catches fetch errors, server catches API/proxy errors
  - Configuration: Environment variables loaded via dotenv, used for API credentials and optional overrides
