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
// import path from "path";

// Import routes
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import googleCallbackRouter from "./routes/googleAuthCallback.js";
import uploadAvatarHandler from "./routes/upload-avatar.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Import database
import { connectDB, testConnection } from "./config/db.js";
import { createSessionTable, getDbConfig } from "./models/sql.js";
import connectSqlServer from "connect-mssql-v2";

dotenv.config({ path: "../.env" }); // Load .env from root

const app = express();
const PORT = process.env.PORT || 443;
const HTTP_PORT = process.env.HTTP_PORT || 80;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== DATABASE CONNECTION ==========
testConnection();

// Create Sessions table if it doesn't exist
createSessionTable();

// ========== SECURITY CONFIGURATION ==========
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many authentication attempts" },
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://audiox.space",
          "https://www.audiox.space",
          "http://audiox.space",
          "http://www.audiox.space",
        ]
      : [
          "http://localhost:3000",
          "http://localhost:80",
          "https://localhost:443",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Security headers with updated CSP - More permissive for Brave and CloudFlare
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https:", "http:"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-hashes'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "'unsafe-hashes'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://static.cloudflareinsights.com", // CloudFlare analytics
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://static.cloudflareinsights.com", // CloudFlare beacon
        ],
        scriptSrcAttr: [
          "'unsafe-inline'", // Allow all inline event handlers
        ],
        imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
          "https://apis.google.com",
          "https://cloudflareinsights.com", // CloudFlare analytics
          "wss:",
          "ws:",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://cdnjs.cloudflare.com",
          "https://fonts.gstatic.com",
          "https://fonts.googleapis.com",
        ],
        frameSrc: ["https://accounts.google.com", "'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: false, // Set to false for CloudFlare compatibility
    },
  })
);

// Additional headers for Brave compatibility
app.use((req, res, next) => {
  // Allow Brave to access resources
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // CloudFlare compatibility
  if (req.headers["cf-connecting-ip"]) {
    req.realIP = req.headers["cf-connecting-ip"];
  }

  next();
});

// Force HTTPS in production (CloudFlare aware)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    // Check CloudFlare's forwarded proto or standard header
    const proto = req.header("x-forwarded-proto") || req.header("cf-visitor");

    if (proto && !proto.includes("https")) {
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

// ========== CACHE CONTROL ==========
// Cache-busting middleware for development
const setCacheHeaders = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    // Development: No cache at all
    res.set({
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });
  } else {
    // Production: Smart caching
    const fileExt = path.extname(req.url).toLowerCase();

    // Version-controlled assets can be cached forever
    if ([".css", ".js"].includes(fileExt) && req.url.includes("?v=")) {
      res.set({
        "Cache-Control": "public, max-age=31536000, immutable",
        Expires: new Date(Date.now() + 31536000000).toUTCString(),
      });
    }
    // Images, fonts can be cached for a week
    else if (
      [".jpg", ".jpeg", ".png", ".gif", ".svg", ".woff", ".woff2"].includes(
        fileExt
      )
    ) {
      res.set({
        "Cache-Control": "public, max-age=604800",
        Expires: new Date(Date.now() + 604800000).toUTCString(),
      });
    }
    // HTML should always be fresh
    else if (fileExt === ".html" || req.url === "/") {
      res.set({
        "Cache-Control": "no-cache, must-revalidate",
        Expires: "0",
      });
    }
  }
  next();
};

// Apply cache headers to all static files
app.use(setCacheHeaders);

// ========== STATIC FILES ==========
// Serve client public files with specific cache settings
app.use(
  express.static(path.join(__dirname, "../client/public"), {
    etag: process.env.NODE_ENV === "production",
    lastModified: process.env.NODE_ENV === "production",
    index: false, // We'll handle index.html separately
    redirect: false,
    setHeaders: (res, path) => {
      // Cho phép ảnh load từ domain khác
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(
  "/preview",
  express.static(path.join(__dirname, "../client/public/preview"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Serve client source files - REQUIRED for both dev and production
// These paths are referenced in the HTML files
const staticOptions = {
  etag: process.env.NODE_ENV === "production",
  lastModified: process.env.NODE_ENV === "production",
  redirect: false,
};

app.use(
  "/styles",
  express.static(path.join(__dirname, "../client/src/styles"), staticOptions)
);
app.use(
  "/services",
  express.static(path.join(__dirname, "../client/src/services"), staticOptions)
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/src/assets"), staticOptions)
);

// Optional: Full src access for development
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/src",
    express.static(path.join(__dirname, "../client/src"), staticOptions)
  );
}

// Session configuration with SQL Server store
const sessionStore = new connectSqlServer(
  getDbConfig(), // Use your existing database config
  {
    table: "Sessions",
    ttl: 24 * 60 * 60, // 24 hours in seconds
    autoRemove: "interval",
    autoRemoveInterval: 60, // Check every 60 minutes
    useUTC: false,
  }
);

app.use(
  session({
    store: process.env.NODE_ENV === "production" ? sessionStore : undefined, // Use SQL store in production
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ========== API ROUTES ==========
app.use("/api/login", authLimiter, loginRouter);
app.use("/api/register", authLimiter, registerRouter);
// app.use("/api/auth/google", googleCallbackRouter);

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);

    // Nếu không có user (login fail or special info)
    if (!user) {
      // info chứa các thông tin do done(..., false, info) trả về
      if (info && info.requiresRegistration) {
        // lưu tạm profile vào session để frontend dùng prefill form
        req.session.pendingGoogleAuth = {
          email: info.email,
          googleId: info.googleId,
          suggestedFullName: info.suggestedFullName,
          AvatarLink: info.AvatarLink,
        };
        console.log("redirecting to login/register page (pending)");
        return res.redirect("/login?registration_required=true");
      }

      // account bị block (ví dụ info.message = 'account-blocked')
      if (info && info.message === "account-blocked") {
        return res.redirect("/login?error=account_blocked");
      }

      // fallback: auth failed
      return res.redirect("/login?error=auth_failed");
    }

    // Nếu có user thật -> login vào session
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      // Nếu user có status pending/blocked/active -> redirect theo status
      // res.json({ success: true, message: "login-success" });
      // return res.redirect("/login?login_success=true");

      return res.redirect("/dashboard"); // active
    });
  })(req, res, next); // gọi middleware ngay
});

// API endpoints
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from updated server!" });
});

