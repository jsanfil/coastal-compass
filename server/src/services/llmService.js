import fetch from "node-fetch";
import { getAllCanonicalTokens } from "../lib/keywordMap.js";

/**
 * Service for LLM-powered natural language processing using OpenRouter
 */
export class LLMService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.model = process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku";
        this.baseUrl = "https://openrouter.ai/api/v1";

        if (!this.apiKey) {
            throw new Error("Missing required environment variable: OPENROUTER_API_KEY");
        }
    }

    /**
     * Parse natural language prompt into structured filter criteria with conversation context
     * @param {string} prompt - Natural language search query
     * @param {Object} currentFilters - Existing filter state for refinement
     * @param {Array} history - Previous conversation messages [{role, content}, ...]
     * @returns {Promise<Object>} Parsed filters and assistant message
     */
    async parsePromptToFilters(prompt, currentFilters = {}, history = []) {
        const currentFiltersCopy = { ...currentFilters }; // Preserve original for context

        // Handle clearing commands directly
        const lowerPrompt = prompt.toLowerCase().trim();
        if (lowerPrompt.includes('clear all filters') || lowerPrompt.includes('reset filters') || lowerPrompt.includes('clear filters')) {
            const preserveLocation = lowerPrompt.includes('except location');
            return {
                filters: {
                    location: preserveLocation ? (currentFilters.location || "Aptos, CA") : "Aptos, CA",
                    minPrice: "",
                    maxPrice: "",
                    home_type: "",
                    bedsMin: "",
                    bathsMin: "",
                    sqftMin: "",
                    sqftMax: "",
                    sort: "Price_High_Low",
                    keywords: []
                },
                message: preserveLocation
                    ? `Okay, I've cleared all filters except for the location, which is set to ${currentFilters.location || "Aptos, CA"}.`
                    : "Okay, I've cleared all filters and reset to the default location."
            };
        }

        try {
            const systemPrompt = this._buildSystemPrompt(currentFilters);
            const messages = [{ role: "system", content: systemPrompt }];

            // Add conversation history
            history.forEach(msg => {
                messages.push({ role: msg.role, content: msg.content });
            });

            // Add current user prompt
            messages.push({ role: "user", content: `Parse this real estate search query: "${prompt}"` });

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.APP_URL || "http://localhost:3001",
                    "X-Title": "Coastal Compass"
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.1, // Low temperature for consistent parsing
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error("No response content from LLM");
            }

            console.log('LLM Raw response:', content);

            const parsedResult = this._parseLLMResponse(content, currentFiltersCopy);
            console.log('Parsed filters:', parsedResult);

            return parsedResult;
        } catch (error) {
            console.error('LLM parsing failed:', error);
            throw new Error(`Failed to parse prompt: ${error.message}`);
        }
    }

    /**
     * Build system prompt for the LLM
     * @param {Object} currentFilters - Current filter state
     * @returns {string} System prompt
     */
    _buildSystemPrompt(currentFilters) {
        const currentFiltersText = Object.keys(currentFilters).length > 0
            ? `\nCurrent active filters: ${JSON.stringify(currentFilters, null, 2)}`
            : "";

        const keywordWhitelist = getAllCanonicalTokens().join(", ");

        return `You are a conversational real estate search assistant. Help users find properties through natural dialogue.

Available filter fields:
- location: City, neighborhood, or address (required, default: "Aptos, CA")
- minPrice: Minimum price (string, optional)
- maxPrice: Maximum price (string, optional)
- home_type: Property type - use these exact Zillow API values:
  * "Houses" (single family homes, houses, homes)
  * "Townhomes" (townhouses, town homes)
  * "Multi-family" (duplexes, triplexes, multi-family homes)
  * "Apartments" (apartments, rental units)
  * "Manufactured" (manufactured homes, mobile homes)
  * "Condos" (condominiums, condos)
  * "LotsLand" (lots, land, vacant land)
  (optional - leave empty if not specified)
- bedsMin: Minimum bedrooms (string, optional)
- bathsMin: Minimum bathrooms (string, optional)
- sqftMin: Minimum square footage (string, optional)
- sqftMax: Maximum square footage (string, optional)
- sort: Sort order - "Price_High_Low", "Price_Low_High", "Newest", "Oldest", "Sqft_High_Low", "Sqft_Low_High" (default: "Price_High_Low")
- keywords: Array of canonical tokens from this whitelist: ${keywordWhitelist}

Instructions:
1. Extract relevant criteria from the user's natural language query
2. Handle special commands:
   - If user says "clear all filters", "reset filters", "clear filters", or similar → Return ALL filter fields with empty strings ("") except preserve location
   - Otherwise, only include filters that are explicitly mentioned or clearly implied
3. For property types: ALWAYS set home_type when the user mentions property types like "homes", "houses", "condos", "apartments", "townhomes", etc. Map them to the exact API values listed above.
4. For price ranges, convert to minPrice/maxPrice (e.g., "under $1M" → maxPrice: "1000000")
5. For bedroom/bathroom counts, use bedsMin/bathsMin for minimums
6. For keywords: Include only keywords present in the provided whitelist. Do not invent tokens. Drop anything not in the whitelist.
7. IMPORTANT: Location is always required. If no new location is mentioned in this turn, preserve the current location from context. Never remove or reset location to default unless user explicitly requests a new location.
8. IMPORTANT: Keywords should be preserved across conversation turns. Only include keywords in your response if the user explicitly mentions new keywords or wants to clear them (e.g., "no pool", "remove ocean view"). If no keywords are mentioned in this query, do NOT include the keywords field in your response at all - this preserves the existing keywords.
9. If refining existing filters, merge with current state appropriately - preserve values that aren't being changed
10. Provide a natural, conversational response acknowledging the user's request
11. Return valid JSON with "filters" object and "message" string for user feedback${currentFiltersText}

Response format:
{
  "filters": {
    "location": "San Diego, CA",
    "home_type": "Houses",
    "minPrice": "500000",
    "maxPrice": "1000000",
    "bedsMin": "3",
    "keywords": ["pool", "waterfront"]
  },
  "message": "Got it! Showing 3+ bedroom homes in San Diego priced between $500K and $1M with pools and waterfront views."
}`;
    }

    /**
     * Parse LLM response into structured format
     * @param {string} content - Raw LLM response
     * @param {Object} currentFilters - Current filter state for context
     * @returns {Object} Parsed result with filters and explanation
     */
    _parseLLMResponse(content, currentFilters = {}) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No JSON found in LLM response");
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate the response structure
            if (!parsed.filters || typeof parsed.filters !== 'object') {
                throw new Error("Invalid response structure: missing filters object");
            }

            // Start with current filters as base, preserving all existing state
            const filters = { ...currentFilters };

            // Override only fields that are explicitly present in LLM response
            // This includes empty strings/nulls which should clear the filter
            Object.keys(parsed.filters).forEach(key => {
                if (parsed.filters[key] !== undefined) {
                    filters[key] = parsed.filters[key];
                }
            });

            // Ensure location always has a default value
            if (!filters.location) {
                filters.location = "Aptos, CA";
            }

            return {
                filters,
                message: parsed.message || null
            };
        } catch (error) {
            console.error('Failed to parse LLM response:', content);
            throw new Error(`Invalid LLM response format: ${error.message}`);
        }
    }

    /**
     * Get available models (for debugging/admin purposes)
     * @returns {Promise<Array>} List of available models
     */
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to get available models:', error);
            return [];
        }
    }
}
