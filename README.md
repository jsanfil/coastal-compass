# Coastal Compass

A full-stack web application that provides a **conversational, natural-language experience** for searching residential real estate. Users can describe what they're looking for in plain English, and the system translates those prompts into structured search criteria, fetches matching listings via the Zillow API, and displays results in a modern, responsive UI.

## 🚀 Features

- **Conversational Search**: Describe your dream home in natural language (e.g., "Show me 3-bedroom homes near La Jolla under $2M with ocean views")
- **LLM-Powered Parsing**: Advanced language model integration to understand and process user prompts into precise filter criteria
- **Multi-turn Dialogue**: Refine your search through conversational follow-ups (e.g., "Make it 4 bedrooms instead" or "Show me condos instead")
- **Filter Transparency**: Always see the current active filters being applied, adjustable through both conversation and traditional UI controls
- **Zillow API Integration**: Real-time access to comprehensive real estate data via RapidAPI proxy
- **Modern UI**: Responsive, accessible design built with React, TypeScript, Tailwind CSS, and shadcn/ui components
- **Advanced Filtering**: Traditional controls for price range, property type, bedrooms, bathrooms, square footage, and sorting options

## 🏗️ Architecture

This application follows a client-server architecture:

- **Client** (`/client`): React application built with Vite, featuring a modern UI for property search and display
- **Server** (`/server`): Node.js Express server that handles API requests and communicates with RapidAPI Zillow endpoints

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **RapidAPI Account** with access to the Zillow API
3. **RapidAPI Key** for authentication

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jsanfil/coastal-compass.git
   cd coastal-compass
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

## ⚙️ Configuration

1. **Set up environment variables:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your RapidAPI credentials:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=zillow-com1.p.rapidapi.com
   ZILLOW_SEARCH_PATH=/search
   PORT=3001
   ```

   Replace `your_rapidapi_key_here` with your actual RapidAPI key.

## 🚀 Running the Application

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3001`

2. **Start the client (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (or similar Vite dev server port)

3. **Open your browser** and navigate to the client URL to start searching for properties!

## 🔍 API Usage

The application provides a RESTful API endpoint:

### Search Properties
```
GET /api/search?location=Carlsbad,CA&minPrice=100000&maxPrice=500000&propertyType=SINGLE_FAMILY&bedrooms=3&bathrooms=2&minSqft=1500&maxSqft=3000&sortBy=price_desc
```

**Query Parameters:**
- `location`: City, state, or ZIP code (required)
- `minPrice`/`maxPrice`: Price range filters
- `propertyType`: Property type (SINGLE_FAMILY, CONDO, TOWNHOUSE, etc.)
- `bedrooms`/`bathrooms`: Minimum bedroom/bathroom count
- `minSqft`/`maxSqft`: Square footage range
- `sortBy`: Sort order (price_desc, price_asc, sqft_desc, sqft_asc, date_desc)

## 🛠️ Development

### Available Scripts

**Server:**
- `npm start`: Start the production server
- `npm run dev`: Start with nodemon for development

**Client:**
- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build

### Project Structure

```
coastal-compass/
├── client/                 # React frontend
│   ├── public/
│   │   └── images/         # Static assets (logos, etc.)
│   ├── src/
│   │   ├── components/     # React components (FilterPanel, PropertyCard, PropertyGrid)
│   │   ├── App.jsx         # Main app component with search logic
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles with Tailwind
│   ├── package.json
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── postcss.config.js   # PostCSS configuration
├── server/                 # Node.js backend
│   ├── index.js            # Express server with Zillow API proxy
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── package-lock.json
├── memory-bank/            # Project documentation and context
│   ├── projectbrief.md     # Core project requirements and goals
│   ├── productContext.md   # Why project exists and user experience goals
│   ├── activeContext.md    # Current work focus and recent changes
│   ├── systemPatterns.md   # Architectural patterns and decisions
│   ├── techContext.md      # Technology stack and constraints
│   └── progress.md         # Development progress and milestones
├── .clinerules/            # Project guardrails and conventions
├── .gitignore
├── package.json            # Root package.json (workspace)
├── package-lock.json
└── README.md
```

## 📚 Learning Objectives

This project demonstrates:

- **Conversational AI Integration**: Implementing natural language processing for user interactions
- **LLM Integration**: Working with large language models to parse and understand user intent
- **Multi-turn Dialogue Systems**: Building conversational interfaces that maintain context
- **API Integration**: How to work with third-party REST APIs securely
- **Full-Stack Development**: Client-server communication patterns and state synchronization
- **React State Management**: Managing complex filter states across conversational and traditional UI
- **Responsive UI Design**: Creating mobile-friendly interfaces with modern design systems
- **Environment Configuration**: Secure handling of API keys and sensitive configuration
- **Error Handling**: Graceful handling of API failures and user input validation

## 🚧 Current Development Status

**Implemented:**
- Basic Zillow API integration with property search and display
- Traditional filter controls (price, location, property type, beds/baths, sqft)
- Responsive React UI with Tailwind CSS styling
- Server-side API proxy for secure key management

**Planned (Not Yet Implemented):**
- Conversational search interface with natural language input
- LLM-powered prompt parsing and filter extraction
- Multi-turn dialogue support for search refinement
- Filter transparency and synchronization between conversation and UI controls
- Enhanced user experience with loading states and error handling

## 🤝 Contributing

This is an educational project. Feel free to:

- Submit issues for bugs or feature requests
- Create pull requests with improvements
- Use it as a reference for your own real estate API integrations

## 📄 License

This project is for educational purposes. Please check RapidAPI's terms of service for commercial usage of their Zillow API.

## ⚠️ Disclaimer

This application is for educational purposes only. Always verify real estate information with official sources. Property data is provided by Zillow via RapidAPI and may not be current or accurate.
