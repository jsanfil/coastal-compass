# Active Context
Tracks the current state of development.

- Current work focus:
  - Conversational search interface implementation
  - LLM integration for natural language processing
  - Multi-turn dialogue support for filter refinement
  - Memory Bank maintenance and documentation updates

- Recent changes:
  - Server-side LLM support implemented using OpenRouter API with Claude-3-Haiku
  - LLMService class added for parsing natural language prompts into structured filters
  - API endpoints added: /api/parse-prompt for prompt parsing, /api/models for model info
  - Client-side ConversationBar component implemented for natural language input
  - Conversational search flow: prompt → LLM parsing → filter application → property search
  - Active filters display implemented with square sage-green styling positioned above results count
  - ActiveFiltersBar component removed as unused (functionality moved inline to PropertyGrid)
  - Code cleanup: removed unused imports and handler functions from App.jsx
  - Port configuration aligned (server running on 3001, client proxy configured correctly)

- Next steps:
  - Enhance UI to support both conversational and traditional filter controls
  - Add user experience improvements (loading states, empty states, error states)

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
