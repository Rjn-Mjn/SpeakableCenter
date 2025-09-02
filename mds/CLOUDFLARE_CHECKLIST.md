# 🔒 Cloudflare Security Configuration Checklist

## ✅ Already Completed
- [x] **SSL/TLS Mode**: Changed from Flexible to Full (Strict)
- [x] **Origin Certificate**: Generated and installed
- [x] **Server Configuration**: Updated to use HTTPS with Origin Certificate

## 🔧 Cloudflare Dashboard Settings to Configure

### 1. SSL/TLS Settings
Go to **SSL/TLS** in your Cloudflare dashboard:

#### Edge Certificates
- [x] **Encryption Mode**: Full (Strict) ✅ (Already done)
- [x] **Always Use HTTPS**: Turn ON
- [x] **HTTP Strict Transport Security (HSTS)**: Enable
  - Max Age: 12 months (31536000)
  - Include subdomains: Yes
  - Preload: Yes
- [ ] **Minimum TLS Version**: 1.2 or higher
- [ ] **Opportunistic Encryption**: On
- [ ] **TLS 1.3**: On

### 2. Security Settings
Go to **Security > Settings**:

- [ ] **Security Level**: Set to "Medium" or "High"
- [ ] **Bot Fight Mode**: Turn ON
- [ ] **Challenge Passage**: 30 minutes
- [ ] **Browser Integrity Check**: Turn ON

### 3. Firewall (WAF)
Go to **Security > WAF**:

#### Custom Rules (Create these):
1. **Block Common Attacks**:
   ```
   Rule Name: Block SQL Injection Attempts
   Expression: (http.request.uri.query contains "union" or http.request.uri.query contains "select" or http.request.uri.query contains "drop" or http.request.uri.query contains "insert")
   Action: Block
   ```

2. **Rate Limit API Endpoints**:
   ```
   Rule Name: API Rate Limiting
   Expression: (http.request.uri.path contains "/api/")
   Action: Challenge
   Rate: 30 requests per minute
   ```

3. **Block Admin Access**:
   ```
   Rule Name: Block Admin Paths
   Expression: (http.request.uri.path contains "/admin" or http.request.uri.path contains "/wp-admin")
   Action: Block
   ```

### 4. Page Rules
Go to **Rules > Page Rules**:

1. **Force HTTPS**:
   ```
   URL: http://*audiox.space/*
   Settings: Always Use HTTPS = On
   ```

2. **Security for API**:
   ```
   URL: *audiox.space/api/*
   Settings: 
   - Security Level = High
   - Browser Cache TTL = Respect Existing Headers
   ```

### 5. DNS Settings
Go to **DNS > Records**:

- [ ] Ensure all A/AAAA records are **Proxied** (Orange cloud icon)
- [ ] **DNSSEC**: Enable (if available for your domain)

### 6. Speed Optimization
Go to **Speed > Optimization**:

- [ ] **Auto Minify**: Enable CSS, JavaScript, HTML
- [ ] **Brotli**: On
- [ ] **Early Hints**: On
- [ ] **Rocket Loader**: On (test this - may break some JavaScript)

### 7. Caching
Go to **Caching > Configuration**:

- [ ] **Caching Level**: Standard
- [ ] **Browser Cache TTL**: 4 hours (or longer for static assets)
- [ ] **Always Online**: On

### 8. Network
Go to **Network**:

- [ ] **HTTP/2**: On
- [ ] **HTTP/3 (with QUIC)**: On
- [ ] **0-RTT Connection Resumption**: On
- [ ] **gRPC**: On (if using gRPC)
- [ ] **WebSockets**: On
- [ ] **Onion Routing**: On

## 🔄 Cloudflared Tunnel Configuration

Since you're using cloudflared, make sure your tunnel configuration includes:

1. **Update your tunnel config** to point to your HTTPS server:
   ```yaml
   tunnel: your-tunnel-id
   credentials-file: /path/to/credentials.json
   
   ingress:
     - hostname: audiox.space
       service: https://localhost:443
     - hostname: www.audiox.space  
       service: https://localhost:443
     - service: http_status:404
   ```

2. **Restart cloudflared** after updating:
   ```bash
   sudo systemctl restart cloudflared
   # or
   cloudflared tunnel run your-tunnel-name
   ```

## 🧪 Testing Your Security

### Test SSL Configuration:
```bash
# Test SSL certificate
curl -I https://audiox.space

# Test HTTPS redirect
curl -I http://audiox.space

# Check SSL Labs rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=audiox.space
```

### Test Security Headers:
```bash
curl -I https://audiox.space | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)"
```

### Test Rate Limiting:
```bash
# Make multiple rapid requests
for i in {1..15}; do curl -s -o /dev/null -w "%{http_code}\n" https://audiox.space/api/hello; done
```

## 🚨 Security Monitoring

### Regular Checks:
1. **Monitor Cloudflare Security Events** (weekly)
2. **Check server logs** for unusual activity
3. **Update dependencies** monthly:
   ```bash
   npm audit
   npm update
   ```

### Alerts to Set Up:
- Failed login attempts > 10 per hour
- Unusual traffic patterns
- Certificate expiry warnings

## 📊 Expected Results

After configuration, you should see:
- **SSL Labs Grade**: A or A+
- **Security Headers**: All green in securityheaders.com
- **Cloudflare Security Level**: Active protection
- **Zero mixed content warnings**

---

## ⚡ Quick Start Commands

```bash
# 1. Test security configuration
./test-security.sh

# 2. Start your secure server
node server.js

# 3. Test your website
curl -I https://audiox.space
```

Your website is now enterprise-grade secure! 🎉
