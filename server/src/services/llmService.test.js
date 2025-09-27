import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LLMService } from './llmService.js'
import {
    mockLLMParseResponse,
    mockLLMFilterClearResponse,
    mockLLMModelsResponse,
    mockLLMErrorResponse
} from '../../test/fixtures/llmResponses.js'

// Mock node-fetch
vi.mock('node-fetch', () => ({
    default: vi.fn()
}))

import fetch from 'node-fetch'

describe('LLMService', () => {
    let service

    beforeEach(() => {
        vi.clearAllMocks()
        service = new LLMService()
    })

    describe('constructor', () => {
        it('should initialize with environment variables', () => {
            expect(service.apiKey).toBe('test-openrouter-key')
            expect(service.model).toBe('anthropic/claude-3-haiku')
            expect(service.baseUrl).toBe('https://openrouter.ai/api/v1')
        })

        it('should throw error if OPENROUTER_API_KEY is missing', () => {
            const originalKey = process.env.OPENROUTER_API_KEY
            delete process.env.OPENROUTER_API_KEY

            expect(() => new LLMService()).toThrow('Missing required environment variable: OPENROUTER_API_KEY')

            process.env.OPENROUTER_API_KEY = originalKey
        })

        it('should use custom model if provided', () => {
            const originalModel = process.env.OPENROUTER_MODEL
            process.env.OPENROUTER_MODEL = 'custom-model'

            const customService = new LLMService()
            expect(customService.model).toBe('custom-model')

            process.env.OPENROUTER_MODEL = originalModel
        })
    })

    describe('parsePromptToFilters', () => {
        it('should successfully parse prompt and return filters', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue(mockLLMParseResponse)
            }
            fetch.mockResolvedValue(mockResponse)

            const result = await service.parsePromptToFilters(
                'Show me 3 bedroom homes in La Jolla under $2M',
                { location: 'San Diego, CA' },
                [{ role: 'user', content: 'Hello' }]
            )

            expect(fetch).toHaveBeenCalledTimes(1)
            expect(result.filters.location).toBe('La Jolla, CA')
            expect(result.filters.minPrice).toBe('1000000')
            expect(result.filters.maxPrice).toBe('2000000')
            expect(result.filters.bedsMin).toBe('3')
            expect(result.message).toContain('3+ bedroom homes in La Jolla')
        })

        it('should handle filter clearing commands', async () => {
            const result = await service.parsePromptToFilters('clear all filters')

            expect(result.filters).toEqual({
                location: 'Aptos, CA',
                minPrice: '',
                maxPrice: '',
                home_type: '',
                bedsMin: '',
                bathsMin: '',
                sqftMin: '',
                sqftMax: '',
                sort: 'Price_High_Low',
                keywords: []
            })
            expect(result.message).toContain('cleared all filters')
        })

        it('should preserve location when clearing filters except location', async () => {
            const result = await service.parsePromptToFilters(
                'clear all filters except location',
                { location: 'San Diego, CA' }
            )

            expect(result.filters.location).toBe('San Diego, CA')
            expect(result.filters.minPrice).toBe('')
            expect(result.message).toContain('except for the location')
        })

        it('should preserve existing location when not mentioned in prompt', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                filters: { bedsMin: '4' },
                                message: 'Showing 4+ bedroom homes'
                            })
                        }
                    }]
                })
            }
            fetch.mockResolvedValue(mockResponse)

            const result = await service.parsePromptToFilters(
                'Show me 4 bedroom homes',
                { location: 'La Jolla, CA', minPrice: '500000' }
            )

            expect(result.filters.location).toBe('La Jolla, CA') // Preserved
            expect(result.filters.bedsMin).toBe('4') // Updated
            expect(result.filters.minPrice).toBe('500000') // Preserved from current filters
        })

        it('should handle empty currentFilters and history', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue(mockLLMParseResponse)
            }
            fetch.mockResolvedValue(mockResponse)

            const result = await service.parsePromptToFilters('Find homes in La Jolla')

            expect(result.filters.location).toBe('La Jolla, CA')
            expect(fetch).toHaveBeenCalledWith(
                'https://openrouter.ai/api/v1/chat/completions',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-openrouter-key',
                        'Content-Type': 'application/json'
                    })
                })
            )
        })

        it('should throw error on API failure', async () => {
            const mockResponse = {
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                json: vi.fn().mockResolvedValue(mockLLMErrorResponse)
            }
            fetch.mockResolvedValue(mockResponse)

            await expect(service.parsePromptToFilters('test prompt')).rejects.toThrow('Failed to parse prompt')
        })

        it('should throw error on network failure', async () => {
            fetch.mockRejectedValue(new Error('Network error'))

            await expect(service.parsePromptToFilters('test prompt')).rejects.toThrow('Failed to parse prompt')
        })

        it('should throw error on invalid LLM response', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: 'Invalid JSON response'
                        }
                    }]
                })
            }
            fetch.mockResolvedValue(mockResponse)

            await expect(service.parsePromptToFilters('test prompt')).rejects.toThrow('Invalid LLM response format')
        })

        it('should throw error on malformed JSON in response', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: '{"invalid": json}'
                        }
                    }]
                })
            }
            fetch.mockResolvedValue(mockResponse)

            await expect(service.parsePromptToFilters('test prompt')).rejects.toThrow('Invalid LLM response format')
        })
    })

    describe('_buildSystemPrompt', () => {
        it('should build system prompt with current filters', () => {
            const currentFilters = {
                location: 'San Diego, CA',
                minPrice: '500000',
                bedsMin: '3'
            }

            const prompt = service._buildSystemPrompt(currentFilters)

            expect(prompt).toContain('You are a conversational real estate search assistant')
            expect(prompt).toContain('Current active filters:')
            expect(prompt).toContain('"location": "San Diego, CA"')
            expect(prompt).toContain('"minPrice": "500000"')
            expect(prompt).toContain('"bedsMin": "3"')
        })

        it('should build system prompt without current filters', () => {
            const prompt = service._buildSystemPrompt({})

            expect(prompt).toContain('You are a conversational real estate search assistant')
            expect(prompt).not.toContain('Current active filters:')
        })
    })

    describe('_parseLLMResponse', () => {
        it('should parse valid JSON response', () => {
            const content = JSON.stringify({
                filters: {
                    location: 'La Jolla, CA',
                    bedsMin: '3'
                },
                message: 'Found 3+ bedroom homes'
            })

            const result = service._parseLLMResponse(content, { location: 'San Diego, CA' })

            expect(result.filters.location).toBe('La Jolla, CA')
            expect(result.filters.bedsMin).toBe('3')
            expect(result.message).toBe('Found 3+ bedroom homes')
        })

        it('should preserve current location when not in response', () => {
            const content = JSON.stringify({
                filters: { bedsMin: '3' },
                message: 'Found homes'
            })

            const result = service._parseLLMResponse(content, { location: 'San Diego, CA' })

            expect(result.filters.location).toBe('San Diego, CA')
            expect(result.filters.bedsMin).toBe('3')
        })

        it('should use default location when no current or response location', () => {
            const content = JSON.stringify({
                filters: { bedsMin: '3' },
                message: 'Found homes'
            })

            const result = service._parseLLMResponse(content, {})

            expect(result.filters.location).toBe('Aptos, CA')
            expect(result.filters.bedsMin).toBe('3')
        })

        it('should extract JSON from mixed content', () => {
            const content = `Here's what I found:
{
  "filters": {
    "location": "La Jolla, CA",
    "bedsMin": "3"
  },
  "message": "Found 3+ bedroom homes"
}
That should work for you!`

            const result = service._parseLLMResponse(content)

            expect(result.filters.location).toBe('La Jolla, CA')
            expect(result.filters.bedsMin).toBe('3')
            expect(result.message).toBe('Found 3+ bedroom homes')
        })

        it('should throw error on missing JSON', () => {
            const content = 'No JSON here, just plain text'

            expect(() => service._parseLLMResponse(content)).toThrow('No JSON found in LLM response')
        })

        it('should throw error on invalid JSON structure', () => {
            const content = '{"invalid": "structure"}'

            expect(() => service._parseLLMResponse(content)).toThrow('Invalid response structure')
        })
    })

    describe('getAvailableModels', () => {
        it('should successfully fetch available models', async () => {
            const mockResponse = {
                ok: true,
                json: vi.fn().mockResolvedValue(mockLLMModelsResponse)
            }
            fetch.mockResolvedValue(mockResponse)

            const models = await service.getAvailableModels()

            expect(fetch).toHaveBeenCalledWith(
                'https://openrouter.ai/api/v1/models',
                expect.objectContaining({
                    headers: { 'Authorization': 'Bearer test-openrouter-key' }
                })
            )
            expect(models).toEqual(mockLLMModelsResponse.data)
        })

        it('should return empty array on API failure', async () => {
            const mockResponse = {
                ok: false,
                status: 500
            }
            fetch.mockResolvedValue(mockResponse)

            const models = await service.getAvailableModels()

            expect(models).toEqual([])
        })

        it('should return empty array on network failure', async () => {
            fetch.mockRejectedValue(new Error('Network error'))

            const models = await service.getAvailableModels()

            expect(models).toEqual([])
        })
    })
})
