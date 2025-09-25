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
            Houses: 'Houses',
            Townhomes: 'Townhomes',
            'Apartments_Condos_Co-ops': 'Apartments/Condos/Co-ops',
            'Multi-family': 'Multi-family',
            LotsLand: 'Lots/Land',
            Manufactured: 'Manufactured'
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

export default function PropertyGrid({ properties, loading, filters }) {
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
            <div className="mb-5">
                <h3 className="text-blue-teal text-base font-medium mb-2">
                    Active Filters:
                </h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        const formatted = formatFilterLabel(key, value)
                        return formatted ? (
                            <span key={key} className="bg-sage-green text-blue-teal px-2 py-1 rounded text-xs">
                                {formatted}
                            </span>
                        ) : null
                    })}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-5 text-blue-teal text-base font-medium">
                Found {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 md:gap-6 py-5">
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    )
}
