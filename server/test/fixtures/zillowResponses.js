// Mock Zillow API responses for testing

export const mockZillowSearchResponse = {
    props: [
        {
            zpid: "12345",
            address: "123 Main St, San Diego, CA 92101",
            addressStreet: "123 Main St",
            addressCity: "San Diego",
            addressState: "CA",
            addressZipcode: "92101",
            price: 750000,
            bedrooms: 3,
            bathrooms: 2,
            livingArea: 1800,
            propertyType: "Single Family",
            imgSrc: "https://example.com/image1.jpg",
            detailUrl: "https://www.zillow.com/homedetails/123-Main-St/12345_zpid/"
        },
        {
            zpid: "67890",
            address: "456 Oak Ave, La Jolla, CA 92037",
            addressStreet: "456 Oak Ave",
            addressCity: "La Jolla",
            addressState: "CA",
            addressZipcode: "92037",
            price: 1200000,
            bedrooms: 4,
            bathrooms: 3,
            livingArea: 2500,
            propertyType: "Single Family",
            imgSrc: "https://example.com/image2.jpg",
            detailUrl: "https://www.zillow.com/homedetails/456-Oak-Ave/67890_zpid/"
        }
    ]
}

export const mockNormalizedProperties = [
    {
        id: "12345",
        address: "123 Main St",
        city: "San Diego",
        state: "CA",
        price: 750000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        propertyType: "Single Family",
        imgSrc: "https://example.com/image1.jpg",
        permalink: "https://www.zillow.com/homedetails/123-Main-St/12345_zpid/"
    },
    {
        id: "67890",
        address: "456 Oak Ave",
        city: "La Jolla",
        state: "CA",
        price: 1200000,
        beds: 4,
        baths: 3,
        sqft: 2500,
        propertyType: "Single Family",
        imgSrc: "https://example.com/image2.jpg",
        permalink: "https://www.zillow.com/homedetails/456-Oak-Ave/67890_zpid/"
    }
]

export const mockEmptyZillowResponse = {
    props: []
}

export const mockZillowErrorResponse = {
    error: "API rate limit exceeded"
}
