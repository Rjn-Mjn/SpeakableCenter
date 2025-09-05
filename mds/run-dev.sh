#!/bin/bash

# Development runner with automatic cache busting
# This script ensures CSS/JS changes are immediately visible in the browser

echo "🚀 Starting Speakable Development Server"
echo "========================================="

# Set environment to development
export NODE_ENV=development

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to server directory
cd "$(dirname "$0")/server"

echo -e "${YELLOW}📝 Setting up cache busting...${NC}"

# Add version strings to HTML files for cache busting
node utils/autoVersion.js

echo -e "${GREEN}✅ Cache busting configured${NC}"
echo ""
echo -e "${YELLOW}🔧 Starting server with no-cache headers...${NC}"
echo ""

# Start the server
node server.js

# Cleanup on exit
trap 'echo -e "\n${YELLOW}👋 Shutting down development server...${NC}"' EXIT
