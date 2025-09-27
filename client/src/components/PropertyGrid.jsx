import PropertyCard from './PropertyCard'

const formatFilterLabel = (key, value) => {
    const labels = {
        location: 'Location',
        minPrice: 'Min Price',
        maxPrice: 'Max Price',
        home_type: 'Property Type',
        bedsMin: 'Bedrooms',
        bathsMin: 'Bathrooms',
        sqftMin: 'Min SqFt',
        sqftMax: 'Max SqFt',
        sort: 'Sort By'
    }

    const label = labels[key] || key

    if (value === '' || value === null || value === undefined) return null

    // Format value
    if (key === 'minPrice' || key === 'maxPrice') {
        return `${label}: $${value.toLocaleString()}`
    }
    if (key === 'sqftMin' || key === 'sqftMax') {
        return `${label}: ${value} SqFt`
    }
    if (key === 'bedsMin' || key === 'bathsMin') {
        return `${label}: ${value}+`
    }
    if (key === 'home_type') {
        const typeLabels = {
            Houses: 'Single Family Homes',
            Townhomes: 'Townhomes',
            'Multi-family': 'Multi-Family',
            Apartments: 'Apartments',
            Manufactured: 'Manufactured Homes',
            Condos: 'Condos',
            LotsLand: 'Lots & Land'
        }
        return `${label}: ${typeLabels[value] || value}`
    }
    if (key === 'sort') {
        const sortLabels = {
            Price_High_Low: 'Price: High to Low',
            Price_Low_High: 'Price: Low to High',
            Square_Feet: 'SqFt: High to Low',
            Newest: 'Newest First',
            Bedrooms: 'Bedrooms: High to Low',
            Bathrooms: 'Bathrooms: High to Low',
            Lot_Size: 'Lot Size: High to Low'
        }
        return `${label}: ${sortLabels[value] || value}`
    }
    return `${label}: ${value}`
}

// Keyword display mapping
const KEYWORD_DISPLAY_MAP = {
    pool: "Pool",
    waterfront: "Waterfront",
    singleStory: "Single Story",
    newConstruction: "New Construction",
    garage: "Garage",
    fireplace: "Fireplace",
    basement: "Basement",
    adu: "ADU/Guest House",
    guestHouse: "Guest House",
    solar: "Solar Panels",
    view: "View",
    fixer: "Fixer-Upper",
    openFloorPlan: "Open Floor Plan",
    garden: "Garden/Landscaped"
};

export default function PropertyGrid({ properties, loading, filters, changedFilters = new Set(), error }) {
    // Check if there are any active filters to display
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === 'location' && value === 'Aptos, CA') return false // Default location
        if (key === 'sort' && value === 'Price_High_Low') return false // Default sort
        if (key === 'keywords' && (!Array.isArray(value) || value.length === 0)) return false // Empty keywords array
        return value !== '' && value !== null && value !== undefined
    })

    // Error state
    if (error) {
        return (
            <div className="text-center py-15 px-5">
                <div className="text-6xl mb-5">⚠️</div>
                <div className="text-blue-teal text-lg mb-2">Search Error</div>
                <div className="text-gray-600 text-sm mb-4">{error}</div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-warm-coral transition-colors"
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => {
                            // Trigger a new search with current filters
                            const event = new CustomEvent('retrySearch')
                            window.dispatchEvent(event)
                        }}
                        className="bg-sage-green text-blue-teal px-4 py-2 rounded-lg text-sm border border-teal-border hover:bg-sage-green/80 transition-colors"
                    >
                        Retry Search
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 md:gap-6 py-5">
                {/* Loading Skeletons */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-sage-green border border-teal-border rounded-2xl shadow-lg overflow-hidden animate-pulse">
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <div className="w-15 h-15 bg-gray-300 rounded-lg"></div>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="h-2.5 bg-gray-200 rounded w-2/5"></div>
                            <div className="h-4.5 bg-gray-200 rounded w-4/5"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                            <div className="h-3.5 bg-gray-200 rounded w-7/10"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!properties || properties.length === 0) {
        return (
            <div className="text-center py-15 px-5 text-blue-teal text-lg">
                <div className="text-6xl mb-5">🏠</div>
                <div>No properties found matching your criteria.</div>
                <div className="text-sm mt-2 text-teal-border">
                    Try adjusting your search filters to see more results.
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="mb-4">
                    <h2 className="text-blue-teal text-lg font-medium mb-2 tracking-tight">
                        Active Filters:
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(([key, value]) => {
                            // Handle keywords separately - display each keyword as individual tag
                            if (key === 'keywords' && Array.isArray(value) && value.length > 0) {
                                return value.map(keyword => (
                                    <span
                                        key={`keyword-${keyword}`}
                                        className={`bg-sage-green text-blue-teal px-2 py-1 rounded text-xs transition-all duration-300 ${changedFilters.has(key) ? 'animate-pulse bg-warm-coral text-white' : ''
                                            }`}
                                    >
                                        {KEYWORD_DISPLAY_MAP[keyword] || keyword}
                                    </span>
                                ))
                            }

                            const formatted = formatFilterLabel(key, value)
                            const isChanged = changedFilters.has(key)
                            return formatted ? (
                                <span
                                    key={key}
                                    className={`bg-sage-green text-blue-teal px-2 py-1 rounded text-xs transition-all duration-300 ${isChanged ? 'animate-pulse bg-warm-coral text-white' : ''
                                        }`}
                                >
                                    {formatted}
                                </span>
                            ) : null
                        })}
                    </div>
                </div>
            )}

            {/* Results Count */}
            <h2 className="mb-5 text-blue-teal text-lg font-medium tracking-tight">
                Found {properties.length} propert
                {properties.length === 1 ? 'y' : 'ies'}
            </h2>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 md:gap-6 py-5">
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    )
}
