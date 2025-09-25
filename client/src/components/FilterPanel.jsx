import { useState } from 'react'

const PROPERTY_TYPES = [
    { value: '', label: 'Any Type' },
    { value: 'Houses', label: 'Houses' },
    { value: 'Townhomes', label: 'Townhomes' },
    { value: 'Apartments_Condos_Co-ops', label: 'Apartments/Condos/Co-ops' },
    { value: 'Multi-family', label: 'Multi-family' },
    { value: 'LotsLand', label: 'Lots/Land' },
    { value: 'Manufactured', label: 'Manufactured' }
]

const BEDROOM_OPTIONS = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
]

const BATHROOM_OPTIONS = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '1.5', label: '1.5+' },
    { value: '2', label: '2+' },
    { value: '2.5', label: '2.5+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
]

const PRICE_MIN_OPTIONS = [
    { value: '', label: 'Any' },
    { value: '100000', label: '$100,000' },
    { value: '200000', label: '$200,000' },
    { value: '300000', label: '$300,000' },
    { value: '400000', label: '$400,000' },
    { value: '500000', label: '$500,000' },
    { value: '600000', label: '$600,000' },
    { value: '700000', label: '$700,000' },
    { value: '800000', label: '$800,000' },
    { value: '900000', label: '$900,000' },
    { value: '1000000', label: '$1,000,000' },
    { value: '1250000', label: '$1,250,000' },
    { value: '1500000', label: '$1,500,000' },
    { value: '1750000', label: '$1,750,000' },
    { value: '2000000', label: '$2,000,000' },
    { value: '2500000', label: '$2,500,000' },
    { value: '3000000', label: '$3,000,000' },
    { value: '4000000', label: '$4,000,000' },
    { value: '5000000', label: '$5,000,000+' }
]

const PRICE_MAX_OPTIONS = [
    { value: '', label: 'Any' },
    { value: '200000', label: '$200,000' },
    { value: '250000', label: '$250,000' },
    { value: '300000', label: '$300,000' },
    { value: '400000', label: '$400,000' },
    { value: '500000', label: '$500,000' },
    { value: '600000', label: '$600,000' },
    { value: '700000', label: '$700,000' },
    { value: '800000', label: '$800,000' },
    { value: '900000', label: '$900,000' },
    { value: '1000000', label: '$1,000,000' },
    { value: '1250000', label: '$1,250,000' },
    { value: '1500000', label: '$1,500,000' },
    { value: '1750000', label: '$1,750,000' },
    { value: '2000000', label: '$2,000,000' },
    { value: '2500000', label: '$2,500,000' },
    { value: '3000000', label: '$3,000,000' },
    { value: '4000000', label: '$4,000,000' },
    { value: '5000000', label: '$5,000,000+' }
]

const SORT_OPTIONS = [
    { value: 'Price_High_Low', label: 'Price: High to Low' },
    { value: 'Price_Low_High', label: 'Price: Low to High' },
    { value: 'Square_Feet', label: 'SqFt: High to Low' },
    { value: 'Newest', label: 'Newest First' },
    { value: 'Bedrooms', label: 'Bedrooms: High to Low' },
    { value: 'Bathrooms', label: 'Bathrooms: High to Low' },
    { value: 'Lot_Size', label: 'Lot Size: High to Low' }
]

export default function FilterPanel({ filters, onFiltersChange, onSearch, loading }) {
    const updateFilter = (key, value) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    return (
        <div className="bg-sage-green border border-teal-border rounded-2xl p-4 shadow-lg mb-6 font-['Poppins']">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Location
                    </label>
                    <input
                        type="text"
                        value={filters.location || ''}
                        onChange={(e) => updateFilter('location', e.target.value)}
                        placeholder="City, State or ZIP"
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Min Price
                    </label>
                    <select
                        value={filters.minPrice || ''}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {PRICE_MIN_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Max Price
                    </label>
                    <select
                        value={filters.maxPrice || ''}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {PRICE_MAX_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Property Type
                    </label>
                    <select
                        value={filters.home_type || ''}
                        onChange={(e) => updateFilter('home_type', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {PROPERTY_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Bedrooms
                    </label>
                    <select
                        value={filters.bedsMin || ''}
                        onChange={(e) => updateFilter('bedsMin', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {BEDROOM_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Bathrooms
                    </label>
                    <select
                        value={filters.bathsMin || ''}
                        onChange={(e) => updateFilter('bathsMin', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {BATHROOM_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Min SqFt
                    </label>
                    <input
                        type="text"
                        value={filters.sqftMin || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateFilter('sqftMin', value)
                        }}
                        placeholder="No min"
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Max SqFt
                    </label>
                    <input
                        type="text"
                        value={filters.sqftMax || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            updateFilter('sqftMax', value)
                        }}
                        placeholder="No max"
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1 text-blue-teal">
                        Sort By
                    </label>
                    <select
                        value={filters.sort || 'Price_High_Low'}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="w-full px-3 py-2 border border-teal-border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-warm-coral"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="text-right">
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="bg-blue-teal text-white px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-warm-coral transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </div>
    )
}
