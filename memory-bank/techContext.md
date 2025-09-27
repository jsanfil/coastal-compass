# Tech Context
Technologies and constraints that shape the system.

- Languages/frameworks:
  - Frontend: JavaScript (ES6+), React 18, JSX
  - Backend: JavaScript (ES6+), Node.js with ESM modules
  - Build tool: Vite (frontend), direct Node execution (backend)
  - Styling: Tailwind CSS v4 with PostCSS
  - Server framework: Express.js

- Dev setup & tooling:
  - Frontend dev server: Vite (port 5173)
  - Backend dev server: Nodemon for hot reloading (configurable port, defaults to 4000)
  - Package management: npm workspaces (root package.json exists but appears unused)
  - Version control: Git with GitHub remote
  - IDE: VSCode with project-specific settings

- Technical constraints:
  - Must use RapidAPI proxy for Zillow API (no direct API calls)
  - API keys must remain server-side only (no client exposure)
  - CORS enabled on server for local development
  - Environment variables required for RAPIDAPI_KEY and RAPIDAPI_HOST
  - ESM modules throughout (type: "module" in package.json files)

- Key dependencies:
  - Frontend: React, React DOM, Tailwind CSS, PostCSS, Autoprefixer
  - Backend: Express, CORS, dotenv, node-fetch, zod
  - Testing: Vitest, Supertest, @vitest/coverage-v8
  - Dev dependencies: Vite plugins, ESLint (implied), Nodemon
  - External APIs: Zillow API via RapidAPI (propertyExtendedSearch endpoint), OpenRouter API (Claude-3-Haiku for LLM parsing)

- Usage patterns:
  - Client fetches from hardcoded localhost:3001/api/search and /api/parse-prompt
  - Server builds URLSearchParams for API requests and JSON payloads for LLM calls
  - Response data normalization handles multiple possible Zillow API response formats
  - LLM parsing preserves conversation context and location unless explicitly changed
  - Filter synchronization uses shared state with change detection and highlighting
  - Event-driven retry system uses window event listeners for cross-component communication
  - Comprehensive state reset pattern clears all app state (properties, conversation, filters, errors)
  - Error handling with console logging and structured error responses
  - State management via React useState hooks (no external state libraries)
