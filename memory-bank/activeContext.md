# Active Context
Tracks the current state of development.

- Current work focus:
  - Conversational search interface implementation
  - LLM integration for natural language processing
  - Multi-turn dialogue support for filter refinement
  - Memory Bank maintenance and documentation updates

- Recent changes:
  - Reset button functionality added with comprehensive app state reset (handleReset function)
  - Enhanced error handling with retry mechanisms for search and conversation failures
  - Event-driven retry system implemented using window event listeners (handleRetrySearch, handleRetryConversation)
  - UI/UX improvements: cleaned up conversation interface, removed hint text, elongated design
  - Updated active filters UX and fixed location logic in filter handling
  - Added Cline configuration to minimize model retry errors
  - Server-side LLM support implemented using OpenRouter API with Claude-3-Haiku
  - LLMService class added for parsing natural language prompts into structured filters
  - API endpoints added: /api/parse-prompt for prompt parsing, /api/models for model info
  - Client-side ConversationBar component implemented for natural language input
  - Conversational search flow: prompt → LLM parsing → filter application → property search
  - Active filters display implemented with square sage-green styling positioned above results count
  - ActiveFiltersBar component removed as unused (functionality moved inline to PropertyGrid)
  - Code cleanup: removed unused imports and handler functions from App.jsx
  - Port configuration aligned (server running on 3001, client proxy configured correctly)
  - Multi-turn dialogue support implemented with conversation history and context-aware LLM responses
  - ConversationInterface component created to integrate history and input into single cohesive control
  - Auto-scroll functionality added to conversation history for improved UX
  - Dual filter control synchronization: conversation and traditional filters stay in sync
  - Filter change highlighting: newly modified filters pulse with warm-coral background for 3 seconds
  - Location preservation fix: location persists in multi-turn conversations unless explicitly changed
  - UI typography consistency: Conversation and Advanced Filters headers now match in font size
- Fixed filter clearing bug: Added direct detection for clearing commands ("clear all filters", "reset filters", etc.) in LLM service to return complete filter objects with empty strings for cleared fields, ensuring UI and search results update properly when clearing filters

- Next steps:
  - Testing (unit tests, integration tests for API endpoints)

- Active decisions & considerations:
  - Using RapidAPI for Zillow API access to avoid direct scraping
  - Client-side state management with React useState for filters and properties
  - Server-side proxy pattern to keep API keys secure
  - Tailwind CSS for styling with custom color scheme (blue-teal, warm-beige)

- Important patterns/preferences:
  - Event-driven architecture for cross-component communication (window event listeners for retry mechanisms)
  - Comprehensive state reset pattern (handleReset function clears all app state)
  - ESM modules throughout (client and server)
  - Environment variables for API configuration
  - Consistent error handling with try/catch blocks
  - URLSearchParams for building API query strings
  - Array mapping for normalizing API response data

- Learnings & insights:
  - Zillow API response structure varies; need robust data normalization
  - Client expects consistent property object structure (id, address, city, state, price, beds, baths, sqft, propertyType, imgSrc, permalink)
  - Port configuration needs alignment between client and server
  - Full conversational search flow successfully implemented with LLM integration
  - Location preservation is critical for multi-turn conversations - users expect location to persist unless explicitly changed
  - Filter change highlighting provides essential visual feedback for seamless conversation-to-traditional switching
  - Shared state pattern enables perfect synchronization between conversational and traditional filter controls
  - UI consistency (typography, spacing) enhances perceived professionalism and user trust
  - Zod schemas provide robust validation for API requests and responses
  - Multi-turn dialogue requires careful conversation history management for context-aware LLM responses
