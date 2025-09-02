// Production-ready server with flexible configuration
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

// Load environment variables
dotenv.config();
dotenv.config({ path: '../.env' });

const app = express();

// Flexible port configuration
const USE_HTTPS = process.env.USE_HTTPS !== 'false';
const HTTPS_PORT = process.env.HTTPS_PORT || 8443; // Use 8443 instead of 443 to avoid permission issues
const HTTP_PORT = process.env.HTTP_PORT || 8080;   // Use 8080 instead of 80
const PORT = USE_HTTPS ? HTTPS_PORT : HTTP_PORT;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== DATABASE CONNECTION ==========
console.log("🔗 Connecting to database...");
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
    ? ["https://audiox.space", "https://www.audiox.space", "http://audiox.space", "http://www.audiox.space"]
    : ["http://localhost:3000", "http://localhost:8080", "https://localhost:8443", "http://localhost:8443"],
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

// Force HTTPS in production (only if running on standard ports)
if (process.env.NODE_ENV === "production" && USE_HTTPS) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https" && !req.secure) {
      const httpsUrl = `https://${req.hostname}:${HTTPS_PORT}${req.url}`;
      res.redirect(httpsUrl);
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

// Serve client source files
app.use("/styles", express.static(path.join(__dirname, "../client/src/styles")));
app.use("/services", express.static(path.join(__dirname, "../client/src/services")));
app.use("/assets", express.static(path.join(__dirname, "../client/src/assets")));
app.use("/src", express.static(path.join(__dirname, "../client/src")));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-secret-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: USE_HTTPS && process.env.NODE_ENV === "production",
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
  res.json({ message: "Hello from production server!" });
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

// ========== SERVER STARTUP ==========
if (USE_HTTPS) {
  // Check if SSL certificates exist
  const keyPath = path.join(__dirname, "ssl", "private.key");
  const certPath = path.join(__dirname, "ssl", "certificate.crt");
  
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error("❌ SSL certificates not found!");
    console.log("📝 Falling back to HTTP mode...");
    
    // Fallback to HTTP
    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
      console.log(`\n🌐 HTTP Server running (SSL certificates missing)`);
      console.log(`📡 Server: http://localhost:${HTTP_PORT}`);
      console.log(`🏠 Homepage: http://localhost:${HTTP_PORT}`);
      console.log(`🔐 Login: http://localhost:${HTTP_PORT}/login`);
      console.log(`\n⚠️  Warning: Running in HTTP mode. SSL certificates needed for HTTPS.`);
      console.log(`📁 Place certificates in: ${path.join(__dirname, "ssl")}/`);
    });
  } else {
    // HTTPS Server
    try {
      const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      
      const httpsServer = https.createServer(sslOptions, app);
      
      httpsServer.listen(HTTPS_PORT, "0.0.0.0", () => {
        console.log(`\n🔒 HTTPS Server running!`);
        console.log(`📡 Server: https://localhost:${HTTPS_PORT}`);
        console.log(`🏠 Homepage: https://localhost:${HTTPS_PORT}`);
        console.log(`🔐 Login: https://localhost:${HTTPS_PORT}/login`);
        
        if (HTTPS_PORT !== 443) {
          console.log(`\n📌 Note: Running on port ${HTTPS_PORT} (not 443)`);
          console.log(`   To use port 443, run with: sudo npm start`);
        }
      });
      
      // Optional HTTP redirect server
      if (process.env.ENABLE_HTTP_REDIRECT === "true") {
        const httpApp = express();
        httpApp.use((req, res) => {
          const httpsUrl = `https://${req.hostname}:${HTTPS_PORT}${req.url}`;
          res.redirect(301, httpsUrl);
        });
        
        http.createServer(httpApp).listen(HTTP_PORT, "0.0.0.0", () => {
          console.log(`↗️  HTTP Redirect server running on port ${HTTP_PORT}`);
        });
      }
      
    } catch (error) {
      console.error("❌ Error starting HTTPS server:", error.message);
      console.log("📝 Falling back to HTTP mode...");
      
      // Fallback to HTTP
      const httpServer = http.createServer(app);
      httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
        console.log(`\n🌐 HTTP Server running (HTTPS failed)`);
        console.log(`📡 Server: http://localhost:${HTTP_PORT}`);
        console.log(`🏠 Homepage: http://localhost:${HTTP_PORT}`);
        console.log(`🔐 Login: http://localhost:${HTTP_PORT}/login`);
      });
    }
  }
} else {
  // HTTP Server (when USE_HTTPS is false)
  const httpServer = http.createServer(app);
  httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
    console.log(`\n🌐 HTTP Server running!`);
    console.log(`📡 Server: http://localhost:${HTTP_PORT}`);
    console.log(`🏠 Homepage: http://localhost:${HTTP_PORT}`);
    console.log(`🔐 Login: http://localhost:${HTTP_PORT}/login`);
  });
}

export default app;
