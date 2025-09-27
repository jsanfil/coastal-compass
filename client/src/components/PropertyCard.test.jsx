import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import PropertyCard from './PropertyCard'
import { mockProperty } from '../../test/fixtures/mockProperties'

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(window, 'open', {
    writable: true,
    value: mockOpen
})

describe('PropertyCard', () => {
    beforeEach(() => {
        mockOpen.mockClear()
    })

    it('renders property information correctly', () => {
        render(<PropertyCard property={mockProperty} />)

        expect(screen.getByText('San Diego')).toBeInTheDocument()
        expect(screen.getByText('123 Main St')).toBeInTheDocument()
        expect(screen.getByText('$750,000')).toBeInTheDocument()
        expect(screen.getByText('3 bd • 2 ba • 1,800 sqft')).toBeInTheDocument()
        expect(screen.getByText('single family')).toBeInTheDocument()
        expect(screen.getByText('View on Zillow')).toBeInTheDocument()
    })

    it('displays image when imgSrc is provided', () => {
        render(<PropertyCard property={mockProperty} />)

        const image = screen.getByAltText('123 Main St, San Diego, CA')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('shows placeholder when no image is provided', () => {
        const propertyWithoutImage = { ...mockProperty, imgSrc: null }
        render(<PropertyCard property={propertyWithoutImage} />)

        expect(screen.getByText('No Image Available')).toBeInTheDocument()
        expect(screen.getByText('🏠')).toBeInTheDocument()
    })

    it('handles image load error gracefully', () => {
        render(<PropertyCard property={mockProperty} />)

        const image = screen.getByAltText('123 Main St, San Diego, CA')
        fireEvent.error(image)

        // After error, placeholder should be shown
        expect(screen.getByText('No Image Available')).toBeInTheDocument()
    })

    it('opens property link when card is clicked', () => {
        render(<PropertyCard property={mockProperty} />)

        const card = screen.getByText('123 Main St').closest('div')
        fireEvent.click(card)

        expect(mockOpen).toHaveBeenCalledWith('https://zillow.com/property/12345', '_blank')
    })

    it('opens property link when View on Zillow button is clicked', () => {
        render(<PropertyCard property={mockProperty} />)

        const button = screen.getByText('View on Zillow')
        fireEvent.click(button)

        expect(mockOpen).toHaveBeenCalledWith('https://zillow.com/property/12345', '_blank')
    })

    it('prevents event bubbling when button is clicked', () => {
        render(<PropertyCard property={mockProperty} />)

        const button = screen.getByText('View on Zillow')
        fireEvent.click(button)

        // Should only be called once (from button click, not card click)
        expect(mockOpen).toHaveBeenCalledTimes(1)
    })

    it('handles missing property data gracefully', () => {
        const incompleteProperty = {
            id: 'test',
            address: null,
            price: null,
            beds: null,
            baths: null,
            sqft: null
        }

        render(<PropertyCard property={incompleteProperty} />)

        expect(screen.getByText('Location')).toBeInTheDocument()
        expect(screen.getByText('Price TBD')).toBeInTheDocument()
        expect(screen.getByText('View on Zillow')).toBeInTheDocument()
    })

    it('formats price correctly', () => {
        const propertyWithPrice = { ...mockProperty, price: 1234567 }
        render(<PropertyCard property={propertyWithPrice} />)

        expect(screen.getByText('$1,234,567')).toBeInTheDocument()
    })

    it('formats square footage correctly', () => {
        const propertyWithSqft = { ...mockProperty, sqft: 2500 }
        render(<PropertyCard property={propertyWithSqft} />)

        expect(screen.getByText((content, element) => {
            return content.includes('2,500 sqft')
        })).toBeInTheDocument()
    })
})
