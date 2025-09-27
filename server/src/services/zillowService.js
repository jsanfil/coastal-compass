import fetch from "node-fetch";

/**
 * Service for interacting with Zillow API via RapidAPI
 */
export class ZillowService {
    constructor() {
        this.rapidApiKey = process.env.RAPIDAPI_KEY;
        this.rapidApiHost = process.env.RAPIDAPI_HOST;
        this.searchPath = process.env.ZILLOW_SEARCH_PATH || "/propertyExtendedSearch";

        if (!this.rapidApiKey || !this.rapidApiHost) {
            throw new Error("Missing required environment variables: RAPIDAPI_KEY, RAPIDAPI_HOST");
        }
    }

    /**
     * Search for properties using Zillow API
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} Array of normalized property objects
     */
    async searchProperties(filters) {
        try {
            const baseUrl = `https://${this.rapidApiHost}${this.searchPath}`;
            const url = new URL(baseUrl);

            // Build query parameters from filters
            this._buildQueryParams(url, filters);

            console.log('Zillow API Request URL:', url.toString());

            const response = await fetch(url, {
                headers: {
                    "X-RapidAPI-Key": this.rapidApiKey,
                    "X-RapidAPI-Host": this.rapidApiHost
                }
            });

            console.log('Zillow API Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Zillow API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Zillow API Raw response:', data);

            const properties = this._normalizeResponse(data);

            console.log('Normalized properties:', properties);

            return properties;
        } catch (error) {
            console.error('Zillow API search failed:', error);
            throw new Error(`Failed to search properties: ${error.message}`);
        }
    }

    /**
     * Build URL query parameters from filter object
     * @param {URL} url - URL object to modify
     * @param {Object} filters - Filter criteria
     */
    _buildQueryParams(url, filters) {
        // Location is required
        if (filters.location) {
            url.searchParams.set("location", filters.location);
        }

        // Price filters
        if (filters.minPrice) {
            url.searchParams.set("minPrice", String(filters.minPrice));
        }
        if (filters.maxPrice) {
            url.searchParams.set("maxPrice", String(filters.maxPrice));
        }

        // Property type filter
        if (filters.home_type) {
            url.searchParams.set("home_type", filters.home_type);
        }

        // Bedroom filter (minimum bedrooms)
        if (filters.bedsMin) {
            url.searchParams.set("bedsMin", String(filters.bedsMin));
        }

        // Bathroom filter (minimum bathrooms)
        if (filters.bathsMin) {
            url.searchParams.set("bathsMin", String(filters.bathsMin));
        }

        // Square footage filters
        if (filters.sqftMin) {
            url.searchParams.set("sqftMin", String(filters.sqftMin));
        }
        if (filters.sqftMax) {
            url.searchParams.set("sqftMax", String(filters.sqftMax));
        }

        // Sort options
        if (filters.sort) {
            url.searchParams.set("sort", filters.sort);
        }

        // Keywords filter
        if (filters.keywords && filters.keywords.length > 0) {
            url.searchParams.set("keywords", filters.keywords.join(","));
        }
    }

    /**
     * Normalize Zillow API response to consistent format
     * @param {Object} data - Raw API response
     * @returns {Array} Normalized property objects
     */
    _normalizeResponse(data) {
        // Handle different possible response structures
        const list = Array.isArray(data?.results) ? data.results
            : Array.isArray(data?.data) ? data.data
                : Array.isArray(data?.props) ? data.props
                    : [];

        return list.map(item => ({
            id: item.zpid || item.id || String(Math.random()),
            price: item.price || item.listPrice || item.list_price,
            beds: item.bedrooms || item.beds,
            baths: item.bathrooms || item.baths,
            sqft: item.livingArea || item.sqft || item.area,
            address: item.address || item.streetAddress || item.street || "",
            city: item.city || "",
            state: item.state || "",
            propertyType: item.propertyType,
            imgSrc: item.imgSrc,
            permalink: this._buildPermalink(item)
        }));
    }

    /**
     * Build permalink URL from property data
     * @param {Object} item - Property data
     * @returns {string|null} Permalink URL or null
     */
    _buildPermalink(item) {
        if (item.detailUrl) {
            return item.detailUrl.startsWith('http') ? item.detailUrl : `https://www.zillow.com${item.detailUrl}`;
        }
        if (item.url) {
            return item.url.startsWith('http') ? item.url : `https://www.zillow.com${item.url}`;
        }
        if (item.zpid) {
            return `https://www.zillow.com/homedetails/${item.zpid}_zpid/`;
        }
        return null;
    }

    /**
     * Filter properties by property type (client-side filtering as fallback)
     * @param {Array} properties - Array of property objects
     * @param {string} targetType - Target property type from our filter
     * @returns {Array} Filtered properties
     */
    _filterByPropertyType(properties, targetType) {
        // Map our filter values to Zillow API property types
        const typeMapping = {
            'Houses': ['SINGLE_FAMILY'],
            'Apartments_Condos_Co-ops': ['CONDO'],
            'Townhomes': ['SINGLE_FAMILY'], // Townhomes often classified as SINGLE_FAMILY
            'Multi-family': ['MULTI_FAMILY'],
            'LotsLand': [], // No specific property type for land
            'Manufactured': ['MANUFACTURED']
        };

        const allowedTypes = typeMapping[targetType] || [];
        if (allowedTypes.length === 0) {
            return properties; // Return all if no mapping or empty mapping
        }

        return properties.filter(property => {
            return allowedTypes.includes(property.propertyType);
        });
    }
}
