# Coastal Compass

A full-stack web application that provides a **conversational, natural-language experience** for searching residential real estate. Users can describe what they're looking for in plain English, and the system translates those prompts into structured search criteria, fetches matching listings via a RapidAPI housing data endpoint, and displays results in a modern, responsive UI.

## 🚀 Features

- **Conversational Search**: Describe your dream home in natural language (e.g., "Show me 3-bedroom homes near La Jolla under $2M with ocean views")
- **LLM-Powered Parsing**: Advanced language model integration to understand and process user prompts into precise filter criteria
- **Multi-turn Dialogue**: Refine your search through conversational follow-ups (e.g., "Make it 4 bedrooms instead")
- **Filter Transparency**: Always see the current active filters being applied, adjustable through both conversation and traditional UI controls
- **Housing API Integration**: Real-time access to comprehensive real estate data via RapidAPI proxy
- **Modern UI**: Responsive, accessible design built with React, TypeScript, Tailwind CSS, and shadcn/ui components
- **Advanced Filtering**: Traditional controls for price range, property type, bedrooms, bathrooms, square footage, and sorting options

## 🏗️ Architecture

This application follows a client-server architecture:

- **Client** (`/client`): React application built with Vite, featuring a modern UI for property search and display
- **Server** (`/server`): Node.js Express server that handles API requests and communicates with RapidAPI housing endpoints

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **RapidAPI Account** with access to the housing API endpoint
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
   RAPIDAPI_HOST=us-housing-market-data1.p.rapidapi.com
   ZILLOW_SEARCH_PATH=/propertyExtendedSearch
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

## 🧪 Testing

**Server tests:**
```bash
cd server
npm test
```

**Client tests:**
```bash
cd client
npm test
```

## 📁 Project Structure

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
│   ├── index.js            # Express server with RapidAPI housing data proxy
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── src/
│       ├── routes/         # API endpoints
│       ├── services/       # Business logic (Zillow, LLM services)
│       ├── schemas/        # Data validation schemas
│       └── lib/            # Utility functions
├── memory-bank/            # Project documentation and context
├── .clinerules/            # Project guardrails and conventions
├── .gitignore
├── package.json            # Root package.json (workspace)
└── README.md
```

## 🤝 Contributing

This is an educational project. Feel free to:

- Submit issues for bugs or feature requests
- Create pull requests with improvements
- Use it as a reference for your own real estate API integrations

## 📄 License

This project is for educational purposes. Please check RapidAPI's terms of service for commercial usage of the selected housing data API.

## ⚠️ Disclaimer

This application is for educational purposes only. Always verify real estate information with official sources. Property data is provided by RapidAPI sources and may not be current or accurate.
