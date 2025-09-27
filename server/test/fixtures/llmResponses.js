// Mock LLM API responses for testing

export const mockLLMParseResponse = {
    choices: [
        {
            message: {
                content: JSON.stringify({
                    filters: {
                        location: "La Jolla, CA",
                        minPrice: "1000000",
                        maxPrice: "2000000",
                        bedsMin: "3"
                    },
                    message: "I'll help you find 3+ bedroom homes in La Jolla between $1M-$2M."
                })
            }
        }
    ]
}

export const mockLLMFilterClearResponse = {
    choices: [
        {
            message: {
                content: JSON.stringify({
                    filters: {
                        location: "",
                        minPrice: "",
                        maxPrice: "",
                        bedsMin: "",
                        bathsMin: "",
                        home_type: "",
                        sqftMin: "",
                        sqftMax: "",
                        sort: "Price_High_Low"
                    },
                    message: "I've cleared all your search filters. What would you like to search for?"
                })
            }
        }
    ]
}

export const mockLLMModelsResponse = {
    data: [
        {
            id: "anthropic/claude-3-haiku",
            name: "Claude 3 Haiku"
        },
        {
            id: "openai/gpt-4",
            name: "GPT-4"
        }
    ]
}

export const mockLLMErrorResponse = {
    error: {
        message: "Invalid API key"
    }
}
