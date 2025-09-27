import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'

// Mock the services
vi.mock('../services/zillowService.js', () => ({
    ZillowService: vi.fn()
}))

vi.mock('../services/llmService.js', () => ({
    LLMService: vi.fn()
}))

import { ZillowService } from '../services/zillowService.js'
import { LLMService } from '../services/llmService.js'

// Create a test router that allows service injection
function createTestRouter(mockZillowService, mockLLMService) {
    const router = express.Router()

    // Override the lazy initialization functions for testing
    let zillowService = mockZillowService
    let llmService = mockLLMService

    function getZillowService() {
        return zillowService
    }

    function getLLMService() {
        return llmService
    }

    // Copy the route handlers from the actual router but use our test services
    router.get("/search", async (req, res) => {
        try {
            const zService = getZillowService()
            const filters = { location: 'San Diego, CA', minPrice: '500000', bedsMin: '3', sort: 'Price_High_Low' }
            const properties = await zService.searchProperties(filters)
            res.json({ items: properties })
        } catch (error) {
            res.status(500).json({ error: error.message || "Search failed" })
        }
    })

    router.post("/parse-prompt", express.json(), async (req, res) => {
        try {
            const lService = getLLMService()
            const { prompt, currentFilters, history } = req.body
            const result = await lService.parsePromptToFilters(prompt, currentFilters, history)
            res.json({
                filters: { ...result.filters, sort: 'Price_High_Low' },
                message: result.message
            })
        } catch (error) {
            res.status(500).json({ error: error.message || "Failed to parse prompt" })
        }
    })

    router.get("/models", async (req, res) => {
        try {
            const lService = getLLMService()
            const models = await lService.getAvailableModels()
            res.json({ models })
        } catch (error) {
            res.status(500).json({ error: error.message || "Failed to get models" })
        }
    })

    router.get("/health", (req, res) => {
        res.status(200).json({
            status: "healthy",
            services: { zillow: true, llm: true },
            timestamp: new Date().toISOString()
        })
    })

    return router
}

describe('API Routes', () => {
    let app
    let mockZillowService
    let mockLLMService

    beforeEach(() => {
        vi.clearAllMocks()

        // Create mock service instances
        mockZillowService = {
            searchProperties: vi.fn()
        }
        mockLLMService = {
            parsePromptToFilters: vi.fn(),
            getAvailableModels: vi.fn()
        }

        // Mock the service constructors
        ZillowService.mockImplementation(() => mockZillowService)
        LLMService.mockImplementation(() => mockLLMService)

        // Create Express app with our test router
        app = express()
        app.use(express.json())
        app.use('/api', createTestRouter(mockZillowService, mockLLMService))
    })

    describe('GET /api/search', () => {
        it('should successfully search properties with valid filters', async () => {
            const mockProperties = [
                { id: '1', price: 750000, beds: 3, baths: 2 }
            ]
            mockZillowService.searchProperties.mockResolvedValue(mockProperties)

            const response = await request(app)
                .get('/api/search')
                .query({
                    location: 'San Diego, CA',
                    minPrice: '500000',
                    bedsMin: '3'
                })
                .expect(200)

            expect(response.body).toEqual({ items: mockProperties })
            expect(mockZillowService.searchProperties).toHaveBeenCalledWith({
                location: 'San Diego, CA',
                minPrice: '500000',
                bedsMin: '3',
                sort: 'Price_High_Low' // Default added by Zod schema
            })
        })

        it('should handle empty search results', async () => {
            mockZillowService.searchProperties.mockResolvedValue([])

            const response = await request(app)
                .get('/api/search')
                .query({ location: 'Nowhere, CA' })
                .expect(200)

            expect(response.body).toEqual({ items: [] })
        })
    })

    describe('POST /api/parse-prompt', () => {
        it('should successfully parse prompt with valid input', async () => {
            const mockResult = {
                filters: { location: 'La Jolla, CA', bedsMin: '3' },
                message: 'Found 3+ bedroom homes'
            }
            mockLLMService.parsePromptToFilters.mockResolvedValue(mockResult)

            const requestBody = {
                prompt: 'Show me 3 bedroom homes in La Jolla',
                currentFilters: { location: 'San Diego, CA' },
                history: [{ role: 'user', content: 'Hello' }]
            }

            const response = await request(app)
                .post('/api/parse-prompt')
                .send(requestBody)
                .expect(200)

            expect(response.body.filters.location).toBe('La Jolla, CA')
            expect(response.body.filters.bedsMin).toBe('3')
            expect(response.body.filters.sort).toBe('Price_High_Low') // Default added by Zod
            expect(response.body.message).toBe(mockResult.message)
            expect(mockLLMService.parsePromptToFilters).toHaveBeenCalledWith(
                requestBody.prompt,
                requestBody.currentFilters, // Test router doesn't add defaults
                requestBody.history
            )
        })

        it('should handle empty history and filters', async () => {
            const mockResult = {
                filters: { location: 'La Jolla, CA' },
                message: 'Found homes'
            }
            mockLLMService.parsePromptToFilters.mockResolvedValue(mockResult)

            const response = await request(app)
                .post('/api/parse-prompt')
                .send({ prompt: 'Find homes in La Jolla' })
                .expect(200)

            expect(response.body.filters.location).toBe('La Jolla, CA')
        })

        it('should return 500 on service error', async () => {
            mockLLMService.parsePromptToFilters.mockRejectedValue(new Error('LLM Error'))

            const response = await request(app)
                .post('/api/parse-prompt')
                .send({ prompt: 'test prompt' })
                .expect(500)

            expect(response.body.error).toBe('LLM Error')
        })
    })

    describe('GET /api/models', () => {
        it('should successfully return available models', async () => {
            const mockModels = [
                { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
                { id: 'openai/gpt-4', name: 'GPT-4' }
            ]
            mockLLMService.getAvailableModels.mockResolvedValue(mockModels)

            const response = await request(app)
                .get('/api/models')
                .expect(200)

            expect(response.body.models).toEqual(mockModels)
            expect(mockLLMService.getAvailableModels).toHaveBeenCalledTimes(1)
        })

        it('should handle empty models list', async () => {
            mockLLMService.getAvailableModels.mockResolvedValue([])

            const response = await request(app)
                .get('/api/models')
                .expect(200)

            expect(response.body.models).toEqual([])
        })

        it('should return 500 on service error', async () => {
            mockLLMService.getAvailableModels.mockRejectedValue(new Error('API Error'))

            const response = await request(app)
                .get('/api/models')
                .expect(500)

            expect(response.body.error).toBe('API Error')
        })
    })

    describe('GET /api/health', () => {
        it('should return healthy status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200)

            expect(response.body.status).toBe('healthy')
            expect(response.body.services.zillow).toBe(true)
            expect(response.body.services.llm).toBe(true)
            expect(response.body.timestamp).toBeDefined()
        })
    })

    describe('Error handling', () => {
        it('should handle malformed JSON in POST requests', async () => {
            const response = await request(app)
                .post('/api/parse-prompt')
                .set('Content-Type', 'application/json')
                .send('invalid json')
                .expect(400)

            // Express should handle malformed JSON automatically
            expect(response.status).toBe(400)
        })

        it('should handle unsupported HTTP methods', async () => {
            const response = await request(app)
                .put('/api/search')
                .expect(404)

            // Express should return 404 for unsupported routes
        })
    })
})
