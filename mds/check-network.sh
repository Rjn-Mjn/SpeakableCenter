#!/bin/bash

echo "🌐 Network Configuration Check for Home Hosting"
echo "=============================================="

# Get local IP
LOCAL_IP=$(ip addr show | grep -E "inet.*192\.168|inet.*10\.|inet.*172\." | head -1 | awk '{print $2}' | cut -d'/' -f1)
echo "🏠 Your PC's Local IP: $LOCAL_IP"

# Check if ports are available
echo ""
echo "🔍 Checking if ports are available..."

if sudo lsof -i :443 &>/dev/null; then
    echo "   ⚠️  Port 443 is already in use:"
    sudo lsof -i :443
else
    echo "   ✅ Port 443 is available"
fi

if sudo lsof -i :80 &>/dev/null; then
    echo "   ⚠️  Port 80 is already in use:"
    sudo lsof -i :80
else
    echo "   ✅ Port 80 is available"
fi

# Check firewall status
echo ""
echo "🔥 Firewall Status:"
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        echo "   ✅ UFW is active"
        echo "   📋 Current rules:"
        sudo ufw status numbered | grep -E "(80|443)"
    else
        echo "   ⚠️  UFW is not active"
        echo "   💡 Recommend: sudo ufw enable"
    fi
else
    echo "   ❌ UFW not installed"
    echo "   💡 Install: sudo pacman -S ufw"
fi

# Check router gateway
GATEWAY=$(ip route | grep default | head -1 | awk '{print $3}')
echo ""
echo "🏠 Router Configuration Needed:"
echo "================================"
echo "1. Access your router admin panel: http://$GATEWAY"
echo "2. Go to Port Forwarding settings"
echo "3. Add these rules:"
echo ""
echo "   Rule 1 (HTTPS):"
echo "   - External Port: 443"
echo "   - Internal IP: $LOCAL_IP"
echo "   - Internal Port: 443"
echo "   - Protocol: TCP"
echo ""
echo "   Rule 2 (HTTP):"
echo "   - External Port: 80"
echo "   - Internal IP: $LOCAL_IP" 
echo "   - Internal Port: 80"
echo "   - Protocol: TCP"

echo ""
echo "🧪 Testing Commands:"
echo "==================="
echo "# Test local HTTPS access:"
echo "curl -k https://localhost:443"
echo ""
echo "# Test external access (after port forwarding):"
echo "curl -I https://audiox.space"
echo ""
echo "# Check if ports are open externally:"
echo "# Visit: https://www.yougetsignal.com/tools/open-ports/"
echo "# Enter IP: 27.75.93.31"
echo "# Test ports: 80, 443"

echo ""
echo "🚨 CRITICAL: Without port forwarding, your website won't be accessible from the internet!"
