# Authentication System Explained

## What is `isAuthenticated()`?

`isAuthenticated()` is a method provided by **Passport.js** that checks if a user has a valid session. It returns:
- `true` if the user is logged in (has a valid session)
- `false` if the user is not logged in (no session or expired session)

## How Sessions Work in Your App

### 1. **Session Creation Process**

When a user logs in successfully:

```javascript
// In login.js route
req.login(user, (err) => {
  // This creates a session and stores user info
  // After this, req.isAuthenticated() returns true
});
```

### 2. **Session Storage**

Your app uses **express-session** to manage sessions:
- Sessions are stored in server memory (default)
- Each session has a unique ID stored in a cookie on the user's browser
- The cookie name is `connect.sid` by default

### 3. **Session Flow**

```
User Login → Password Verified → req.login() → Session Created → Cookie Sent to Browser
                                                        ↓
                                              req.isAuthenticated() = true
```

## What Changed in Your Login Logic

### Before (No Session):
```javascript
// Old login route - NO SESSION CREATED
router.post("/", async (req, res) => {
  const result = await loginUser(email, password);
  res.json(result); // Just returned success/fail, no session
});
```

### After (With Session):
```javascript
// New login route - SESSION CREATED
router.post("/", async (req, res) => {
  const result = await loginUser(email, password);
  
  if (result.success) {
    req.login(user, (err) => {  // ← Creates Passport session
      // Now req.isAuthenticated() returns true
      res.json(result);
    });
  }
});
```

## Where `isAuthenticated()` is Used

### 1. **Protecting Routes** (server.js)
```javascript
// Dashboard - only accessible if logged in
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {  // ← Checks if user has valid session
    res.sendFile("Dashboard.html");
  } else {
    res.redirect("/login");
  }
});
```

### 2. **Smart Redirects** (server.js)
```javascript
// Homepage - redirect logged-in users to dashboard
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {  // ← If logged in
    return res.redirect("/dashboard");  // Go to dashboard
  }
  res.sendFile("HomePage.html");  // Otherwise show landing page
});
```

### 3. **Preventing Double Login** (server.js)
```javascript
// Login page - redirect if already logged in
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {  // ← Already logged in?
    return res.redirect("/dashboard");  // Go to dashboard
  }
  res.sendFile("LoginPage.html");
});
```

## How Passport Session Works

### Serialization (Storing User in Session)
```javascript
passport.serializeUser((user, done) => {
  done(null, user.AccountID);  // Store only user ID in session
});
```

### Deserialization (Retrieving User from Session)
```javascript
passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);  // Get full user from database
  done(null, user);  // Attach to req.user
});
```

## Session Lifecycle

1. **Login**: User provides credentials → Verified → `req.login()` → Session created
2. **Subsequent Requests**: Cookie sent → Session retrieved → User loaded → `req.isAuthenticated() = true`
3. **Logout**: `req.logout()` → Session destroyed → Cookie cleared → `req.isAuthenticated() = false`

## Testing Your Authentication

### Test if Session Works:
```javascript
// Add this test route to server.js
app.get("/api/check-auth", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user ? { 
      id: req.user.AccountID, 
      email: req.user.Email 
    } : null
  });
});
```

Then test:
1. Visit `/api/check-auth` before login → `authenticated: false`
2. Login via `/login`
3. Visit `/api/check-auth` again → `authenticated: true` with user info
4. Logout via `/api/logout`
5. Visit `/api/check-auth` → `authenticated: false`

## Common Issues & Solutions

### Issue 1: `isAuthenticated()` always returns false
**Cause**: Session not being created after login
**Solution**: Ensure `req.login()` is called after successful authentication

### Issue 2: Session lost on page refresh
**Cause**: Session storage issue or cookie settings
**Solution**: Check session configuration in server.js

### Issue 3: Can't access protected routes after login
**Cause**: Session not persisting or Passport not initialized
**Solution**: Ensure these middleware are set up in order:
```javascript
app.use(session({...}));          // 1. Session middleware
app.use(passport.initialize());   // 2. Initialize Passport
app.use(passport.session());      // 3. Passport session support
```

## Session Security Settings

Your current session configuration:
```javascript
session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only in production
    httpOnly: true,      // Prevent XSS attacks
    maxAge: 24*60*60*1000,  // 24 hours
    sameSite: "lax"      // CSRF protection
  }
})
```

## Summary

- **`isAuthenticated()`**: Passport method that checks if user is logged in
- **Where it's used**: Route protection, smart redirects, access control
- **How it works**: Checks if there's a valid session with user data
- **Key change**: Your login/register routes now create sessions with `req.login()`
- **Result**: Dashboard and other protected routes now work properly
