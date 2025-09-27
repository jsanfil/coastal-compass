// Keyword whitelist & mapping: user phrase -> canonical token
export const KEYWORD_MAP = {
    // --- Core Features ---
    "pool": "pool",
    "swimming pool": "pool",

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

    "new construction": "newConstruction",
    "brand new": "newConstruction",
    "just built": "newConstruction",

    "single story": "singleStory",
    "one story": "singleStory",
    "ranch style": "singleStory",

    "fixer": "fixer",
    "fixer-upper": "fixer",
    "needs tlc": "fixer",

    "open floor plan": "openFloorPlan",
    "great room": "openFloorPlan",

    "garden": "garden",
    "landscaped yard": "garden",

    // --- Views ---
    "view": "view",                        // broad catch-all
    "ocean view": "ocean view",
    "mountain view": "mountain view",
    "bay view": "bay view",
    "lake view": "lake view",
    "river view": "river view",
    "city view": "city view",
    "golf course view": "golf course view",
    "park view": "park view",
    "water view": "water view",
    "canyon view": "canyon view",
    "valley view": "valley view",
    "harbor view": "harbor view",
    "garden view": "garden view",

    // --- Waterfronts ---
    "waterfront": "waterfront",            // broad catch-all
    "oceanfront": "oceanfront",
    "beachfront": "beachfront",
    "lakefront": "lakefront",
    "riverfront": "riverfront",
    "bayfront": "bayfront",
    "canal front": "canal front",
    "harbor front": "harbor front",
    "lagoon front": "lagoon front"
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
