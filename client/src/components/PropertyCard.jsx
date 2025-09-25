export default function PropertyCard({ property }) {
    const formatPrice = (price) => {
        if (!price) return 'Price TBD'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const formatSqft = (sqft) => {
        if (!sqft) return ''
        return new Intl.NumberFormat('en-US').format(sqft)
    }

    return (
        <div
            className="bg-sage-green border border-teal-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
            onClick={() => property.permalink && window.open(property.permalink, '_blank')}
        >
            {/* Image */}
            <div className="w-full h-48 relative bg-gray-100 flex items-center justify-center overflow-hidden">
                {property.imgSrc ? (
                    <img
                        src={property.imgSrc}
                        alt={property.address}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                        }}
                    />
                ) : null}
                <div className={`flex-col items-center justify-center text-gray-500 text-sm text-center p-5 ${property.imgSrc ? 'hidden' : 'flex'}`}>
                    <div className="text-5xl mb-2">🏠</div>
                    <div>No Image Available</div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
                {/* Location */}
                <div className="text-xs uppercase tracking-wider text-blue-teal font-medium">
                    {property.address?.split(',')[1]?.trim() || 'Location'}
                </div>

                {/* Title/Address */}
                <h3 className="text-lg font-semibold text-blue-teal m-0 leading-tight">
                    {property.address?.split(',')[0] || property.address}
                </h3>

                {/* Price */}
                <p className="text-blue-teal text-base font-medium m-0">
                    {formatPrice(property.price)}
                </p>

                {/* Details */}
                <p className="text-sm text-slate-500 m-0">
                    {property.beds && `${property.beds} bd`} • {property.baths && `${property.baths} ba`} • {property.sqft && `${formatSqft(property.sqft)} sqft`}
                </p>

                {/* Property Type */}
                {property.propertyType && (
                    <div className="inline-block bg-slate-100 text-blue-teal px-1.5 py-0.5 rounded text-xs font-medium capitalize">
                        {property.propertyType.toLowerCase().replace('_', ' ')}
                    </div>
                )}

                {/* Button */}
                <button
                    className="w-full px-4 py-2 border border-blue-teal bg-transparent text-blue-teal rounded-md text-sm font-medium cursor-pointer transition-all duration-200 mt-1 hover:bg-warm-coral/30"
                    onClick={(e) => {
                        e.stopPropagation()
                        property.permalink && window.open(property.permalink, '_blank')
                    }}
                >
                    View on Zillow
                </button>
            </div>
        </div>
    )
}
