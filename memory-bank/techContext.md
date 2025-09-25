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
  - Backend: Express, CORS, dotenv, node-fetch
  - Dev dependencies: Vite plugins, ESLint (implied), Nodemon
  - External APIs: Zillow API via RapidAPI (propertyExtendedSearch endpoint)

- Usage patterns:
  - Client fetches from hardcoded localhost:3001/api/search (needs port alignment)
  - Server builds URLSearchParams for API requests
  - Response data normalization handles multiple possible Zillow API response formats
  - Error handling with console logging and structured error responses
  - State management via React useState hooks (no external state libraries)
