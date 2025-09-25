# Product Context

## Why This Project Exists
Searching for homes on traditional platforms can be tedious. Users are forced to:
- Fill out rigid forms with drop-downs and sliders.
- Repeatedly reset or re-enter search filters.
- Struggle to express more nuanced desires (e.g., “something close to the beach but not on a busy street”).

By providing a **conversational search experience**, this project reduces friction and makes it easier for users to find homes that actually match their intent.

## Problems It Solves
- **Rigid UI**: Current real estate apps make users adapt to the tool, not the other way around.
- **Single-turn filters**: Traditional search requires starting over if criteria shift.
- **Discoverability**: Hard-to-express preferences (like “quiet neighborhood” or “modern kitchen”) often don’t fit into a filter menu.
- **Transparency**: Users can lose track of which filters are applied after multiple refinements.

## Target Users
- **Homebuyers** actively exploring the market, especially in coastal California.
- **Casual browsers** who want to “play with” search ideas in natural language.
- **Real estate enthusiasts** who want a modern, AI-powered tool to explore listings.

## How It Should Work
- Users start with a natural language prompt (“Show me condos near La Jolla under $1.5M”).
- The system:
  1. Uses an LLM to translate the prompt into structured filter criteria.
  2. Fetches matching properties via Zillow API.
  3. Displays the results in an attractive, card-based UI.
- Users can refine their search via:
  - **Conversation** (“Make it 3 bedrooms instead.”).
  - **Traditional controls** (sliders, dropdowns, etc.).
- Active filters are always visible, keeping the user in control.

## User Experience Goals
- **Natural & Conversational**: Feels like talking to a smart assistant.
- **Transparent**: Filters and applied criteria are always clear and editable.
- **Flexible**: Multi-turn refinement works seamlessly.
- **Modern UI**: Clean, responsive, accessible, with Tailwind + shadcn/ui styling.
- **Low Friction**: Fast, debounced inputs, smooth loading states, no clutter.