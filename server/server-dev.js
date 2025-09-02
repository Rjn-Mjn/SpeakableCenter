// Development server configuration - HTTP only
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import "./config/passport.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
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
const PORT = process.env.DEV_PORT || 3000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== DATABASE CONNECTION ==========
console.log("🔗 Testing database connection...");
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

// CORS configuration for development
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:80",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:80"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security headers with relaxed CSP for development
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

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

// ========== STATIC FILES ==========
// Serve client public files
app.use(express.static(path.join(__dirname, "../client/public")));

// Serve client source files for development
app.use("/styles", express.static(path.join(__dirname, "../client/src/styles")));
app.use("/services", express.static(path.join(__dirname, "../client/src/services")));
app.use("/assets", express.static(path.join(__dirname, "../client/src/assets")));
app.use("/src", express.static(path.join(__dirname, "../client/src")));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret-change-this",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTP for development
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
  res.json({ message: "Hello from development server!" });
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

// ========== START SERVER ==========
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Development Server Started!`);
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`🏠 Homepage: http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`\n📌 Press Ctrl+C to stop the server\n`);
});

export default app;
