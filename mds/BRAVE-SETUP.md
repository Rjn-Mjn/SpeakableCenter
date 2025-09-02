# Brave Browser Configuration for Speakable

## Issue
Brave browser has stricter security policies that may block your website when accessing it directly via `https://localhost` or using a CloudFlare Origin Certificate.

## Solutions

### Option 1: Access Through CloudFlare (Recommended for Production)
1. Access your site through: **https://audiox.space**
2. This will use CloudFlare's SSL certificate which Brave trusts

### Option 2: Configure Brave for Local Development

#### Method A: Disable Shields for Localhost
1. Visit `https://localhost` in Brave
2. Click the Brave Shield icon (lion icon) in the address bar
3. Toggle "Shields Down for this site"
4. Reload the page

#### Method B: Accept the Certificate
1. When you see the security warning in Brave:
   - Click "Advanced"
   - Click "Proceed to localhost (unsafe)"
2. The certificate will be temporarily accepted for this session

#### Method C: Add Certificate Exception (Permanent)
1. Open Brave Settings: `brave://settings/`
2. Go to Privacy and Security → Security
3. Click on "Manage certificates"
4. Import the CloudFlare Origin Certificate as trusted
   - Location: `/run/media/peterlovwood/STORAGE/Speakable/server/ssl/certificate.crt`

### Option 3: Use HTTP for Local Testing
If you don't need HTTPS for local testing:
```bash
# Run the development server on HTTP port 3000
npm run dev
```
Then access: **http://localhost:3000**

## Current Server Status
✅ **Production Server Running:**
- HTTPS: https://localhost:443 (requires certificate acceptance)
- HTTP: http://localhost:80 (redirects to HTTPS)
- Static files: All CSS, JS, and assets are being served correctly

## Server Configuration Fixed:
1. ✅ Added proper static file routing for `/styles`, `/services`, `/assets`
2. ✅ Updated Content Security Policy for Brave compatibility
3. ✅ Added CloudFlare-aware headers
4. ✅ CORS configured for audiox.space domain

## Testing Your Site

### From Brave (with shields down or certificate accepted):
```
https://audiox.space     # Production via CloudFlare
https://localhost        # Direct local access
```

### From Other Browsers (Zen, Firefox, Chrome):
These browsers are typically less strict and should work without additional configuration.

## Troubleshooting

If you still see errors in Brave console:
1. Clear Brave's cache: `Ctrl+Shift+Delete`
2. Check if Brave Shields is blocking resources
3. Verify in DevTools Network tab that resources are loading with 200 status
4. Check Console for specific CSP violations

## Important Notes
- The CloudFlare Origin Certificate is meant for CloudFlare ↔ Origin Server communication
- Browsers don't trust it directly, which is why you see warnings
- In production, users access through CloudFlare (audiox.space) which provides a trusted certificate
- For local development, use the development server (`npm run dev`) to avoid certificate issues
