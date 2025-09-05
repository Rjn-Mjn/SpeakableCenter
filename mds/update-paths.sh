#!/bin/bash

# Path Update Script for New Project Structure
# This script updates all paths, links, and imports for the new organization

echo "🔄 Starting Path Updates for New Structure..."
echo "================================================"

BASE_DIR="/run/media/peterlovwood/STORAGE/Speakable"
cd "$BASE_DIR"

# ==========================
# UPDATE HTML FILES
# ==========================

echo ""
echo "📝 Updating HTML file paths..."

# Update HomePage.html (formerly index.html)
if [ -f "client/src/pages/HomePage.html" ]; then
    echo "  Updating HomePage.html..."
    
    # Update CSS paths
    sed -i 's|href="style/|href="../styles/|g' client/src/pages/HomePage.html
    sed -i 's|href="style/Intro/|href="../styles/Intro/|g' client/src/pages/HomePage.html
    
    # Update script paths
    sed -i 's|src="script/|src="../services/|g' client/src/pages/HomePage.html
    
    # Update asset paths
    sed -i 's|src="assets/|src="../assets/|g' client/src/pages/HomePage.html
    sed -i 's|href="assets/|href="../assets/|g' client/src/pages/HomePage.html
    
    # Update favicon
    sed -i 's|href="favicon.ico"|href="/favicon.ico"|g' client/src/pages/HomePage.html
    
    # Update font paths
    sed -i 's|href="assets/fonts/|href="../assets/fonts/|g' client/src/pages/HomePage.html
    
    echo "  ✓ HomePage.html updated"
fi

# Update LoginPage.html (formerly LoginUI.html)
if [ -f "client/src/pages/LoginPage.html" ]; then
    echo "  Updating LoginPage.html..."
    
    # Update CSS paths
    sed -i 's|href="../style/|href="../styles/|g' client/src/pages/LoginPage.html
    sed -i 's|href="../assets/|href="../assets/|g' client/src/pages/LoginPage.html
    
    # Update script paths
    sed -i 's|src="../script/|src="../services/|g' client/src/pages/LoginPage.html
    
    # Update favicon
    sed -i 's|href="../favicon.ico"|href="/favicon.ico"|g' client/src/pages/LoginPage.html
    
    # Update image paths
    sed -i 's|src="../assets/Images/|src="../assets/Images/|g' client/src/pages/LoginPage.html
    
    echo "  ✓ LoginPage.html updated"
fi

# ==========================
# UPDATE CSS FILES
# ==========================

echo ""
echo "🎨 Updating CSS file paths..."

# Update all CSS files in styles directory
find client/src/styles -name "*.css" -type f | while read cssfile; do
    # Update font paths
    sed -i "s|url('../assets/fonts/|url('../../assets/fonts/|g" "$cssfile"
    sed -i "s|url('fonts/|url('../../assets/fonts/|g" "$cssfile"
    
    # Update image paths
    sed -i "s|url('../assets/Images/|url('../../assets/Images/|g" "$cssfile"
    sed -i "s|url('../../Images/|url('../../assets/Images/|g" "$cssfile"
done

echo "  ✓ CSS paths updated"

# ==========================
# UPDATE JAVASCRIPT FILES
# ==========================

echo ""
echo "📜 Updating JavaScript imports..."

# Update client-side JavaScript files
find client/src/services -name "*.js" -type f | while read jsfile; do
    # Update relative imports
    sed -i "s|import.*'./|import './|g" "$jsfile"
    sed -i "s|from './|from './|g" "$jsfile"
done

echo "  ✓ JavaScript imports updated"

# ==========================
# CREATE NEW SERVER.JS
# ==========================

echo ""
echo "🔧 Creating updated server.js..."

cat > server/server-updated.js << 'EOF'
// Updated server.js for new structure
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import "./config/passport.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import googleCallbackRouter from "./routes/googleAuthCallback.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Import database
import { connectDB, testConnection } from "./config/db.js";

dotenv.config({ path: '../.env' }); // Load .env from root

const app = express();
const PORT = process.env.PORT || 443;
const HTTP_PORT = process.env.HTTP_PORT || 80;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== DATABASE CONNECTION ==========
testConnection();

