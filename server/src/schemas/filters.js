import { z } from 'zod';
import { getAllCanonicalTokens } from '../lib/keywordMap.js';

// Shared filter schema used for validation and type safety
export const filterSchema = z.object({
    location: z.string().min(1, "Location is required").default("Aptos, CA"),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    home_type: z.string().optional(),
    bedsMin: z.string().optional(),
    bathsMin: z.string().optional(),
    sqftMin: z.string().optional(),
    sqftMax: z.string().optional(),
    sort: z.enum([
        "Price_High_Low",
        "Price_Low_High",
        "Newest",
        "Oldest",
        "Sqft_High_Low",
        "Sqft_Low_High",
        "Square_Feet",
        "Bedrooms",
        "Bathrooms",
        "Lot_Size"
    ]).default("Price_High_Low"),
    keywords: z.union([
        z.array(z.string()),
        z.string()
    ]).transform((val) => {
        if (Array.isArray(val)) {
            return val;
        }
        if (typeof val === 'string' && val.trim() === '') {
            return [];
        }
        if (typeof val === 'string') {
            return val.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        return [];
    }).default([])
});

// Schema for parsing natural language prompts into filters
export const parsePromptRequestSchema = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"),
    currentFilters: filterSchema.optional(), // Allow refining existing filters
    history: z.array(z.object({
        role: z.string(),
        content: z.string()
    })).optional() // Conversation history for multi-turn dialogue
});

// Schema for the response from LLM parsing
export const parsePromptResponseSchema = z.object({
    filters: filterSchema,
    message: z.string().optional() // Natural language response for user feedback
});

// Note: For TypeScript usage later, these would be:
// export type FilterSchema = z.infer<typeof filterSchema>;
// export type ParsePromptRequest = z.infer<typeof parsePromptRequestSchema>;
// export type ParsePromptResponse = z.infer<typeof parsePromptResponseSchema>;
