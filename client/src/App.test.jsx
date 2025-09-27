import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock window event listeners
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()
Object.defineProperty(window, 'addEventListener', {
    writable: true,
    value: mockAddEventListener
})
Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    value: mockRemoveEventListener
})

describe('App', () => {
    beforeEach(() => {
        mockFetch.mockClear()
        mockAddEventListener.mockClear()
        mockRemoveEventListener.mockClear()

        // Reset fetch mock to default successful response
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ items: [] })
        })
    })

    it('renders the main application layout', () => {
        render(<App />)

        expect(screen.getByText('Coastal Compass')).toBeInTheDocument()
        expect(screen.getByAltText('Coastal Compass logo')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')).toBeInTheDocument()
    })

    it('sets up event listeners on mount', () => {
        render(<App />)

        expect(mockAddEventListener).toHaveBeenCalledWith('retrySearch', expect.any(Function))
        expect(mockAddEventListener).toHaveBeenCalledWith('retryConversation', expect.any(Function))
    })

    it('cleans up event listeners on unmount', () => {
        const { unmount } = render(<App />)

        unmount()

        expect(mockRemoveEventListener).toHaveBeenCalledWith('retrySearch', expect.any(Function))
        expect(mockRemoveEventListener).toHaveBeenCalledWith('retryConversation', expect.any(Function))
    })

    it('handles conversation submission successfully', async () => {
        const mockParseResponse = {
            message: 'Found 3 bedroom homes',
            filters: { bedsMin: '3', location: 'San Diego, CA' }
        }

        const mockSearchResponse = {
            items: [
                {
                    id: '1',
                    address: '123 Main St',
                    price: 750000,
                    beds: 3,
                    baths: 2
                }
            ]
        }

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockParseResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResponse)
            })

        render(<App />)

        // Find the conversation input and submit
        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Show me 3 bedroom homes in San Diego' } })
        fireEvent.click(submitButton)

        // Wait for the conversation to be processed
        await waitFor(() => {
            expect(screen.getByText('Show me 3 bedroom homes in San Diego')).toBeInTheDocument()
        })

        // Check that both API calls were made
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/parse-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Show me 3 bedroom homes in San Diego',
                currentFilters: expect.any(Object),
                history: []
            })
        })

        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/search?bedsMin=3&location=San%20Diego%2C%20CA&sort=Price_High_Low')
    })

    it('handles conversation parsing errors', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: 'Bad Request'
        })

        render(<App />)

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Invalid request' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Invalid request')).toBeInTheDocument()
        })

        // Should show error message
        await waitFor(() => {
            expect(screen.getByText("I don't understand that request. Try something like \"3 bedroom homes under $2M\" or \"Beach properties in Aptos\".")).toBeInTheDocument()
        })
    })

    it('handles search API errors', async () => {
        const mockParseResponse = {
            message: 'Found homes',
            filters: { location: 'San Diego, CA' }
        }

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockParseResponse)
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            })

        render(<App />)

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Show me homes' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Property search failed. Please try again.')).toBeInTheDocument()
        })
    })

    it('handles traditional search', async () => {
        const mockSearchResponse = {
            items: [
                {
                    id: '1',
                    address: '123 Main St',
                    price: 750000,
                    beds: 3,
                    baths: 2
                }
            ]
        }

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockSearchResponse)
        })

        render(<App />)

        // Find and click the search button in the filter panel
        const searchButton = screen.getByText('Search')
        fireEvent.click(searchButton)

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/search?location=Aptos%2C%20CA&sort=Price_High_Low')
        })
    })

    it('highlights changed filters', async () => {
        render(<App />)

        // Initially no highlighted filters
        expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument()

        // Simulate filter change through conversation
        const mockParseResponse = {
            message: 'Updated location',
            filters: { location: 'La Jolla, CA' }
        }

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockParseResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ items: [] })
            })

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Change location to La Jolla' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Active Filters:')).toBeInTheDocument()
            expect(screen.getByText('Location: La Jolla, CA')).toBeInTheDocument()
        })

        // Check that the changed filter is highlighted
        const locationFilter = screen.getByText('Location: La Jolla, CA')
        expect(locationFilter).toHaveClass('animate-pulse')
        expect(locationFilter).toHaveClass('bg-warm-coral')
    })

    it('removes filter highlights after 3 seconds', async () => {
        vi.useFakeTimers()

        render(<App />)

        // Simulate filter change
        const mockParseResponse = {
            message: 'Updated location',
            filters: { location: 'La Jolla, CA' }
        }

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockParseResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ items: [] })
            })

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Change location to La Jolla' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            const locationFilter = screen.getByText('Location: La Jolla, CA')
            expect(locationFilter).toHaveClass('animate-pulse')
        })

        // Fast-forward 3 seconds
        vi.advanceTimersByTime(3000)

        await waitFor(() => {
            const locationFilter = screen.getByText('Location: La Jolla, CA')
            expect(locationFilter).not.toHaveClass('animate-pulse')
            expect(locationFilter).not.toHaveClass('bg-warm-coral')
        })

        vi.useRealTimers()
    })

    it('handles retry search event', () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ items: [] })
        })

        render(<App />)

        // Get the retry search handler that was registered
        const retrySearchCall = mockAddEventListener.mock.calls.find(
            call => call[0] === 'retrySearch'
        )
        const retrySearchHandler = retrySearchCall[1]

        // Trigger the retry event
        retrySearchHandler()

        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/search?location=Aptos%2C%20CA&sort=Price_High_Low')
    })

    it('handles retry conversation event', () => {
        render(<App />)

        // First set a conversation error
        // This is tricky to test directly, but we can verify the handler is set up
        const retryConversationCall = mockAddEventListener.mock.calls.find(
            call => call[0] === 'retryConversation'
        )
        expect(retryConversationCall).toBeDefined()

        const retryConversationHandler = retryConversationCall[1]
        retryConversationHandler()

        // The handler should clear conversation error
        // This would be tested by checking that conversationError state is cleared
    })

    it('preserves existing properties on conversation error', async () => {
        // First, successfully load some properties
        const mockSearchResponse = {
            items: [
                {
                    id: '1',
                    address: '123 Main St',
                    price: 750000,
                    beds: 3,
                    baths: 2
                }
            ]
        }

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockSearchResponse)
        })

        render(<App />)

        // Trigger a successful search first
        const searchButton = screen.getByText('Search')
        fireEvent.click(searchButton)

        await waitFor(() => {
            expect(screen.getByText('Found 1 property')).toBeInTheDocument()
        })

        // Now trigger a conversation that fails
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400
        })

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Invalid request' } })
        fireEvent.click(submitButton)

        // Properties should still be displayed
        await waitFor(() => {
            expect(screen.getByText('Found 1 property')).toBeInTheDocument()
        })
    })

    it('builds correct search query parameters', async () => {
        const mockSearchResponse = { items: [] }
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockSearchResponse)
        })

        render(<App />)

        // The default search should include location and sort
        const searchButton = screen.getByText('Search')
        fireEvent.click(searchButton)

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/search?location=Aptos%2C%20CA&sort=Price_High_Low')
        })
    })

    it('filters out empty filter values in search query', async () => {
        const mockSearchResponse = { items: [] }
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockSearchResponse)
        })

        render(<App />)

        // Default filters should only include non-empty values
        const searchButton = screen.getByText('Search')
        fireEvent.click(searchButton)

        await waitFor(() => {
            const call = mockFetch.mock.calls[0][0]
            expect(call).toBe('http://localhost:3001/api/search?location=Aptos%2C%20CA&sort=Price_High_Low')
            // Should not include empty minPrice, maxPrice, etc.
        })
    })
})
