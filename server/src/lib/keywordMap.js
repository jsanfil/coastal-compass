// Keyword whitelist & mapping: user phrase -> canonical token
export const KEYWORD_MAP = {
    // Core features with strong support
    "pool": "pool",
    "swimming pool": "pool",

    "waterfront": "waterfront",
    "oceanfront": "waterfront",
    "lakefront": "waterfront",

    "single story": "singleStory",
    "one story": "singleStory",
    "ranch style": "singleStory",

    "new construction": "newConstruction",
    "brand new": "newConstruction",
    "just built": "newConstruction",

    "garage": "garage",
    "two car garage": "garage",
    "2-car garage": "garage",

    "fireplace": "fireplace",
    "wood stove": "fireplace",

    "basement": "basement",
    "finished basement": "basement",

    "adu": "adu",
    "guest house": "guestHouse",
    "casita": "guestHouse",
    "in-law": "guestHouse",

    "solar": "solar",
    "solar panels": "solar",

    "view": "view",
    "ocean view": "view",
    "mountain view": "view",

    "fixer": "fixer",
    "fixer-upper": "fixer",
    "needs tlc": "fixer",

    "open floor plan": "openFloorPlan",
    "great room": "openFloorPlan",

    "garden": "garden",
    "landscaped yard": "garden"
};

/**
 * Get canonical token for a user phrase
 * @param {string} phrase - User input phrase
 * @returns {string|null} Canonical token or null if not found
 */
export function getCanonicalToken(phrase) {
    const normalizedPhrase = phrase.toLowerCase().trim();
    return KEYWORD_MAP[normalizedPhrase] || null;
}

/**
 * Get all available canonical tokens
 * @returns {string[]} Array of all canonical tokens
 */
export function getAllCanonicalTokens() {
    return [...new Set(Object.values(KEYWORD_MAP))];
}

/**
 * Check if a phrase is in the whitelist
 * @param {string} phrase - User input phrase
 * @returns {boolean} True if phrase is whitelisted
 */
export function isPhraseWhitelisted(phrase) {
    return getCanonicalToken(phrase) !== null;
}
