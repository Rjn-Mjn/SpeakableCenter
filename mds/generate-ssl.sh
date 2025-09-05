#!/bin/bash

# Generate SSL Certificate for Origin Server
# This creates a self-signed certificate for use with Cloudflare Full (Strict) SSL

echo "🔐 Generating SSL Certificate for Origin Server..."

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/certificate.crt -days 365 -nodes \
  -subj "/C=VN/ST=Vietnam/L=HoChiMinh/O=Speakable/OU=IT/CN=audiox.space/emailAddress=admin@audiox.space"

echo "✅ SSL Certificate generated successfully!"
echo ""
echo "📁 Files created:"
echo "   - ssl/private.key (Private Key)"
echo "   - ssl/certificate.crt (Certificate)"
echo ""
echo "🔧 Next steps:"
echo "1. Update your server.js to use HTTPS with these certificates"
echo "2. Change Cloudflare SSL mode to 'Full (Strict)'"
echo "3. Test your website"
echo ""
echo "⚠️  Note: For production, consider using Cloudflare Origin Certificates instead"
echo "   Go to Cloudflare Dashboard > SSL/TLS > Origin Server > Create Certificate"
