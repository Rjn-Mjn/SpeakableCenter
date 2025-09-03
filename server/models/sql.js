import sql from "mssql";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER, // thường là localhost hoặc IP LAN
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    // useUTC: false,
    trustServerCertificate: true,
  },
};

let pool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

export async function getUserByUsername(username) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM Accounts WHERE Email = @username");

  return result.recordset[0];
}

export async function getUserByEmail(email) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Accounts WHERE email = @email");

  return result.recordset[0];
}

export async function getUserByGoogleId(googleId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("googleId", sql.NVarChar(255), googleId)
    .query("SELECT * FROM Accounts WHERE GoogleID = @googleId");

  return result.recordset[0];
}

export async function getUserByID(accountId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, accountId)
    .query("SELECT * FROM Accounts WHERE AccountID = @id");
  return result.recordset[0];
}

export async function getUserByID_session(accountId) {
  const pool = await getPool();
  const result = await pool.request().input("id", sql.Int, accountId).query(
    "SELECT AccountID, Fullname, Email, GoogleID, PhoneNumber, R.RoleName, [Status], AvatarLink, DOC, DateOfBirth, Gender, Address \
      from Accounts AC JOIN Roles R ON AC.RoleID = R.RoleID \
      WHERE AccountID = @id"
  );
  return result.recordset[0];
}

export async function addUser(user) {
  const pool = await getPool();
  const now = new Date();
  console.log(now);

  const request = pool
    .request()
    .input("email", sql.VarChar, user.email)
    .input("passwordHash", sql.VarChar, user.passwordHash)
    .input("fullName", sql.NVarChar, user.fullName)
    .input("status", sql.VarChar, user.status)
    .input("roleid", sql.Int, "1")
    .input("AvatarLink", sql.NVarChar(500), user.AvatarLink)
    .input("DOC", sql.Date, now);

  // Add GoogleId if provided
  if (user.googleId) {
    request.input("GoogleID", sql.VarChar, user.googleId);
    await request.query(`
      INSERT INTO Accounts (Email, PasswordHash, FullName, Status, roleid, GoogleID, AvatarLink)
      VALUES (@email, @passwordHash, @fullName, @status, @roleid, @GoogleID, @AvatarLink)
    `);
  } else {
    await request.query(`
      INSERT INTO Accounts (Email, PasswordHash, FullName, Status, roleid, AvatarLink)
      VALUES (@email, @passwordHash, @fullName, @status, @roleid, @AvatarLink)
    `);
  }
}

export async function updateUserGoogleId(email, googleId) {
  const pool = await getPool();
  await pool
    .request()
    .input("email", sql.VarChar, email)
    .input("googleId", sql.VarChar, googleId).query(`
      UPDATE Accounts 
      SET GoogleId = @googleId 
      WHERE Email = @email
    `);
}

// Create Sessions table for express-session store
export async function createSessionTable() {
  const pool = await getPool();
  try {
    // Check if table exists, if not create it
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sessions' AND xtype='U')
      BEGIN
        CREATE TABLE Sessions (
          sid VARCHAR(255) PRIMARY KEY,
          session NVARCHAR(MAX) NOT NULL,
          expires DATETIME NOT NULL
        );
        
        CREATE INDEX IDX_expires ON Sessions(expires);
      END
    `);
    console.log("✅ Sessions table ready");
    return true;
  } catch (error) {
    console.error("Error creating Sessions table:", error);
    return false;
  }
}

// Export the config for session store to use
export const getDbConfig = () => config;
