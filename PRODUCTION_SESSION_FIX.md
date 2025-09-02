# Production Session Fix - Quick Setup

## The Problem
Your sessions currently disappear when server restarts because they're stored in memory.

## The Solution
Store sessions in your SQL Server database.

## Step 1: Install Package
```bash
npm install connect-mssql-v2
```

## Step 2: Create Sessions Table in Your Database
Run this SQL in your database:

```sql
CREATE TABLE Sessions (
    sid VARCHAR(255) PRIMARY KEY,
    session NVARCHAR(MAX) NOT NULL,
    expires DATETIME NOT NULL
);

CREATE INDEX IDX_expires ON Sessions(expires);
```

## Step 3: Update server.js

Replace your current session configuration:

### FROM THIS (Current):
```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);
```

### TO THIS (Production-Ready):
```javascript
import connectSqlServer from 'connect-mssql-v2';

// Create session store
const sessionStore = new connectSqlServer({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}, {
  table: 'Sessions',
  ttl: 24 * 60 * 60  // 24 hours in seconds
});

// Use the store
app.use(
  session({
    store: sessionStore,  // <-- ADD THIS LINE
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
      sameSite: "lax",
    },
  })
);
```

## Step 4: Test It
1. Login to your app
2. Restart the server
3. Refresh the page - you should STILL be logged in!

## Want Longer Sessions?

Change the maxAge:
```javascript
// 7 days
maxAge: 7 * 24 * 60 * 60 * 1000

// 30 days  
maxAge: 30 * 24 * 60 * 60 * 1000

// 1 year (for "remember me")
maxAge: 365 * 24 * 60 * 60 * 1000
```

## That's It!
Your sessions now:
- ✅ Survive server restarts
- ✅ Work in production
- ✅ Can be shared across multiple servers
- ✅ Are properly stored in your database
