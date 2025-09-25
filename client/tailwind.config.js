export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'warm-beige': '#E4DDD7',
                'sage-green': '#BFD3CE',
                'teal-border': '#91B7BE',
                'blue-teal': '#6D98A5',
                'warm-coral': '#D9A391',
                'terracotta': {
                    50: '#fef2f0',
                    100: '#fde3de',
                    200: '#fbcdc6',
                    300: '#f7a99a',
                    400: '#f17c6b',
                    500: '#e55c4a',
                    600: '#d13f2c',
                    700: '#b02f20',
                    800: '#8f2719',
                    900: '#762017',
                    DEFAULT: '#CC7357',
                },
            }
        },
    },
}
