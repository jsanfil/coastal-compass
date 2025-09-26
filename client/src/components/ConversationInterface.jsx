import { useState, useEffect, useRef } from 'react'

const SUGGESTIONS = [
    "3 bedroom homes under $2M",
    "Beach properties in Aptos",
    "Family homes with ocean views",
    "Investment properties",
    "Luxury estates"
]

export default function ConversationInterface({ conversation, onSubmit, loading, disabled }) {
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
                    <h3 className="text-sm font-medium text-blue-teal mb-3">Conversation</h3>
                    <div className="max-h-48 overflow-y-auto space-y-3" ref={scrollRef}>
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

            {/* Input Area */}
            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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
                                Searching...
                            </div>
                        ) : (
                            'Search'
                        )}
                    </button>
                </form>

                {/* Helper text */}
                <div className="mt-2 text-xs text-gray-500">
                    💡 Try: "Show me 4BR homes with ocean views under $3M" or "Family homes in Aptos"
                </div>
            </div>
        </div>
    )
}
