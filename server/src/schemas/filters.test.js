import { describe, it, expect } from 'vitest'
import { filterSchema, parsePromptRequestSchema } from './filters.js'

describe('Filter Schemas', () => {
    describe('filterSchema', () => {
        it('should validate valid filter object', () => {
            const validFilters = {
                location: 'San Diego, CA',
                minPrice: '500000',
                maxPrice: '1000000',
                home_type: 'Single Family',
                bedsMin: '3',
                bathsMin: '2',
                sqftMin: '1500',
                sqftMax: '3000',
                sort: 'Price_High_Low'
            }

            const result = filterSchema.safeParse(validFilters)
            expect(result.success).toBe(true)
            expect(result.data).toEqual(validFilters)
        })

        it('should reject empty location string', () => {
            const filtersWithEmptyLocation = {
                location: '', // empty string should fail
                minPrice: '',
                maxPrice: '',
                sort: 'Price_High_Low'
            }

            const result = filterSchema.safeParse(filtersWithEmptyLocation)
            expect(result.success).toBe(false)
        })

        it('should reject invalid sort value', () => {
            const invalidFilters = {
                location: 'San Diego, CA',
                sort: 'Invalid_Sort'
            }

            const result = filterSchema.safeParse(invalidFilters)
            expect(result.success).toBe(false)
        })

        it('should accept any string values for optional fields', () => {
            const filtersWithAnyStrings = {
                location: 'San Diego, CA',
                minPrice: 'not-a-number', // strings are accepted as-is
                maxPrice: 'free',
                sort: 'Price_High_Low'
            }

            const result = filterSchema.safeParse(filtersWithAnyStrings)
            expect(result.success).toBe(true)
            expect(result.data.minPrice).toBe('not-a-number')
        })
    })

    describe('parsePromptRequestSchema', () => {
        it('should validate valid parse prompt request and apply defaults to currentFilters', () => {
            const validRequest = {
                prompt: 'Show me 3 bedroom homes in La Jolla',
                currentFilters: {
                    location: 'San Diego, CA',
                    minPrice: '',
                    maxPrice: '',
                    bedsMin: '2'
                    // sort will be added by default
                },
                history: [
                    { role: 'user', content: 'Hello' },
                    { role: 'assistant', content: 'Hi there!' }
                ]
            }

            const result = parsePromptRequestSchema.safeParse(validRequest)
            expect(result.success).toBe(true)
            expect(result.data.prompt).toBe('Show me 3 bedroom homes in La Jolla')
            expect(result.data.currentFilters.location).toBe('San Diego, CA')
            expect(result.data.currentFilters.sort).toBe('Price_High_Low') // default applied
        })

        it('should validate request with empty history', () => {
            const requestWithEmptyHistory = {
                prompt: 'Find homes under $1M',
                currentFilters: {},
                history: []
            }

            const result = parsePromptRequestSchema.safeParse(requestWithEmptyHistory)
            expect(result.success).toBe(true)
        })

        it('should reject request without prompt', () => {
            const invalidRequest = {
                currentFilters: {},
                history: []
            }

            const result = parsePromptRequestSchema.safeParse(invalidRequest)
            expect(result.success).toBe(false)
        })

        it('should accept any string values for history roles', () => {
            const requestWithAnyRole = {
                prompt: 'Find homes',
                currentFilters: {},
                history: [
                    { role: 'any-string-works', content: 'test' }
                ]
            }

            const result = parsePromptRequestSchema.safeParse(requestWithAnyRole)
            expect(result.success).toBe(true)
        })
    })
})
