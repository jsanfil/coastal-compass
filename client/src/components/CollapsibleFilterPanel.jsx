import { useState } from 'react'
import FilterPanel from './FilterPanel'

export default function CollapsibleFilterPanel({ filters, onFiltersChange, onSearch, loading }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="bg-white border border-teal-border rounded-lg shadow-sm mb-4 font-['Poppins']">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-sage-green/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">⚙️</span>
                    <div>
                        <div className="font-medium text-blue-teal">
                            Advanced Filters
                        </div>
                        <div className="text-sm text-gray-500">
                            Fine-tune your search with detailed controls
                        </div>
                    </div>
                </div>
                <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isExpanded && (
                <div className="border-t border-teal-border">
                    <div className="p-4">
                        <FilterPanel
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                            onSearch={onSearch}
                            loading={loading}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
