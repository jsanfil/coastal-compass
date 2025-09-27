import { useState, useEffect, useRef } from 'react'

const SUGGESTIONS = [
    "3 bedroom homes under $2M",
    "Beach properties in Aptos",
    "Family homes with ocean views",
    "Investment properties",
    "Luxury estates"
]

export default function ConversationInterface({ conversation, onSubmit, loading, disabled, error, onReset }) {
    const [input, setInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [conversation])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !loading && !disabled) {
            onSubmit(input.trim())
            setInput('')
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion)
        setShowSuggestions(false)
    }

    return (
        <div className="bg-white border border-teal-border rounded-xl shadow-sm mb-4 font-['Poppins']">
            {/* Conversation History */}
            {conversation.length > 0 && (
                <div className="p-4 border-b border-teal-border/30">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-blue-teal">Conversation</h3>
                        <button
                            onClick={onReset}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            title="Reset conversation"
                        >
                            <span className="text-lg">🔄</span>
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-3" ref={scrollRef}>
                        {conversation.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.role === 'user'
                                    ? 'bg-blue-teal text-white'
                                    : 'bg-sage-green/20 text-gray-800'
                                    }`}>
                                    <div className="font-medium text-xs mb-1 opacity-75">
                                        {message.role === 'user' ? 'You' : 'Assistant'}
                                    </div>
                                    <div>{message.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Welcome State - when no conversation yet */}
            {conversation.length === 0 && !error && (
                <div className="p-4 border-b border-teal-border/30 bg-sage-green/5">
                    <div className="text-center">
                        <div className="text-3xl mb-3">🏠</div>
                        <h3 className="font-medium text-blue-teal mb-2">Welcome to Coastal Compass!</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Tell me what kind of property you're looking for. I can help you find homes using natural language.
                        </p>
                        <div className="text-xs text-gray-500">
                            Try: "Show me 3 bedroom homes under $2M" or "Beach properties in Aptos"
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                        <div className="text-gray-400 text-lg">💭</div>
                        <div className="flex-1">
                            <div className="text-gray-700 text-sm">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !loading && !disabled && input.trim()) {
                                    handleSubmit(e)
                                }
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Tell me what you're looking for... (e.g., '3 bedroom homes under $2M')"
                            disabled={loading || disabled}
                            className="w-full px-4 py-3 border border-teal-border rounded-lg text-sm bg-warm-beige/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-warm-coral focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        {/* Suggestions dropdown */}
                        {showSuggestions && !input && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-teal-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                                <div className="p-2">
                                    <div className="text-xs font-medium text-blue-teal mb-2 px-2">Try asking for:</div>
                                    {SUGGESTIONS.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-sage-green/20 rounded-md transition-colors"
                                        >
                                            "{suggestion}"
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || loading || disabled}
                        className="bg-blue-teal text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-warm-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs">Understanding...</span>
                            </div>
                        ) : (
                            'Search'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