app.get("/api/config", (req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID });
});

// Logout route
// server.js (thay thế route logout hiện tại)
app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout failed");
    if (req.session) {
      if (req.session.passport) delete req.session.passport;
      req.session.destroy(() => {
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
        // full browser redirect
        return res.redirect(303, "/");
      });
    } else {
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect(303, "/");
    }
  });
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

// Debug endpoint for checking authentication status
app.get("/api/check-auth", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    sessionID: req.sessionID,
    user: req.user
      ? {
          AccountID: req.user.AccountID,
          Email: req.user.Email,
          FullName: req.user.Fullname,
          GoogleID: req.user.GoogleID,
          Status: req.user.Status,
        }
      : null,
  });
});

app.get("/api/me", requireAuthApi, (req, res) => {
  const u = req.user;

  res.json(u);
});

app.get("/api/upload-avatar", uploadAvatarHandler);

// ========== PAGE ROUTES ==========
// Serve HTML pages
function requireAuthApi(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "not_authenticated" });
}

function ensureAuthenticated(req, res, next) {
  console.log("authorizing");

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

function redirectByStatus(req, res, next) {
  const status = req.user?.Status;
  const role = req.user.RoleName;

  if (status === "pending" || role === "Guest") {
    return res.redirect("/login/pending");
  } else if (status === "blocked") {
    return res.redirect("/login/blocked");
  } else if (status === "active") {
    return res.redirect("/dashboard");
  }
  return next(); // fallback: cho đi tiếp (ví dụ homepage)
}

// Trang chủ: nếu login thì redirect theo status, nếu không thì show homepage
app.get("/", (req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");

  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user.Status === "active" && req.user.RoleName !== "Guest") {
      // res.sendFile(path.join(__dirname, "../client/src/pages/Dashboard.html"));
      res.sendFile(
        path.join(__dirname, "../client/public/dashboard/index.html")
      );
    } else {
      redirectByStatus(req, res);
    }
  } else {
    res.sendFile(path.join(__dirname, "../client/src/pages/HomePage.html"));
  }
});

// Trang login: nếu login rồi thì redirect theo status
app.get("/login", (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return redirectByStatus(req, res, next);
  }
  res.sendFile(path.join(__dirname, "../client/src/pages/LoginPage.html"));
});

// Trang register → luôn redirect về login
app.get("/register", (req, res) => {
  res.redirect("/login");
});

// Dashboard: chỉ cho active
app.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log("checking status");

  if (req.user.Status === "active" && req.user.RoleName !== "Guest") {
    // res.sendFile(path.join(__dirname, "../client/src/pages/Dashboard.html"));
    // res.sendFile(path.join(__dirname, "../client/public/dashboard/index.html"));
    res.redirect("/");
  } else {
    redirectByStatus(req, res);
  }
});

// Pending
app.get("/login/pending", ensureAuthenticated, (req, res) => {
  if (req.user.Status === "pending" || req.user.RoleName === "Guest") {
    res.sendFile(path.join(__dirname, "../client/src/pages/PendingPage.html"));
  } else {
    redirectByStatus(req, res);
  }
});

// Blocked
app.get("/login/blocked", ensureAuthenticated, (req, res) => {
  if (req.user.Status === "blocked") {
    res.sendFile(path.join(__dirname, "../client/src/pages/BlockedPage.html"));
  } else {
    redirectByStatus(req, res);
  }
});

// ========== ERROR HANDLING ==========
app.use(notFound);
app.use(errorHandler);

// ========== HTTPS SERVER ==========
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private.key")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.crt")),
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
    console.log(
      `↗️  HTTP Redirect server running at http://localhost:${HTTP_PORT}`
    );
  });
}

export default app;
