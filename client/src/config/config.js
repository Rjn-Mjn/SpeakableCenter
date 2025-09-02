/**
 * Client Configuration
 */

const config = {
    // API endpoints
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://audiox.space/api'
        : 'http://localhost:443/api',
    
    // Asset paths
    ASSETS_PATH: '/src/assets',
    STYLES_PATH: '/src/styles',
    
    // Google OAuth
    GOOGLE_CLIENT_ID: '516012654111-05ljrp07o7oi4o2haj8n2k2r6rg0dhic.apps.googleusercontent.com',
    
    // App settings
    APP_NAME: 'Speakable',
    APP_VERSION: '1.0.0'
};

export default config;
