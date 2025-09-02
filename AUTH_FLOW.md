# Authentication Flow Documentation

## Overview
Your Speakable application now implements a proper authentication flow similar to GitHub and other modern web applications. When users log in, they are directed to a dashboard instead of back to the landing page.

## How It Works

### For Non-Authenticated Users:
1. **Visit `audiox.space` (/)** → See the landing page (HomePage.html)
2. **Visit `/login`** → See the login page
3. **Visit `/dashboard`** → Redirected to `/login`

### For Authenticated Users:
1. **Visit `audiox.space` (/)** → Automatically redirected to `/dashboard`
2. **Visit `/login`** → Automatically redirected to `/dashboard` (already logged in)
3. **Visit `/dashboard`** → See the dashboard

## Login Flow

### Email/Password Login:
1. User enters credentials on `/login`
2. Form submits to `/api/login`
3. On success → Redirect to `/dashboard`
4. On failure → Show error message

### Google OAuth Login:
1. User clicks Google login button
2. Redirected to Google for authentication
3. Google redirects back to `/auth/google/callback`
4. On success → Redirect to `/dashboard`
5. If new user → Show registration popup, then redirect to `/dashboard`

### Registration Flow:
1. User attempts login with unregistered email
2. Registration popup appears
3. User fills in details
4. Form submits to `/api/register`
5. On success → Redirect to `/dashboard` (auto-logged in)

## Logout Flow:
1. User clicks logout (on dashboard or any authenticated page)
2. Request to `/api/logout`
3. Session destroyed
4. Redirect to `/` (landing page)

## Key Changes Made:

### 1. **Client-Side (login.js)**
```javascript
// Old: window.location.href = "/?login_success=true";
// New: window.location.href = "/dashboard";
```

### 2. **Server-Side (server.js)**
```javascript
// Homepage route now checks authentication
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.sendFile("HomePage.html");
});

// Login route prevents already-logged-in users from seeing login page
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.sendFile("LoginPage.html");
});

// Google OAuth callback redirects to dashboard
res.redirect("/dashboard"); // instead of "/?login_success=true"
```

## User Experience Benefits:

1. **Clean URLs**: No more query parameters like `?login_success=true`
2. **Smart Routing**: Users always go where they should based on auth status
3. **Professional Flow**: Similar to GitHub, Google, and other major platforms
4. **Better UX**: Logged-in users never see the landing page unnecessarily
5. **Clear Separation**: Landing page for visitors, Dashboard for users

## Testing the Flow:

### Test Scenario 1: New Visitor
1. Go to `audiox.space` → Should see landing page
2. Click Login → Should see login page
3. Try to access `/dashboard` → Should redirect to `/login`

### Test Scenario 2: Successful Login
1. Login with valid credentials
2. Should be redirected to `/dashboard`
3. Go to `audiox.space` → Should redirect to `/dashboard`
4. Go to `/login` → Should redirect to `/dashboard`

### Test Scenario 3: Logout
1. While logged in, click Logout
2. Should be redirected to landing page
3. Go to `/dashboard` → Should redirect to `/login`

## Security Considerations:

- Dashboard is protected at the server level
- Authentication checks happen before serving any protected content
- Session-based authentication prevents unauthorized access
- All redirects are server-side for security

## Future Enhancements:

1. Add "Remember Me" functionality
2. Implement role-based access (student, teacher, admin)
3. Add more protected routes (profile, settings, courses)
4. Implement session timeout warnings
5. Add two-factor authentication option
