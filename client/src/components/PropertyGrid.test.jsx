import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import PropertyGrid from './PropertyGrid'
import { mockProperties, mockFilters } from '../../test/fixtures/mockProperties'

// Mock window methods
const mockDispatchEvent = vi.fn()
const mockReload = vi.fn()

Object.defineProperty(window, 'dispatchEvent', {
    writable: true,
    value: mockDispatchEvent
})

Object.defineProperty(window.location, 'reload', {
    writable: true,
    value: mockReload
})

describe('PropertyGrid', () => {
    beforeEach(() => {
        mockDispatchEvent.mockClear()
        mockReload.mockClear()
    })

    it('renders loading skeletons when loading is true', () => {
        render(
            <PropertyGrid
                properties={[]}
                loading={true}
                filters={mockFilters}
                changedFilters={new Set()}
                error={null}
            />
        )

        // Should render 6 skeleton cards
        const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
            element => element.className.includes('animate-pulse')
        )
        expect(skeletons).toHaveLength(6)
    })

    it('renders error state when error is provided', () => {
        const errorMessage = 'Failed to fetch properties'
        render(
            <PropertyGrid
                properties={[]}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error={errorMessage}
            />
        )

        expect(screen.getByText('Search Error')).toBeInTheDocument()
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
        expect(screen.getByText('Reload Page')).toBeInTheDocument()
        expect(screen.getByText('Retry Search')).toBeInTheDocument()
    })

    it('calls window.location.reload when reload button is clicked', () => {
        render(
            <PropertyGrid
                properties={[]}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error="Error occurred"
            />
        )

        const reloadButton = screen.getByText('Reload Page')
        fireEvent.click(reloadButton)

        expect(mockReload).toHaveBeenCalledTimes(1)
    })

    it('dispatches retrySearch event when retry button is clicked', () => {
        render(
            <PropertyGrid
                properties={[]}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error="Error occurred"
            />
        )

        const retryButton = screen.getByText('Retry Search')
        fireEvent.click(retryButton)

        expect(mockDispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('retrySearch')
        )
    })

    it('renders empty state when no properties found', () => {
        render(
            <PropertyGrid
                properties={[]}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('No properties found matching your criteria.')).toBeInTheDocument()
        expect(screen.getByText('Try adjusting your search filters to see more results.')).toBeInTheDocument()
    })

    it('renders properties when provided', () => {
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Found 2 properties')).toBeInTheDocument()
        expect(screen.getByText('123 Main St')).toBeInTheDocument()
        expect(screen.getByText('456 Oak Ave')).toBeInTheDocument()
    })

    it('renders singular "property" when only one result', () => {
        render(
            <PropertyGrid
                properties={[mockProperties[0]]}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Found 1 property')).toBeInTheDocument()
    })

    it('renders active filters when filters are applied', () => {
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={mockFilters}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Active Filters:')).toBeInTheDocument()
        expect(screen.getByText('Location: San Diego, CA')).toBeInTheDocument()
        expect(screen.getByText('Min Price: $500,000')).toBeInTheDocument()
        expect(screen.getByText('Max Price: $1,000,000')).toBeInTheDocument()
        expect(screen.getByText('Bedrooms: 3+')).toBeInTheDocument()
        expect(screen.getByText('Bathrooms: 2+')).toBeInTheDocument()
    })

    it('does not render active filters section when no filters are applied', () => {
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={{}}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument()
    })

    it('highlights changed filters with animation and color', () => {
        const changedFilters = new Set(['location', 'minPrice'])
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={mockFilters}
                changedFilters={changedFilters}
                error={null}
            />
        )

        const locationFilter = screen.getByText('Location: San Diego, CA')
        const minPriceFilter = screen.getByText('Min Price: $500,000')

        // Check that changed filters have the animation class
        expect(locationFilter).toHaveClass('animate-pulse')
        expect(locationFilter).toHaveClass('bg-warm-coral')
        expect(locationFilter).toHaveClass('text-white')

        expect(minPriceFilter).toHaveClass('animate-pulse')
        expect(minPriceFilter).toHaveClass('bg-warm-coral')
        expect(minPriceFilter).toHaveClass('text-white')
    })

    it('formats property type filters correctly', () => {
        const filtersWithPropertyType = {
            ...mockFilters,
            home_type: 'Apartments_Condos_Co-ops'
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithPropertyType}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Property Type: Apartments/Condos/Co-ops')).toBeInTheDocument()
    })

    it('formats sort filters correctly', () => {
        const filtersWithSort = {
            ...mockFilters,
            sort: 'Price_Low_High'
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithSort}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Sort By: Price: Low to High')).toBeInTheDocument()
    })

    it('formats sqft filters correctly', () => {
        const filtersWithSqft = {
            ...mockFilters,
            sqftMin: '1500',
            sqftMax: '2500'
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithSqft}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Min SqFt: 1500 SqFt')).toBeInTheDocument()
        expect(screen.getByText('Max SqFt: 2500 SqFt')).toBeInTheDocument()
    })

    it('ignores default location filter', () => {
        const filtersWithDefaultLocation = {
            location: 'Aptos, CA' // This should be ignored as default
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithDefaultLocation}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument()
    })

    it('ignores default sort filter', () => {
        const filtersWithDefaultSort = {
            sort: 'Price_High_Low' // This should be ignored as default
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithDefaultSort}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument()
    })

    it('handles null or undefined filter values', () => {
        const filtersWithNulls = {
            location: 'San Diego, CA',
            minPrice: null,
            maxPrice: undefined,
            bedsMin: ''
        }
        render(
            <PropertyGrid
                properties={mockProperties}
                loading={false}
                filters={filtersWithNulls}
                changedFilters={new Set()}
                error={null}
            />
        )

        expect(screen.getByText('Location: San Diego, CA')).toBeInTheDocument()
        expect(screen.queryByText(/Min Price/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Max Price/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Bedrooms/)).not.toBeInTheDocument()
    })
})
