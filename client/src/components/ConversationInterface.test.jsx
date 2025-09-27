import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ConversationInterface from './ConversationInterface'

// Mock conversation data in the format expected by the component
const mockConversationData = [
    {
        role: 'user',
        content: 'Show me 3 bedroom homes in San Diego',
        timestamp: new Date('2025-01-01T10:00:00Z')
    },
    {
        role: 'assistant',
        content: 'I found 3 bedroom homes in San Diego. Here are the current filters: location: San Diego, CA, beds: 3',
        timestamp: new Date('2025-01-01T10:01:00Z')
    },
    {
        role: 'user',
        content: 'Under $800k',
        timestamp: new Date('2025-01-01T10:01:00Z')
    },
    {
        role: 'assistant',
        content: 'Updated price range to under $800,000. Here are the current filters: location: San Diego, CA, beds: 3, maxPrice: 800000',
        timestamp: new Date('2025-01-01T10:02:00Z')
    }
]

// Mock scroll behavior
const mockScrollTo = vi.fn()
Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    get: () => 0,
    set: mockScrollTo
})
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    get: () => 100
})

describe('ConversationInterface', () => {
    const mockOnSubmit = vi.fn()
    const mockOnReset = vi.fn()

    beforeEach(() => {
        mockOnSubmit.mockClear()
        mockOnReset.mockClear()
        mockScrollTo.mockClear()
    })

    it('renders conversation history', () => {
        render(
            <ConversationInterface
                conversation={mockConversationData}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        expect(screen.getByText('Show me 3 bedroom homes in San Diego')).toBeInTheDocument()
        expect(screen.getByText('I found 3 bedroom homes in San Diego. Here are the current filters: location: San Diego, CA, beds: 3')).toBeInTheDocument()
        expect(screen.getByText('Under $800k')).toBeInTheDocument()
        expect(screen.getByText('Updated price range to under $800,000. Here are the current filters: location: San Diego, CA, beds: 3, maxPrice: 800000')).toBeInTheDocument()
    })

    it('renders input field and submit button', () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        expect(screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')).toBeInTheDocument()
        expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('calls onSubmit when form is submitted', async () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Show me condos in La Jolla' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Show me condos in La Jolla')
        })
    })

    it('calls onSubmit when Enter key is pressed', async () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')

        fireEvent.change(input, { target: { value: 'Show me condos in La Jolla' } })
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Show me condos in La Jolla')
        })
    })

    it('does not call onSubmit when other keys are pressed', () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')

        fireEvent.change(input, { target: { value: 'Show me condos in La Jolla' } })
        fireEvent.keyDown(input, { key: 'Space', code: 'Space' })

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('clears input after successful submission', async () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: 'Show me condos in La Jolla' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(input.value).toBe('')
        })
    })

    it('shows loading state and disables input/button', () => {
        render(
            <ConversationInterface
                conversation={mockConversationData}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={true}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByRole('button', { name: /Understanding/ })

        expect(input).toBeDisabled()
        expect(submitButton).toBeDisabled()
    })

    it('displays error messages', () => {
        const errorMessage = 'Failed to process request'
        render(
            <ConversationInterface
                conversation={mockConversationData}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={errorMessage}
            />
        )

        expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('auto-scrolls to bottom when conversation updates', () => {
        const { rerender } = render(
            <ConversationInterface
                conversation={mockConversationData}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        // Should scroll when component mounts with history
        expect(mockScrollTo).toHaveBeenCalledWith(100)

        // Reset mock
        mockScrollTo.mockClear()

        // Update with new history
        const newHistory = [
            ...mockConversationData,
            {
                role: 'user',
                content: 'New message',
                timestamp: new Date().toISOString()
            }
        ]

        rerender(
            <ConversationInterface
                conversation={newHistory}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        expect(mockScrollTo).toHaveBeenCalledWith(100)
    })

    it('handles empty conversation history', () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        expect(screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')).toBeInTheDocument()
        expect(screen.queryByText('Show me')).not.toBeInTheDocument()
    })

    it('prevents submission of empty messages', () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const submitButton = screen.getByText('Search')
        fireEvent.click(submitButton)

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('prevents submission of whitespace-only messages', () => {
        render(
            <ConversationInterface
                conversation={[]}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
                loading={false}
                disabled={false}
                error={null}
            />
        )

        const input = screen.getByPlaceholderText('Tell me what you\'re looking for... (e.g., \'3 bedroom homes under $2M\')')
        const submitButton = screen.getByText('Search')

        fireEvent.change(input, { target: { value: '   ' } })
        fireEvent.click(submitButton)

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })
})
