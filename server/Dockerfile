# Server Dockerfile
FROM node:18-alpine

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create SSL directory
RUN mkdir -p /app/ssl

# Expose ports
EXPOSE 80 443

# Start the application
CMD ["node", "server.js"]
