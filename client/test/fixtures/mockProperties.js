export const mockProperty = {
    id: '12345',
    address: '123 Main St, San Diego, CA',
    city: 'San Diego',
    state: 'CA',
    price: 750000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    propertyType: 'Single Family',
    imgSrc: 'https://example.com/image.jpg',
    permalink: 'https://zillow.com/property/12345'
}

export const mockProperties = [
    mockProperty,
    {
        id: '67890',
        address: '456 Oak Ave',
        city: 'La Jolla',
        state: 'CA',
        price: 1200000,
        beds: 4,
        baths: 3,
        sqft: 2500,
        propertyType: 'Single Family',
        imgSrc: 'https://example.com/image2.jpg',
        permalink: 'https://zillow.com/property/67890'
    }
]

export const mockFilters = {
    location: 'San Diego, CA',
    minPrice: 500000,
    maxPrice: 1000000,
    bedsMin: '3',
    bathsMin: '2',
    propertyType: 'Single Family',
    sqftMin: 1500,
    sqftMax: 3000,
    sort: 'price_low'
}

export const mockConversationHistory = [
    {
        id: 1,
        prompt: 'Show me 3 bedroom homes in San Diego',
        response: 'I found 3 bedroom homes in San Diego. Here are the current filters: location: San Diego, CA, beds: 3',
        timestamp: new Date('2025-01-01T10:00:00Z')
    },
    {
        id: 2,
        prompt: 'Under $800k',
        response: 'Updated price range to under $800,000. Here are the current filters: location: San Diego, CA, beds: 3, maxPrice: 800000',
        timestamp: new Date('2025-01-01T10:01:00Z')
    }
]
