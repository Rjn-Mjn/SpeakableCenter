/**
 * Main App Component (for future React migration)
 * Currently serves as a template for component-based architecture
 */

// This file is prepared for future React/Vue migration
// For now, the app uses vanilla JavaScript

const App = {
    name: 'Speakable',
    version: '1.0.0',
    
    init() {
        console.log(`${this.name} v${this.version} initialized`);
    },
    
    components: {
        HomePage: () => import('./pages/HomePage.html'),
        LoginPage: () => import('./pages/LoginPage.html'),
    }
};

export default App;
