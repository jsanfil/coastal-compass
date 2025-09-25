# Project Brief

## Project Name
Coastal Keys (working title)

## Purpose
A full-stack web application that provides a **conversational, natural-language experience** for searching residential real estate. Users can describe what they’re looking for in plain English, and the system will translate those prompts into structured search criteria, fetch matching listings via the Zillow API, and display results in a modern, responsive UI.

## Core Goals
- **Conversational Search**
  - Integrate an LLM to process user prompts (e.g., “Show me 3-bedroom homes near La Jolla under $2M with ocean views”).
  - Parse natural language into structured filters (price, beds, baths, location, features).
  - Support multi-turn dialogue where users refine their search incrementally (e.g., “Make it 4 bedrooms instead”).
- **Filter Transparency**
  - Always show the **current active filters** being applied.
  - Allow users to adjust filters either:
    - Through the **conversation context** (natural language turns).
    - Through **traditional UI controls** (sliders, dropdowns, toggles).
  - Keep filters in sync across both modalities.
- **Zillow API Integration**
  - Use the Zillow API as the source of truth for property data.
  - Proxy all requests through the Node/Express server (no client-side key exposure).
  - Handle pagination, sorting, and rate limits gracefully.
- **User Experience**
  - Responsive, accessible design using React + Vite + TypeScript, Tailwind, and shadcn/ui.
  - Clear loading, error, and empty states.
  - Display property cards with key info (price, address, beds, baths, square footage, photos).
  - Enable easy exploration and refinement of results.

## Scope
**In-scope (MVP):**
- End-to-end pipeline: prompt → parsed filters → Zillow API call → results display.
- Multi-turn conversational refinement of filters.
- Traditional UI controls for filters (price range, location, beds/baths).
- Display of active filter state, updated in real time.
- Server-side proxy for API calls and environment key management.

**Out-of-scope (MVP, possible future):**
- User authentication, saved searches, or personalization.
- Advanced analytics or recommendations (e.g., “best deal” scoring).
- Deep MLS integrations beyond Zillow API.
- Mobile-native app (web-first only).

## Constraints
- Must follow `.clinerules` guardrails (safe diffs, no secrets, approval before major changes).
- Keep LLM usage cost-efficient (default to smaller models unless escalation is approved).
- Do not expose API keys in the client.
- Avoid scraping; rely only on ToS-compliant APIs.

## Success Criteria
- Users can **start with a natural-language prompt** and get a valid set of Zillow results.
- Users can **refine results across multiple turns** without resetting context.
- Users can see and adjust the **active filter set** via both conversation and UI.
- Client and server both run with `npm run dev` (5173 client, 3001 server).
- Memory Bank is maintained and reflects major decisions, filters, and patterns.