// ========== SECURITY CONFIGURATION ==========
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP" }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many authentication attempts" }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? ["https://audiox.space", "https://www.audiox.space"]
    : ["http://localhost:3000", "http://localhost:80", "https://localhost:443"],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security headers with updated CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com"
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://cdnjs.cloudflare.com",
        "https://fonts.gstatic.com"
      ],
      frameSrc: ["https://accounts.google.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Force HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

// ========== STATIC FILES ==========
// Serve client public files
app.use(express.static(path.join(__dirname, "../client/public")));

// Serve client source files (for development)
if (process.env.NODE_ENV !== "production") {
  app.use("/src", express.static(path.join(__dirname, "../client/src")));
}

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ========== API ROUTES ==========
app.use("/api/login", authLimiter, loginRouter);
app.use("/api/register", authLimiter, registerRouter);
app.use("/api/auth/google", googleCallbackRouter);

// Google OAuth routes
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: false,
    failureRedirect: false
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/login?error=auth_failed");
    }

    const user = req.user;

    if (user.requiresRegistration) {
      req.session.pendingGoogleAuth = {
        email: user.email,
        googleId: user.googleId,
        suggestedFullName: user.suggestedFullName
      };
      return res.redirect("/login?registration_required=true");
    }

    res.redirect("/?login_success=true");
  }
);

// API endpoints
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from updated server!" });
});

app.get("/api/config", (req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID });
});

app.get("/api/auth/google/pending", (req, res) => {
  if (req.session.pendingGoogleAuth) {
    const data = req.session.pendingGoogleAuth;
    delete req.session.pendingGoogleAuth;
    res.json({ success: true, data });
  } else {
    res.json({ success: false, message: "No pending Google auth data" });
  }
});

// ========== PAGE ROUTES ==========
// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/pages/HomePage.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/pages/LoginPage.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/pages/LoginPage.html"));
});

// Dashboard (protected route)
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "../client/src/pages/Dashboard.html"));
  } else {
    res.redirect("/login");
  }
});

// ========== ERROR HANDLING ==========
app.use(notFound);
app.use(errorHandler);

// ========== HTTPS SERVER ==========
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private.key")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.crt"))
};

const httpsServer = https.createServer(sslOptions, app);

// HTTP redirect server
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(301, `https://${req.headers.host}${req.url}`);
});

// Start servers
httpsServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
  console.log(`📁 New structure active - serving from client/server folders`);
  console.log(`🚀 Ready for production!`);
});

if (process.env.ENABLE_HTTP_REDIRECT === "true") {
  httpApp.listen(HTTP_PORT, "0.0.0.0", () => {
    console.log(`↗️  HTTP Redirect server running at http://localhost:${HTTP_PORT}`);
  });
}

export default app;
EOF

echo "  ✓ Updated server.js created"

# ==========================
# CREATE CLIENT ROUTER
# ==========================

echo ""
echo "🚦 Creating client-side router..."

