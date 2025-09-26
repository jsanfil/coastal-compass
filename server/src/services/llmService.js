import fetch from "node-fetch";

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
     * Parse natural language prompt into structured filter criteria
     * @param {string} prompt - Natural language search query
     * @param {Object} currentFilters - Existing filter state for refinement
     * @returns {Promise<Object>} Parsed filters and explanation
     */
    async parsePromptToFilters(prompt, currentFilters = {}) {
        try {
            const systemPrompt = this._buildSystemPrompt(currentFilters);
            const userPrompt = `Parse this real estate search query: "${prompt}"`;

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
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
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

            const parsedResult = this._parseLLMResponse(content);
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

        return `You are a real estate search assistant. Parse natural language queries into structured filter criteria for property searches.

Available filter fields:
- location: City, neighborhood, or address (required, default: "Aptos, CA")
- minPrice: Minimum price (string, optional)
- maxPrice: Maximum price (string, optional)
- home_type: Property type - "Houses", "Condos", "Townhomes", "Apartments", etc. (optional)
- bedsMin: Minimum bedrooms (string, optional)
- bathsMin: Minimum bathrooms (string, optional)
- sqftMin: Minimum square footage (string, optional)
- sqftMax: Maximum square footage (string, optional)
- sort: Sort order - "Price_High_Low", "Price_Low_High", "Newest", "Oldest", "Sqft_High_Low", "Sqft_Low_High" (default: "Price_High_Low")

Instructions:
1. Extract relevant criteria from the user's natural language query
2. Only include filters that are explicitly mentioned or clearly implied
3. For price ranges, convert to minPrice/maxPrice (e.g., "under $1M" → maxPrice: "1000000")
4. For bedroom/bathroom counts, use bedsMin/bathsMin for minimums
5. If refining existing filters, merge with current state appropriately
6. Return valid JSON with "filters" object and optional "explanation" string${currentFiltersText}

Response format:
{
  "filters": {
    "location": "San Diego, CA",
    "minPrice": "500000",
    "maxPrice": "1000000",
    "bedsMin": "3"
  },
  "explanation": "Searching for 3+ bedroom homes in San Diego priced $500K-$1M"
}`;
    }

    /**
     * Parse LLM response into structured format
     * @param {string} content - Raw LLM response
     * @returns {Object} Parsed result with filters and explanation
     */
    _parseLLMResponse(content) {
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

            // Ensure required fields have defaults
            const filters = {
                location: parsed.filters.location || "Aptos, CA",
                ...parsed.filters
            };

            return {
                filters,
                explanation: parsed.explanation || null
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
