#!/bin/bash

# Start script for Speakable application

echo "========================================"
echo "🚀 Starting Speakable Application"
echo "========================================"

# Get the script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
fi

# Check if in production or development
if [ "$NODE_ENV" = "production" ]; then
    echo "🔐 Starting in PRODUCTION mode (HTTPS on port 443)..."
    echo "Note: This requires sudo privileges and SSL certificates."
    
    # Check for SSL certificates
    if [ ! -f "server/ssl/private.key" ] || [ ! -f "server/ssl/certificate.crt" ]; then
        echo "❌ SSL certificates not found in server/ssl/"
        echo "Please add private.key and certificate.crt files."
        exit 1
    fi
    
    # Start production server
    npm start &
    SERVER_PID=$!
    
    echo "✅ Server started with PID: $SERVER_PID"
    echo "🌐 Access at: https://localhost:443"
    
else
    echo "💻 Starting in DEVELOPMENT mode (HTTP on port 3000)..."
    
    # Start development server
    npm run dev 2>&1 | tee server.log &
    SERVER_PID=$!
    
    # Give server time to start
    echo "⏳ Waiting for server to start..."
    sleep 3
    
    # Check if server started successfully
    if curl -s http://localhost:3000/api/hello > /dev/null 2>&1; then
        echo ""
        echo "✅ Server started successfully with PID: $SERVER_PID"
        echo ""
        echo "🌐 Access your website at:"
        echo "   Homepage: http://localhost:3000"
        echo "   Login:    http://localhost:3000/login"
        echo "   Register: http://localhost:3000/register"
        echo ""
        echo "📝 Server logs are being saved to: server.log"
        echo "🛑 Press Ctrl+C to stop the server"
    else
        echo "❌ Server failed to start. Check server.log for errors."
        tail -20 server.log
        exit 1
    fi
fi

# Trap Ctrl+C to cleanup
trap 'echo "\n🛑 Stopping server..."; kill $SERVER_PID 2>/dev/null; exit' INT

# Wait for process
wait $SERVER_PID
