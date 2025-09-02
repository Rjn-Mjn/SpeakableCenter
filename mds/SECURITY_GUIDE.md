# Website Security Configuration Guide

## 🔒 Complete Security Setup for Cloudflare + Express.js

### 1. Cloudflare Dashboard Settings

#### A. SSL/TLS Configuration
**CRITICAL: Upgrade from Flexible to Full (Strict)**

1. Go to **SSL/TLS > Overview**
2. Change encryption mode from **"Flexible"** to **"Full (Strict)"**
3. Enable **"Always Use HTTPS"** in SSL/TLS > Edge Certificates
4. Enable **"HTTP Strict Transport Security (HSTS)**:
   - Max Age: 12 months
   - Include subdomains: Yes
   - Preload: Yes

#### B. Security Settings
Go to **Security > Settings**:

1. **Security Level**: Medium or High
2. **Bot Fight Mode**: On
3. **Challenge Passage**: 30 minutes
4. **Browser Integrity Check**: On

#### C. Page Rules
Create these page rules for better security:

1. **Rule 1**: `*audiox.space/*`
   - Always Use HTTPS: On
   - Security Level: High

2. **Rule 2**: `*audiox.space/api/*`
   - Security Level: High
   - Browser Cache TTL: Respect Existing Headers

#### D. Firewall Rules
Go to **Security > WAF**:

1. **Create Custom Rule**:
   - Rule name: "Block SQL Injection"
   - Expression: `(http.request.uri.query contains "union" or http.request.uri.query contains "select" or http.request.uri.query contains "drop")`
   - Action: Block

2. **Create Custom Rule**:
   - Rule name: "Rate Limit API"
   - Expression: `(http.request.uri.path contains "/api/")`
   - Action: Challenge
   - Rate: 30 requests per minute

### 2. Origin Server SSL Certificate (Required for Full Strict)

Since you're using cloudflared tunnel, you need to secure the connection between Cloudflare and your server:

#### Option 1: Cloudflare Origin Certificate (Recommended)
1. Go to **SSL/TLS > Origin Server**
2. Click **"Create Certificate"**
3. Choose **"Let Cloudflare generate a private key and a CSR"**
4. Add hostnames: `audiox.space, *.audiox.space`
5. Choose key type: **RSA (2048)**
6. Download both the certificate and private key

#### Option 2: Self-Signed Certificate (Quick Setup)
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=audiox.space"
```

### 3. Environment Variables Security

**IMPORTANT**: Update your SESSION_SECRET in `.env`:

```env
# Generate a secure session secret
SESSION_SECRET=your-actual-super-secure-random-32-character-string-here
```

Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Additional Cloudflare Security Features

#### A. DNS Settings
1. **Proxy Status**: Proxied (Orange cloud) ✅
2. **DNSSEC**: Enable if available

#### B. Speed Optimization + Security
1. **Auto Minify**: Enable CSS, JS, HTML
2. **Brotli Compression**: On
3. **Early Hints**: On

#### C. Network Settings
1. **gRPC**: On (if needed)
2. **WebSockets**: On (if needed)
3. **Onion Routing**: On

### 5. Server Security Checklist ✅

Your Express.js server now includes:

- ✅ **Helmet.js**: Security headers (XSS, CSRF, Clickjacking protection)
- ✅ **Rate Limiting**: General (100/15min) + Auth routes (10/15min)
- ✅ **CORS Protection**: Configured for your domain
- ✅ **HTTPS Enforcement**: Automatic redirects in production
- ✅ **Secure Sessions**: HttpOnly, Secure, SameSite cookies
- ✅ **Input Validation**: Body size limits
- ✅ **Error Handling**: Proper error responses
- ✅ **Proxy Trust**: Configured for Cloudflare

### 6. Monitoring & Maintenance

#### A. Regular Security Checks
- Monitor Cloudflare Analytics for unusual traffic
- Check Security Events in Cloudflare dashboard
- Review server logs for failed authentication attempts

#### B. Keep Dependencies Updated
```bash
npm audit
npm update
```

#### C. Backup Strategy
- Regular database backups
- Configuration file backups
- Monitor uptime with services like UptimeRobot

### 7. Testing Your Security

#### Test HTTPS Redirect:
```bash
curl -I http://audiox.space
# Should return 301/302 redirect to https://
```

#### Test Rate Limiting:
```bash
# Make multiple rapid requests to test rate limiting
for i in {1..15}; do curl -I https://audiox.space/api/login; done
```

#### Test Security Headers:
```bash
curl -I https://audiox.space
# Look for headers like X-Frame-Options, X-Content-Type-Options, etc.
```

### 8. Emergency Procedures

If your site gets compromised:

1. **Immediate Steps**:
   - Enable "Under Attack Mode" in Cloudflare
   - Change all passwords and secrets
   - Review access logs

2. **Recovery**:
   - Update all dependencies
   - Regenerate session secrets
   - Review and update firewall rules

### 9. Performance vs Security Balance

Current settings provide strong security while maintaining good performance:
- Rate limiting prevents abuse without blocking legitimate users
- CSP allows necessary external resources (Google OAuth, CDN fonts)
- HTTPS enforcement with optimal caching

---

## 🚨 IMPORTANT NEXT STEPS:

1. **Generate a new SESSION_SECRET** and update your .env file
2. **Change Cloudflare SSL from Flexible to Full (Strict)**
3. **Set up Origin Certificate** or self-signed certificate
4. **Configure Cloudflare security settings** as outlined above
5. **Test all functionality** after making changes

After implementing these changes, your website will have enterprise-grade security! 🔐
