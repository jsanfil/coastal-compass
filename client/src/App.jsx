import { useState } from 'react'
import FilterPanel from './components/FilterPanel'
import PropertyGrid from './components/PropertyGrid'


const API = 'http://localhost:3001'

export default function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    location: 'Aptos, CA',
    minPrice: '',
    maxPrice: '',
    home_type: '',
    bedsMin: '',
    bathsMin: '',
    sqftMin: '',
    sqftMax: '',
    sort: 'Price_High_Low'
  })

  async function search() {
    setLoading(true)
    try {
      // Build query parameters, filtering out empty values
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.set(key, value)
        }
      })

      const response = await fetch(`${API}/api/search?${queryParams.toString()}`)
      const data = await response.json()
      setProperties(data.items || [])
    } catch (error) {
      console.error('Search failed:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-beige font-['Poppins'] p-5">
      {/* Google Fonts Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-7xl mx-auto">

        <header className="flex items-center gap-3 mb-5">
          <img
            src="/images/coastal-compass-logo.svg"
            alt="Coastal Compass logo"
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-semibold text-blue-teal tracking-tight">
            Coastal Compass
          </h1>
        </header>

        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={search}
          loading={loading}
        />

        <PropertyGrid
          properties={properties}
          loading={loading}
          filters={filters}
        />
      </div>
    </div>
  )
}
