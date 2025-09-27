import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FilterPanel from './FilterPanel'
import { mockFilters } from '../../test/fixtures/mockProperties'

describe('FilterPanel', () => {
    const mockOnFiltersChange = vi.fn()
    const mockOnSearch = vi.fn()

    beforeEach(() => {
        mockOnFiltersChange.mockClear()
        mockOnSearch.mockClear()
    })

    it('renders all filter inputs', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        expect(screen.getByLabelText('Location')).toBeInTheDocument()
        expect(screen.getByLabelText('Min Price')).toBeInTheDocument()
        expect(screen.getByLabelText('Max Price')).toBeInTheDocument()
        expect(screen.getByLabelText('Property Type')).toBeInTheDocument()
        expect(screen.getByLabelText('Bedrooms')).toBeInTheDocument()
        expect(screen.getByLabelText('Bathrooms')).toBeInTheDocument()
        expect(screen.getByLabelText('Min SqFt')).toBeInTheDocument()
        expect(screen.getByLabelText('Max SqFt')).toBeInTheDocument()
        expect(screen.getByLabelText('Sort By')).toBeInTheDocument()
        expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('displays current filter values', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        expect(screen.getByDisplayValue('San Diego, CA')).toBeInTheDocument()
        expect(screen.getByDisplayValue('$500,000')).toBeInTheDocument()
        expect(screen.getByDisplayValue('$1,000,000')).toBeInTheDocument()
        expect(screen.getByDisplayValue('3+')).toBeInTheDocument()
        expect(screen.getByDisplayValue('2+')).toBeInTheDocument()
    })

    it('calls onFiltersChange when location input changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const locationInput = screen.getByLabelText('Location')
        fireEvent.change(locationInput, { target: { value: 'La Jolla, CA' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            location: 'La Jolla, CA'
        })
    })

    it('calls onFiltersChange when min price select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const minPriceSelect = screen.getByLabelText('Min Price')
        fireEvent.change(minPriceSelect, { target: { value: '600000' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            minPrice: '600000'
        })
    })

    it('calls onFiltersChange when max price select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const maxPriceSelect = screen.getByLabelText('Max Price')
        fireEvent.change(maxPriceSelect, { target: { value: '800000' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            maxPrice: '800000'
        })
    })

    it('calls onFiltersChange when property type select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const propertyTypeSelect = screen.getByLabelText('Property Type')
        fireEvent.change(propertyTypeSelect, { target: { value: 'Apartments_Condos_Co-ops' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            home_type: 'Apartments_Condos_Co-ops'
        })
    })

    it('calls onFiltersChange when bedrooms select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const bedroomsSelect = screen.getByLabelText('Bedrooms')
        fireEvent.change(bedroomsSelect, { target: { value: '4' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            bedsMin: '4'
        })
    })

    it('calls onFiltersChange when bathrooms select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const bathroomsSelect = screen.getByLabelText('Bathrooms')
        fireEvent.change(bathroomsSelect, { target: { value: '3' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            bathsMin: '3'
        })
    })

    it('calls onFiltersChange when min sqft input changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const minSqftInput = screen.getByLabelText('Min SqFt')
        fireEvent.change(minSqftInput, { target: { value: '2000' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            sqftMin: '2000'
        })
    })

    it('filters non-numeric characters from sqft inputs', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const minSqftInput = screen.getByLabelText('Min SqFt')
        fireEvent.change(minSqftInput, { target: { value: 'abc123def' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            sqftMin: '123'
        })
    })

    it('calls onFiltersChange when max sqft input changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const maxSqftInput = screen.getByLabelText('Max SqFt')
        fireEvent.change(maxSqftInput, { target: { value: '3500' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            sqftMax: '3500'
        })
    })

    it('calls onFiltersChange when sort select changes', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const sortSelect = screen.getByLabelText('Sort By')
        fireEvent.change(sortSelect, { target: { value: 'Price_Low_High' } })

        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            sort: 'Price_Low_High'
        })
    })

    it('calls onSearch when search button is clicked', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const searchButton = screen.getByText('Search')
        fireEvent.click(searchButton)

        expect(mockOnSearch).toHaveBeenCalledTimes(1)
    })

    it('shows loading state when loading is true', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={true}
            />
        )

        expect(screen.getByText('Searching...')).toBeInTheDocument()
        expect(screen.getByText('Searching...')).toBeDisabled()
    })

    it('handles empty filters object', () => {
        render(
            <FilterPanel
                filters={{}}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const locationInput = screen.getByLabelText('Location')
        expect(locationInput).toHaveValue('')
    })

    it('renders all property type options', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        const propertyTypeSelect = screen.getByLabelText('Property Type')
        expect(propertyTypeSelect).toHaveDisplayValue('Any Type')

        // Check that options are rendered
        expect(screen.getByText('Houses')).toBeInTheDocument()
        expect(screen.getByText('Apartments/Condos/Co-ops')).toBeInTheDocument()
        expect(screen.getByText('Multi-family')).toBeInTheDocument()
    })

    it('renders all sort options', () => {
        render(
            <FilterPanel
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onSearch={mockOnSearch}
                loading={false}
            />
        )

        expect(screen.getByText('Price: High to Low')).toBeInTheDocument()
        expect(screen.getByText('Price: Low to High')).toBeInTheDocument()
        expect(screen.getByText('SqFt: High to Low')).toBeInTheDocument()
        expect(screen.getByText('Newest First')).toBeInTheDocument()
    })
})
