import sql from "mssql";
import bcrypt from "bcryptjs";

const readConfig = {
  user: process.env.MSSQL_USER || "",
  password: process.env.MSSQL_PWD || "",
  server: process.env.MSSQL_SERVER || "",
  database: process.env.MSSQL_READ_DATABASE || "",
  pool: {
    max: 10, // maximum number of connections in the pool
    min: 0, // minimum number of connections in the pool
    idleTimeoutMillis: 30000, // time in milliseconds to wait before closing an unused connection
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const writeConfig = {
  user: process.env.MSSQL_USER || "",
  password: process.env.MSSQL_PWD || "",
  server: process.env.MSSQL_SERVER || "",
  database: process.env.MSSQL_WRITE_DATABASE || "",
  pool: {
    max: 10, // maximum number of connections in the pool
    min: 0, // minimum number of connections in the pool
    idleTimeoutMillis: 30000, // time in milliseconds to wait before closing an unused connection
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const readPoolPromise = new sql.ConnectionPool(readConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to Read MSSQL");
    return pool;
  })
  .catch((err) =>
    console.log("Database Connection Failed! Bad read Config: ", err)
  );

const writePoolPromise = new sql.ConnectionPool(writeConfig)
  .connect()
  .then(async (pool) => {
    console.log("Connected to Write MSSQL");
    const request = pool.request();
    request.input("UserEmail", DB.sql.VarChar, process.env.ADMIN_EMAIL || "");

    const result = await request.query(
      `SELECT * FROM [User] WHERE [UserEmail] = @UserEmail`
    );

    if (result.recordset.length > 0) {
      console.log("Admin User already existed.");
    } else {
      const hash = await bcrypt.hash(process.env.ADMIN_PASS || "", 10);
      request.input("UserName", DB.sql.VarChar, process.env.ADMIN_USER || "");
      request.input("UserPassword", DB.sql.VarChar, hash);
      request.input("UserRole", DB.sql.VarChar, "ADMIN");
      request.input("UserCreatedAt", DB.sql.DateTime, new Date());

      await request.query(
        `INSERT INTO [User] 
            (UserEmail, UserPassword, UserName, UserRole, UserCreatedAt) 
            VALUES (@UserEmail, @UserPassword, @UserName, @UserRole, @UserCreatedAt)`
      );
    }
    return pool;
  })
  .catch((err) =>
    console.log("Database Connection Failed! Bad write Config: ", err)
  );

export const DB = {
  sql,
  readPoolPromise,
  writePoolPromise,
};
