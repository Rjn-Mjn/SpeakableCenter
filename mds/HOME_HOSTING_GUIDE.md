# 🏠 Home Hosting with Cloudflare DNS Setup Guide

## Your Current Setup
- **Domain**: audiox.space
- **Cloudflare DNS**: Points to your public IP (27.75.93.31)
- **Hosting**: From your home PC (Arch Linux)
- **SSL Mode**: Full (Strict) with Cloudflare Origin Certificate ✅

## 🌐 Port Forwarding Requirements

**YES, you need to port forward both ports:**

### **Required Port Forwards on Your Router:**

1. **Port 443 (HTTPS)** ➜ **Your PC IP:443**
   - Protocol: TCP
   - External Port: 443
   - Internal IP: [Your PC's local IP]
   - Internal Port: 443

2. **Port 80 (HTTP)** ➜ **Your PC IP:80** 
   - Protocol: TCP
   - External Port: 80
   - Internal IP: [Your PC's local IP]
   - Internal Port: 80
   - Purpose: HTTP → HTTPS redirects

## 🔧 Router Configuration Steps

### 1. Find Your PC's Local IP
```bash
# Check your local IP address
ip addr show | grep -E "inet.*192\.168|inet.*10\.|inet.*172\."
# Or simpler:
hostname -I
```

### 2. Access Your Router's Admin Panel
- Usually: `192.168.1.1` or `192.168.0.1`
- Login with admin credentials

### 3. Configure Port Forwarding
**Location varies by router brand:**
- **TP-Link**: Advanced → NAT Forwarding → Port Forwarding
- **Netgear**: Dynamic DNS → Port Forwarding
- **ASUS**: WAN → Virtual Server/Port Forwarding
- **Linksys**: Smart Wi-Fi Configurator → Port Forwarding

**Add these rules:**
```
Rule 1: HTTPS
- Service Name: Website-HTTPS
- External Port: 443
- Internal IP: [Your PC IP] (e.g., 192.168.1.100)
- Internal Port: 443
- Protocol: TCP

Rule 2: HTTP-Redirect  
- Service Name: Website-HTTP
- External Port: 80
- Internal IP: [Your PC IP] (e.g., 192.168.1.100)
- Internal Port: 80
- Protocol: TCP
```

## 🔒 Additional Home Network Security

### 1. Firewall Configuration (UFW)
```bash
# Enable UFW if not already enabled
sudo ufw enable

# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH (if needed)

# Block all other incoming traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Check status
sudo ufw status verbose
```

### 2. Fail2Ban (Protection against brute force)
```bash
# Install fail2ban
sudo pacman -S fail2ban

# Create configuration for your web server
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/auth.log

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

# Start and enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Monitor Your Network
```bash
# Check open ports
sudo netstat -tlnp

# Monitor connections
sudo ss -tuln

# Check who's connected
sudo netstat -an | grep :443
```

## ⚙️ Alternative Port Configuration

If you can't use standard ports (443/80), you can use alternative ports:

### Option 1: Non-standard ports
```bash
# Update .env
PORT=8443
HTTP_PORT=8080
```

**Router port forwarding:**
- External 443 → Internal 8443
- External 80 → Internal 8080

### Option 2: Keep it simple (HTTP only for testing)
If HTTPS is causing issues, you can temporarily test with HTTP only:

```bash
# Update .env for testing
PORT=80
NODE_ENV=development
ENABLE_HTTP_REDIRECT=false
```

Then use the old simple server:
```javascript
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

## 🧪 Testing Your Setup

### 1. Test Local Access
```bash
# Test HTTPS locally
curl -k https://localhost:443

# Test HTTP locally  
curl http://localhost:80
```

### 2. Test External Access
```bash
# Test from outside your network (use your phone's data)
curl -I https://audiox.space
curl -I http://audiox.space
```

### 3. Check Port Forwarding
Use online tools:
- https://www.yougetsignal.com/tools/open-ports/
- Check if ports 80 and 443 are open on 27.75.93.31

## 🔍 Troubleshooting

### Common Issues:

1. **"Site can't be reached"**
   - Check port forwarding rules
   - Verify your local IP hasn't changed
   - Test local access first

2. **SSL Certificate errors**
   - Verify certificate files exist and have correct permissions
   - Check Cloudflare SSL mode is Full (Strict)

3. **Port already in use**
   ```bash
   # Check what's using the port
   sudo lsof -i :443
   sudo lsof -i :80
   
   # Kill process if needed
   sudo kill -9 [PID]
   ```

4. **Firewall blocking**
   ```bash
   # Check UFW status
   sudo ufw status
   
   # Allow ports if blocked
   sudo ufw allow 80
   sudo ufw allow 443
   ```

## 🏠 Home Hosting Security Best Practices

### 1. **Network Security**
- Use a separate VLAN for your server if possible
- Enable router's built-in firewall
- Disable WPS on your router
- Use strong WiFi passwords (WPA3)

### 2. **Server Security**
- Keep your Arch Linux system updated
- Use SSH keys instead of passwords
- Set up automated security updates
- Monitor logs regularly

### 3. **Backup Strategy**
- Automated daily backups of your database
- Configuration files backup
- Consider cloud backup for critical data

## 📋 Quick Setup Commands

```bash
# 1. Check your local IP
hostname -I

# 2. Test SSL configuration
./test-security.sh

# 3. Start secure server
node server.js

# 4. Test external access (from phone/another network)
curl -I https://audiox.space
```

## 🚨 IMPORTANT: Router Port Forwarding Required

**You MUST configure port forwarding on your home router:**
- **Port 443** (HTTPS) → Your PC
- **Port 80** (HTTP redirects) → Your PC

Without port forwarding, external users cannot reach your website!

Your setup will be: `Internet → Cloudflare → Your Public IP (27.75.93.31) → Router → Your PC (443/80)`
