/**
 * Database Configuration
 * SQL Server connection setup
 */

import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // For development
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Connection pool
let pool;

/**
 * Connect to database
 */
export const connectDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('✅ Connected to SQL Server database');
        }
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

/**
 * Close database connection
 */
export const closeDB = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};

/**
 * Test database connection
 */
export const testConnection = async () => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT 1 as test');
        console.log('✅ Database connection test successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error);
        return false;
    }
};

// Export sql for use in other modules
export { sql };
