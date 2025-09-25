# Coastal Keys

An experimental real estate web application built with React and Node.js to demonstrate interactions with the RapidAPI Zillow API. This project serves as a learning tool for understanding how to integrate third-party real estate APIs into modern web applications.

## 🚀 Features

- **Property Search**: Search for homes using location-based queries
- **Advanced Filtering**: Filter by price range, property type, bedrooms, bathrooms, and square footage
- **Sorting Options**: Sort results by price, square footage, or date
- **Responsive Design**: Clean, modern UI that works on desktop and mobile
- **Real-time API Integration**: Direct integration with Zillow's real estate data via RapidAPI

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
   git clone https://github.com/jsanfil/rapidapi-zillow-sample.git
   cd rapidapi-zillow-sample
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
   PORT=4000
   ```

   Replace `your_rapidapi_key_here` with your actual RapidAPI key.

## 🚀 Running the Application

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:4000`

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
rapidapi-zillow-sample/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── index.js            # Express server
│   ├── .env.example        # Environment template
│   └── package.json
└── README.md
```

## 📚 Learning Objectives

This project demonstrates:

- **API Integration**: How to work with third-party REST APIs
- **Full-Stack Development**: Client-server communication patterns
- **React State Management**: Managing complex filter states
- **Responsive UI Design**: Creating mobile-friendly interfaces
- **Environment Configuration**: Secure handling of API keys
- **Error Handling**: Graceful handling of API failures

## 🤝 Contributing

This is an educational project. Feel free to:

- Submit issues for bugs or feature requests
- Create pull requests with improvements
- Use it as a reference for your own real estate API integrations

## 📄 License

This project is for educational purposes. Please check RapidAPI's terms of service for commercial usage of their Zillow API.

## ⚠️ Disclaimer

This application is for educational purposes only. Always verify real estate information with official sources. Property data is provided by Zillow via RapidAPI and may not be current or accurate.
