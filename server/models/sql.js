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

export async function getTargetRole(id) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("AccountID", sql.Int, id)
    .query(
      "SELECT RoleName FROM Accounts A JOIN Roles R ON A.RoleID = R.RoleID WHERE A.AccountID = @AccountID"
    );
  return result.recordset[0];
}

export async function getUserByID_session(accountId) {
  const pool = await getPool();
  const result = await pool.request().input("id", sql.Int, accountId).query(
    "SELECT AccountID, Fullname, Email, PhoneNumber, R.RoleName, [Status], AvatarLink, DOC, DateOfBirth, Gender, Address \
      from Accounts AC JOIN Roles R ON AC.RoleID = R.RoleID \
      WHERE AccountID = @id"
  );
  return result.recordset[0];
}

// nếu chưa có ở đầu file:
// import sql from "mssql";

export async function getAccounts(
  page = 1,
  limit = 10,
  status = null,
  role = null
) {
  const pool = await getPool();

  // normalize + bounds
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(200, Math.max(1, parseInt(limit, 10) || 10)); // cap max=200
  const offset = (page - 1) * limit;

  // build WHERE clause an toàn với parameterized inputs
  const whereClauses = [];
  const req = pool.request();

  // always parametrize paging
  req.input("offset", sql.Int, offset);
  req.input("limit", sql.Int, limit);

  if (status) {
    // expects status = 'active' | 'pending' | 'blocked'
    whereClauses.push("AC.[Status] = @status");
    req.input("status", sql.VarChar(50), status);
  }

  if (role) {
    // compare case-insensitive
    whereClauses.push("LOWER(R.RoleName) = LOWER(@role)");
    req.input("role", sql.VarChar(100), role);
  }

  const whereSql = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  const query = `
    SELECT
      AC.AccountID,
      AC.Fullname,
      AC.Email,
      AC.PhoneNumber,
      R.RoleName,
      AC.[Status],
      AC.AvatarLink,
      AC.DOC,
      CONVERT(varchar(10), AC.DateOfBirth, 120) AS DateOfBirth,
      AC.Gender,
      AC.Address,
      COUNT(1) OVER() AS TotalCount
    FROM Accounts AC
    LEFT JOIN Roles R ON AC.RoleID = R.RoleID
    ${whereSql}
    ORDER BY AC.AccountID
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY;
  `;

  const result = await req.query(query);
  const rows = result.recordset || [];

  const total = rows.length ? rows[0].TotalCount : 0;
  // remove TotalCount from each item (optional)
  const data = rows.map(({ TotalCount, ...rest }) => rest);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function toggleStatus(AccountID, Status, RoleName) {
  const request = pool
    .request()
    .input("status", sql.VarChar, Status)
    .input("AccountID", sql.Int, AccountID);

  console.log("query role: ", RoleName);
  console.log("query status: ", Status);

  if (Status !== "pending") {
    if (RoleName === "Guest") {
      const result = await request.query(
        "UPDATE Accounts SET Status = @status,  RoleID = (SELECT RoleID FROM Roles WHERE RoleName = 'Students')  WHERE AccountID = @AccountID"
      );
    } else {
      const result = await request.query(
        "UPDATE Accounts SET Status = @status WHERE AccountID = @AccountID"
      );
    }
  } else {
    const result = await request.query(
      "UPDATE Accounts SET Status = @status WHERE AccountID = @AccountID"
    );
  }
}

export async function toggleRole(AccountID, RoleName) {
  const request = pool
    .request()
    .input("role", sql.NVarChar, RoleName)
    .input("AccountID", sql.Int, AccountID);

  if (RoleName === "Guest") {
    const result = await request.query(
      "UPDATE Accounts SET Status = 'pending',  RoleID = (SELECT RoleID FROM Roles WHERE RoleName = @role)  WHERE AccountID = @AccountID"
    );
  } else if (RoleName === "Students") {
    const result = await request.query(
      "UPDATE Accounts SET Status = 'active',  RoleID = (SELECT RoleID FROM Roles WHERE RoleName = @role)  WHERE AccountID = @AccountID"
    );
  } else {
    const result = await request.query(
      "UPDATE Accounts SET RoleID = (SELECT RoleID FROM Roles WHERE RoleName = @role) WHERE AccountID = @AccountID"
    );
  }
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
      INSERT INTO Accounts (Email, PasswordHash, FullName, Status, roleid, GoogleID, AvatarLink, DOC)
      VALUES (@email, @passwordHash, @fullName, @status, @roleid, @GoogleID, @AvatarLink, @DOC)
    `);
  } else {
    await request.query(`
      INSERT INTO Accounts (Email, PasswordHash, FullName, Status, roleid, AvatarLink, DOC)
      VALUES (@email, @passwordHash, @fullName, @status, @roleid, @AvatarLink, @DOC)
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

export async function saveAvatar(info) {
  console.log(info.AvatarLink);

  const pool = await getPool();
  await pool
    .request()
    .input("AccountID", sql.Int, info.AccountID)
    .input("AvatarLink", sql.NVarChar, info.AvatarLink).query(`
      UPDATE Accounts 
      SET AvatarLink = @AvatarLink 
      WHERE AccountID = @AccountID
    `);
}

export async function setGender(info) {
  console.log(info.Gender);

  const pool = await getPool();
  await pool
    .request()
    .input("AccountID", sql.Int, info.AccountID)
    .input("Gender", sql.Bit, info.Gender).query(`
      UPDATE Accounts 
      SET Gender = @Gender 
      WHERE AccountID = @AccountID
    `);
}
export async function setPhone(info) {
  console.log(info.PhoneNumber);

  const pool = await getPool();
  await pool
    .request()
    .input("AccountID", sql.Int, info.AccountID)
    .input("PhoneNumber", sql.NVarChar, info.PhoneNumber).query(`
      UPDATE Accounts 
      SET PhoneNumber = @PhoneNumber 
      WHERE AccountID = @AccountID
    `);
}
export async function setDOB(info) {
  console.log(info.DateOfBirth);

  const pool = await getPool();
  await pool
    .request()
    .input("AccountID", sql.Int, info.AccountID)
    .input("DateOfBirth", sql.Date, info.DateOfBirth).query(`
      UPDATE Accounts 
      SET DateOfBirth = @DateOfBirth 
      WHERE AccountID = @AccountID
    `);
}
export async function setAddress(info) {
  console.log(info.Address);

  const pool = await getPool();
  await pool
    .request()
    .input("AccountID", sql.Int, info.AccountID)
    .input("Address", sql.NVarChar, info.Address).query(`
      UPDATE Accounts 
      SET Address = @Address 
      WHERE AccountID = @AccountID
    `);
}
// Export the config for session store to use
export const getDbConfig = () => config;