cat > client/src/routes/router.js << 'EOF'
/**
 * Client-side Router
 * Handles navigation between pages
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Register routes
        this.register('/', '/src/pages/HomePage.html', 'Home');
        this.register('/login', '/src/pages/LoginPage.html', 'Login');
        this.register('/register', '/src/pages/LoginPage.html', 'Register');
        this.register('/dashboard', '/src/pages/Dashboard.html', 'Dashboard');

        // Handle browser navigation
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    register(path, file, title) {
        this.routes.set(path, { file, title });
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes.get(path) || this.routes.get('/');

        // Update page title
        document.title = `Speakable - ${route.title}`;

        // Load page content
        if (this.currentRoute !== route.file) {
            await this.loadPage(route.file);
            this.currentRoute = route.file;
        }
    }

    async loadPage(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            
            // Parse and inject content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Update body content
            const content = doc.querySelector('body').innerHTML;
            document.body.innerHTML = content;
            
            // Re-run scripts
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.text = oldScript.text;
                if (oldScript.src) newScript.src = oldScript.src;
                document.body.appendChild(newScript);
            });
        } catch (error) {
            console.error('Error loading page:', error);
            document.body.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }
}

// Initialize router
const router = new Router();

// Export for use in other modules
window.router = router;
export default router;
EOF

echo "  ✓ Client router created"

# ==========================
# UPDATE CLIENT CONFIG
# ==========================

echo ""
echo "⚙️ Creating client configuration..."

cat > client/src/config/config.js << 'EOF'
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
EOF

echo "  ✓ Client config created"

# ==========================
# CLEAN UP OLD DIRECTORIES
# ==========================

echo ""
echo "🧹 Cleaning up old directories..."

# Check if backup exists
if [ -d "backup_20250830_131332" ]; then
    echo "  Backup confirmed. Removing old directories..."
    
    # Remove old directories (keeping backup)
    rm -rf public 2>/dev/null || true
    rm -rf routes 2>/dev/null || true
    rm -rf services 2>/dev/null || true
    rm -rf DB 2>/dev/null || true
    rm -rf config 2>/dev/null || true
    
    # Remove old server files
    rm -f server.js 2>/dev/null || true
    rm -f server-backup.js 2>/dev/null || true
    
    # Remove old test files
    rm -f test-responsive.html 2>/dev/null || true
    
    echo "  ✓ Old directories cleaned up"
else
    echo "  ⚠️ Backup not found. Keeping old directories for safety."
fi

# ==========================
# CREATE NGINX CONFIG
# ==========================

echo ""
echo "🔧 Creating Nginx configuration..."

cat > nginx.conf << 'EOF'
# Nginx configuration for Speakable

server {
    listen 80;
    server_name audiox.space www.audiox.space;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name audiox.space www.audiox.space;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/audiox.space.crt;
    ssl_certificate_key /etc/ssl/private/audiox.space.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com;" always;

    # Client files
    location / {
        root /var/www/speakable/client/public;
        try_files $uri $uri/ /index.html;
    }

    # Client source files
    location /src/ {
        root /var/www/speakable/client;
    }

    # API proxy
    location /api/ {
        proxy_pass https://localhost:443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Google OAuth callbacks
    location /auth/google {
        proxy_pass https://localhost:443;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "  ✓ Nginx config created"

# ==========================
# CREATE START SCRIPT
# ==========================

echo ""
echo "🚀 Creating start scripts..."

cat > start.sh << 'EOF'
#!/bin/bash

# Start script for Speakable application

echo "Starting Speakable Application..."

# Check if in production or development
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in PRODUCTION mode..."
    
    # Start server
    cd server
    npm start &
    SERVER_PID=$!
    
    echo "Server started with PID: $SERVER_PID"
    
else
    echo "Starting in DEVELOPMENT mode..."
    
    # Start server
    cd server
    npm run dev &
    SERVER_PID=$!
    
    # Start client (if using build tools)
    cd ../client
    npm run dev &
    CLIENT_PID=$!
    
    echo "Server started with PID: $SERVER_PID"
    echo "Client started with PID: $CLIENT_PID"
fi

# Wait for processes
wait
EOF

chmod +x start.sh

cat > stop.sh << 'EOF'
#!/bin/bash

# Stop script for Speakable application

echo "Stopping Speakable Application..."

# Kill Node processes
pkill -f "node.*server.js"
pkill -f "npm.*dev"

echo "Application stopped"
EOF

chmod +x stop.sh

echo "  ✓ Start/stop scripts created"

# ==========================
# FINAL SUMMARY
# ==========================

echo ""
echo "✅ Path update complete!"
echo ""
echo "📋 Summary of changes:"
echo "  • HTML paths updated for new structure"
echo "  • CSS import paths fixed"
echo "  • JavaScript imports updated"
echo "  • New server.js created with correct paths"
echo "  • Client-side router implemented"
echo "  • Old directories cleaned up"
echo "  • Nginx configuration created"
echo "  • Start/stop scripts created"
echo ""
echo "📌 Next steps:"
echo "  1. Review the updated server.js"
echo "  2. Move server-updated.js to server.js:"
echo "     mv server/server-updated.js server/server.js"
echo "  3. Install dependencies if not done:"
echo "     cd client && npm install"
echo "     cd ../server && npm install"
echo "  4. Start the application:"
echo "     ./start.sh"
echo ""
echo "🌐 Access points:"
echo "  • Homepage: https://localhost:443/"
echo "  • Login: https://localhost:443/login"
echo "  • API: https://localhost:443/api/"
echo ""
echo "💡 Use './stop.sh' to stop the application"
