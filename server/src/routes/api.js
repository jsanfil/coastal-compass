import express from "express";
import { ZillowService } from "../services/zillowService.js";
import { LLMService } from "../services/llmService.js";
import { filterSchema, parsePromptRequestSchema } from "../schemas/filters.js";

const router = express.Router();

// Lazy initialization of services
let zillowService;
let llmService;

function getZillowService() {
    if (!zillowService) {
        zillowService = new ZillowService();
    }
    return zillowService;
}

function getLLMService() {
    if (!llmService) {
        llmService = new LLMService();
    }
    return llmService;
}

/**
 * GET /api/search
 * Search for properties using traditional filters
 */
router.get("/search", async (req, res) => {
    try {
        // Initialize service if not already done
        if (!zillowService) {
            zillowService = new ZillowService();
        }

        // Validate and parse query parameters
        const filters = filterSchema.parse(req.query);

        console.log('Search request with filters:', filters);

        // Search for properties
        const properties = await zillowService.searchProperties(filters);

        res.json({ items: properties });
    } catch (error) {
        console.error('Search endpoint error:', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: "Invalid filter parameters",
                details: error.errors
            });
        }

        res.status(500).json({ error: error.message || "Search failed" });
    }
});

/**
 * POST /api/parse-prompt
 * Parse natural language prompt into filter criteria using LLM
 */
router.post("/parse-prompt", express.json(), async (req, res) => {
    try {
        // Initialize service if not already done
        if (!llmService) {
            llmService = new LLMService();
        }

        // Validate request body
        const { prompt, currentFilters } = parsePromptRequestSchema.parse(req.body);

        console.log('Parse prompt request:', { prompt, currentFilters });

        // Parse prompt using LLM
        const result = await llmService.parsePromptToFilters(prompt, currentFilters);

        // Validate the parsed filters against our schema
        const validatedFilters = filterSchema.parse(result.filters);

        res.json({
            filters: validatedFilters,
            explanation: result.explanation
        });
    } catch (error) {
        console.error('Parse prompt endpoint error:', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: "Invalid request parameters",
                details: error.errors
            });
        }

        res.status(500).json({ error: error.message || "Failed to parse prompt" });
    }
});

/**
 * GET /api/models
 * Get available LLM models (for debugging/admin purposes)
 */
router.get("/models", async (req, res) => {
    try {
        if (!llmService) {
            llmService = new LLMService();
        }

        const models = await llmService.getAvailableModels();
        res.json({ models });
    } catch (error) {
        console.error('Models endpoint error:', error);
        res.status(500).json({ error: error.message || "Failed to get models" });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
    const servicesStatus = {
        zillow: !!zillowService,
        llm: !!llmService
    };

    const allHealthy = Object.values(servicesStatus).every(Boolean);

    res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? "healthy" : "degraded",
        services: servicesStatus,
        timestamp: new Date().toISOString()
    });
});

export default router;
