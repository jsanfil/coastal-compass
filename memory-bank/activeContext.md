# Active Context
Tracks the current state of development.

- Current work focus:
  - Initializing Memory Bank with current project state
  - Establishing baseline documentation for conversational real estate search app
  - Reviewing existing codebase to document current implementation status

- Recent changes:
  - Project structure established with client/server separation
  - Basic Zillow API integration implemented via RapidAPI proxy
  - React frontend with filter controls and property display components
  - Express server handling search requests and API proxying

- Next steps:
  - Implement conversational search interface with LLM integration
  - Add multi-turn dialogue support for filter refinement
  - Enhance UI to show active filter state and support both natural language and traditional controls
  - Resolve server port configuration inconsistency (client expects 3001, server defaults to 4000)

- Active decisions & considerations:
  - Using RapidAPI for Zillow API access to avoid direct scraping
  - Client-side state management with React useState for filters and properties
  - Server-side proxy pattern to keep API keys secure
  - Tailwind CSS for styling with custom color scheme (blue-teal, warm-beige)

- Important patterns/preferences:
  - ESM modules throughout (client and server)
  - Environment variables for API configuration
  - Consistent error handling with try/catch blocks
  - URLSearchParams for building API query strings
  - Array mapping for normalizing API response data

- Learnings & insights:
  - Zillow API response structure varies; need robust data normalization
  - Client expects consistent property object structure (id, address, city, state, price, beds, baths, sqft, propertyType, imgSrc, permalink)
  - Port configuration needs alignment between client and server
  - Current implementation supports traditional filters but lacks conversational features
