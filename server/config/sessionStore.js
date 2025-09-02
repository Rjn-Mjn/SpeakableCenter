import connectSqlServer from 'connect-mssql-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Reuse the same config from your models/sql.js
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Session store configuration
const storeConfig = {
  table: 'Sessions',        // Table name for sessions
  ttl: 24 * 60 * 60,       // 24 hours in seconds
  autoRemove: 'interval',   // Clean up expired sessions
  autoRemoveInterval: 60,   // Check every 60 minutes
  useUTC: false            // Use local time
};

// Create and export the session store
export const createSessionStore = () => {
  return new connectSqlServer(dbConfig, storeConfig);
};

// SQL query to create the Sessions table if it doesn't exist
export const createSessionTableSQL = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sessions' AND xtype='U')
BEGIN
    CREATE TABLE Sessions (
        sid VARCHAR(255) PRIMARY KEY,
        session NVARCHAR(MAX) NOT NULL,
        expires DATETIME NOT NULL
    );
    
    CREATE INDEX IDX_expires ON Sessions(expires);
END
`;

// Helper function to ensure Sessions table exists
export async function ensureSessionTable(pool) {
  try {
    await pool.request().query(createSessionTableSQL);
    console.log('✅ Sessions table ready');
  } catch (error) {
    console.error('Error creating Sessions table:', error);
  }
}
