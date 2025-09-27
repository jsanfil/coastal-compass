import { z } from 'zod';

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
    ]).default("Price_High_Low")
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
