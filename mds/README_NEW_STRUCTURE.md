# Speakable Project - New Structure

## 📁 Project Structure

```
/Speakable
├── /client                 # Frontend application
│   ├── /public            # Static files
│   ├── /src               # Source code
│   │   ├── /assets        # Images, fonts, etc.
│   │   ├── /components    # Reusable components
│   │   ├── /pages         # Page components
│   │   ├── /routes        # Client-side routing
│   │   ├── /services      # API services, utilities
│   │   ├── /styles        # CSS files
│   │   ├── App.jsx        # Main app component
│   │   └── main.js        # Entry point
│   └── package.json
│
├── /server                # Backend application
│   ├── /config           # Configuration files
│   ├── /controllers      # Route controllers
│   ├── /middleware       # Express middleware
│   ├── /models           # Database models
│   ├── /routes           # API routes
│   ├── /services         # Business logic
│   ├── /ssl              # SSL certificates
│   ├── server.js         # Server entry point
│   └── package.json
│
├── .env                   # Environment variables
├── docker-compose.yml     # Docker configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Development

1. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start development servers:**
   ```bash
   # Terminal 1 - Start server
   cd server && npm run dev

   # Terminal 2 - Start client
   cd client && npm run dev
   ```

3. **Access the application:**
   - Client: http://localhost:3000
   - Server: https://localhost:443

### Production

1. **Build client:**
   ```bash
   cd client && npm run build
   ```

2. **Start server:**
   ```bash
   cd server && npm start
   ```

### Docker

```bash
docker-compose up
```

## 📝 Migration Notes

- HTML files are now in `client/src/pages/`
- CSS files are in `client/src/styles/`
- JavaScript files are in `client/src/services/`
- Server routes remain in `server/routes/`
- Database files moved to `server/models/`

## 🔄 Next Steps

1. Create controllers for routes
2. Implement service layer pattern
3. Add error handling middleware
4. Set up database models properly
5. Consider migrating to React/Vue for client
