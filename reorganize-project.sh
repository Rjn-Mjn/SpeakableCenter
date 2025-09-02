#!/bin/bash

# Project Reorganization Script
# This script will restructure your Speakable project into a modern client-server architecture

echo "🚀 Starting Project Reorganization..."
echo "================================================"

# Set the base directory
BASE_DIR="/run/media/peterlovwood/STORAGE/Speakable"
cd "$BASE_DIR"

# Create backup first
echo "📦 Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r public "$BACKUP_DIR/"
cp -r routes "$BACKUP_DIR/"
cp -r services "$BACKUP_DIR/"
cp -r config "$BACKUP_DIR/"
cp -r DB "$BACKUP_DIR/"
cp server.js "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
echo "✅ Backup created in $BACKUP_DIR"

# ==========================
# CREATE NEW STRUCTURE
# ==========================

echo ""
echo "📁 Creating new directory structure..."

# Create main directories
mkdir -p client
mkdir -p server

# Create client structure
mkdir -p client/public
mkdir -p client/src
mkdir -p client/src/components
mkdir -p client/src/pages
mkdir -p client/src/routes
mkdir -p client/src/services
mkdir -p client/src/styles
mkdir -p client/src/utils
mkdir -p client/src/assets

# Create server structure
mkdir -p server/routes
mkdir -p server/controllers
mkdir -p server/services
mkdir -p server/models
mkdir -p server/middleware
mkdir -p server/config
mkdir -p server/utils

echo "✅ Directory structure created"

# ==========================
# MOVE CLIENT FILES
# ==========================

echo ""
echo "📋 Moving client files..."

# Move public assets
if [ -d "public/assets" ]; then
    cp -r public/assets/* client/src/assets/ 2>/dev/null || true
    echo "  ✓ Assets moved"
fi

# Move HTML files to pages
if [ -f "public/index.html" ]; then
    cp public/index.html client/src/pages/HomePage.html
    echo "  ✓ HomePage created"
fi

if [ -d "public/Pages" ]; then
    cp public/Pages/LoginUI.html client/src/pages/LoginPage.html 2>/dev/null || true
    echo "  ✓ LoginPage created"
fi

# Move styles
if [ -d "public/style" ]; then
    cp -r public/style/* client/src/styles/ 2>/dev/null || true
    echo "  ✓ Styles moved"
fi

# Move client scripts
if [ -d "public/script" ]; then
    cp -r public/script/* client/src/services/ 2>/dev/null || true
    echo "  ✓ Client scripts moved"
fi

# Move static files to public
cp public/favicon.ico client/public/ 2>/dev/null || true
cp public/.htaccess client/public/ 2>/dev/null || true

# Move preview images
if [ -d "public/preview" ]; then
    mkdir -p client/public/preview
    cp -r public/preview/* client/public/preview/ 2>/dev/null || true
fi

echo "✅ Client files moved"

# ==========================
# MOVE SERVER FILES
# ==========================

echo ""
echo "📋 Moving server files..."

# Move routes
if [ -d "routes" ]; then
    cp -r routes/* server/routes/ 2>/dev/null || true
    echo "  ✓ Routes moved"
fi

# Move services
if [ -d "services" ]; then
    cp -r services/* server/services/ 2>/dev/null || true
    echo "  ✓ Services moved"
fi

# Move config
if [ -d "config" ]; then
    cp -r config/* server/config/ 2>/dev/null || true
    echo "  ✓ Config moved"
fi

# Move DB files to models
if [ -d "DB" ]; then
    cp -r DB/* server/models/ 2>/dev/null || true
    echo "  ✓ Database files moved to models"
fi

# Move main server file
if [ -f "server.js" ]; then
    cp server.js server/server.js
    echo "  ✓ Server.js moved"
fi

# Move SSL certificates
if [ -d "ssl" ]; then
    mkdir -p server/ssl
    cp -r ssl/* server/ssl/ 2>/dev/null || true
    echo "  ✓ SSL certificates moved"
fi

echo "✅ Server files moved"

# ==========================
# CREATE NEW FILES
# ==========================

echo ""
echo "📝 Creating configuration files..."

# Create client package.json
cat > client/package.json << 'EOF'
{
  "name": "speakable-client",
  "version": "1.0.0",
  "description": "Speakable English Learning Platform - Client",
  "main": "src/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "serve -s public"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "serve": "^14.2.0"
  }
}
EOF
echo "  ✓ Client package.json created"

# Create server package.json
cat > server/package.json << 'EOF'
{
  "name": "speakable-server",
  "version": "1.0.0",
  "description": "Speakable English Learning Platform - Server",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "argon2": "^0.44.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "express-rate-limit": "^8.0.1",
    "express-session": "^1.18.2",
    "express-validator": "^7.2.1",
    "google-auth-library": "^10.3.0",
    "helmet": "^8.1.0",
    "mssql": "^11.0.1",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
EOF
echo "  ✓ Server package.json created"

# Create client main.js entry point
cat > client/src/main.js << 'EOF'
/**
 * Main entry point for Speakable client application
 */

