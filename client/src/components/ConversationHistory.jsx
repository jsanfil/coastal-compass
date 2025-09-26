import { useEffect, useRef } from 'react'

export default function ConversationHistory({ conversation }) {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [conversation])

    if (conversation.length === 0) return null

    return (
        <div className="bg-white border border-teal-border rounded-xl p-4 shadow-sm mb-4 font-['Poppins'] max-h-64 overflow-y-auto" ref={scrollRef}>
            <h3 className="text-sm font-medium text-blue-teal mb-3">Conversation History</h3>
            <div className="space-y-3">
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
    )
}
