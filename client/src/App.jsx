import { useState, useEffect } from 'react'
import ConversationInterface from './components/ConversationInterface'
import CollapsibleFilterPanel from './components/CollapsibleFilterPanel'
import PropertyGrid from './components/PropertyGrid'

const API = 'http://localhost:3001'

export default function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [conversationLoading, setConversationLoading] = useState(false)
  const [conversation, setConversation] = useState([]) // Array of {role, content, timestamp, filters?}
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
  const [previousFilters, setPreviousFilters] = useState(filters)
  const [changedFilters, setChangedFilters] = useState(new Set())

  // Detect filter changes and highlight them
  useEffect(() => {
    const changed = new Set()
    Object.keys(filters).forEach(key => {
      if (filters[key] !== previousFilters[key]) {
        changed.add(key)
      }
    })

    if (changed.size > 0) {
      setChangedFilters(changed)
      setPreviousFilters(filters)

      // Remove highlight after 3 seconds
      const timeout = setTimeout(() => {
        setChangedFilters(new Set())
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [filters, previousFilters])

  // Search using traditional filters
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

  // Handle conversation input - parse natural language and search
  async function handleConversationSubmit(prompt) {
    setConversationLoading(true)
    try {
      // Add user message to conversation history
      const userMessage = {
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      }
      setConversation(prev => [...prev, userMessage])

      // Prepare conversation history for LLM (exclude timestamps)
      const historyForLLM = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // First, parse the prompt using LLM with conversation context
      const parseResponse = await fetch(`${API}/api/parse-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          currentFilters: filters,
          history: historyForLLM
        })
      })

      if (!parseResponse.ok) {
        throw new Error('Failed to parse prompt')
      }

      const parseData = await parseResponse.json()
      console.log('Parsed filters:', parseData)

      // Add assistant response to conversation history
      const assistantMessage = {
        role: 'assistant',
        content: parseData.message || 'Search updated based on your request.',
        timestamp: new Date().toISOString(),
        filters: parseData.filters
      }
      setConversation(prev => [...prev, assistantMessage])

      // Update filters with parsed results
      const newFilters = { ...filters, ...parseData.filters }
      setFilters(newFilters)

      // Now search with the parsed filters
      setLoading(true)
      const searchParams = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, value)
        }
      })

      const searchResponse = await fetch(`${API}/api/search?${searchParams.toString()}`)
      const searchData = await searchResponse.json()
      setProperties(searchData.items || [])

    } catch (error) {
      console.error('Conversation search failed:', error)
      setProperties([])
    } finally {
      setConversationLoading(false)
      setLoading(false)
    }
  }



  return (
    <div className="h-screen bg-warm-beige font-['Poppins'] overflow-hidden">
      {/* Google Fonts Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-7xl mx-auto p-5 h-full flex flex-col">

        <header className="flex items-center gap-3 mb-6 flex-shrink-0">
          <img
            src="/images/coastal-compass-logo.svg"
            alt="Coastal Compass logo"
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-semibold text-blue-teal tracking-tight">
            Coastal Compass
          </h1>
        </header>

        {/* Main Content Grid - Left: Filters/Conversation, Right: Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

          {/* Left Sidebar - Filters and Conversation */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* Conversation Interface */}
            <ConversationInterface
              conversation={conversation}
              onSubmit={handleConversationSubmit}
              loading={conversationLoading}
              disabled={loading}
            />

            {/* Advanced Filters & Controls */}
            <CollapsibleFilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={search}
              loading={loading}
            />
          </div>

          {/* Right Side - Property Results */}
          <div className="lg:col-span-2 overflow-y-auto">
            <PropertyGrid
              properties={properties}
              loading={loading}
              filters={filters}
              changedFilters={changedFilters}
            />
          </div>

        </div>

      </div>
    </div>
  )
}