// Import styles
import './styles/Style.css';

// Import services
import './services/main.js';
import './services/font-loader.js';
import './services/smooth-scroll-polyfill.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Speakable Client Application Initialized');
    
    // Initialize routes
    initializeRoutes();
});

function initializeRoutes() {
    // Simple client-side routing
    const path = window.location.pathname;
    
    switch(path) {
        case '/':
            loadHomePage();
            break;
        case '/login':
            loadLoginPage();
            break;
        default:
            load404Page();
    }
}

function loadHomePage() {
    console.log('Loading home page...');
}

function loadLoginPage() {
    console.log('Loading login page...');
}

function load404Page() {
    console.log('Page not found');
}

export { initializeRoutes };
EOF
echo "  ✓ Client main.js created"

# Create App.jsx template
cat > client/src/App.jsx << 'EOF'
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
EOF
echo "  ✓ App.jsx template created"

# Create root .env file
cat > .env << 'EOF'
# Database Configuration
DB_USER=BunBo
DB_PASS=123456
DB_SERVER=27.75.93.31
DB_NAME=SpeakableCenter

# Server Configuration
PORT=443
HTTP_PORT=80
NODE_ENV=production
ENABLE_HTTP_REDIRECT=true

# Session Security
SESSION_SECRET=5614a02500249776e70fc4589498c5d00d399ac01899cbde2991d0587a787012

# Google OAuth
GOOGLE_CLIENT_ID=516012654111-05ljrp07o7oi4o2haj8n2k2r6rg0dhic.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Client URL
CLIENT_URL=https://audiox.space
EOF
echo "  ✓ .env file created"

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  client:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - server

  server:
    build: ./server
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./server:/app
      - /app/node_modules
      - ./server/ssl:/app/ssl
    environment:
      - NODE_ENV=production
    env_file:
      - .env

  # Optional: Add database service
  # database:
  #   image: mcr.microsoft.com/mssql/server:2019-latest
  #   environment:
  #     - ACCEPT_EULA=Y
  #     - SA_PASSWORD=${DB_PASS}
  #   ports:
  #     - "1433:1433"
  #   volumes:
  #     - db-data:/var/opt/mssql

volumes:
  db-data:
EOF
echo "  ✓ docker-compose.yml created"

# Create README for new structure
cat > README_NEW_STRUCTURE.md << 'EOF'
# Speakable Project - New Structure

## 📁 Project Structure

```
/Speakable
├── /client                 # Frontend application
│   ├── /public            # Static files
│   ├── /src               # Source code
│   │   ├── /assets        # Images, fonts, etc.
│   │   ├── /components    # Reusable components
│   │   ├── /pages         # Page components
│   │   ├── /routes        # Client-side routing
│   │   ├── /services      # API services, utilities
│   │   ├── /styles        # CSS files
│   │   ├── App.jsx        # Main app component
│   │   └── main.js        # Entry point
│   └── package.json
│
├── /server                # Backend application
│   ├── /config           # Configuration files
│   ├── /controllers      # Route controllers
│   ├── /middleware       # Express middleware
│   ├── /models           # Database models
│   ├── /routes           # API routes
│   ├── /services         # Business logic
│   ├── /ssl              # SSL certificates
│   ├── server.js         # Server entry point
│   └── package.json
│
├── .env                   # Environment variables
├── docker-compose.yml     # Docker configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Development

1. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start development servers:**
   ```bash
   # Terminal 1 - Start server
   cd server && npm run dev

   # Terminal 2 - Start client
   cd client && npm run dev
   ```

3. **Access the application:**
   - Client: http://localhost:3000
   - Server: https://localhost:443

### Production

1. **Build client:**
   ```bash
   cd client && npm run build
   ```

2. **Start server:**
   ```bash
   cd server && npm start
   ```

### Docker

```bash
docker-compose up
```

## 📝 Migration Notes

- HTML files are now in `client/src/pages/`
- CSS files are in `client/src/styles/`
- JavaScript files are in `client/src/services/`
- Server routes remain in `server/routes/`
- Database files moved to `server/models/`

## 🔄 Next Steps

1. Create controllers for routes
2. Implement service layer pattern
3. Add error handling middleware
4. Set up database models properly
5. Consider migrating to React/Vue for client
EOF
echo "  ✓ README created"

echo ""
echo "✅ Project reorganization complete!"
echo ""
echo "📋 Summary:"
echo "  • Backup created in: $BACKUP_DIR"
echo "  • Client files moved to: client/"
echo "  • Server files moved to: server/"
echo "  • Configuration files created"
echo "  • Docker setup added"
echo ""
echo "📌 Next steps:"
echo "  1. Review the new structure"
echo "  2. Install dependencies: cd client && npm install && cd ../server && npm install"
echo "  3. Update import paths in JavaScript files"
echo "  4. Test the application"
echo ""
echo "💡 Old files are preserved in the backup folder"
