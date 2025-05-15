import { DB } from "@config/db";

export class UserModel {
  #pool: any;

  constructor() {
    this.#InitializeDB();
  }

  #InitializeDB = async () => {
    const poolPromise = await DB.writePoolPromise;
    this.#pool = poolPromise;
  };

  GetUserByEmail = async (email: string) => {
    try {
      const request = this.#pool.request();
      request.input("email", DB.sql.VarChar, email);
      const result = await request.query(
        "SELECT * FROM [User] WHERE UserEmail = @email"
      );

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };

  GetUserById = async (id: number) => {
    try {
      const request = this.#pool.request();
      request.input("id", DB.sql.Int, id);
      const result = await request.query(
        "SELECT * FROM [User] WHERE UserId = @id"
      );

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };

  DeleteUserById = async (id: number) => {
    try {
      const request = this.#pool.request();
      request.input("id", DB.sql.Int, id);
      await request.query(
        "DELETE FROM [User] WHERE UserId = @id"
      );
    } catch (err) {
      throw err;
    }
  };

  AddUser = async (email: string, hash: string, name: string, role: string) => {
    try {
      const request = this.#pool.request();
      request.input("email", DB.sql.VarChar, email);
      request.input("hash", DB.sql.VarChar, hash);
      request.input("name", DB.sql.VarChar, name);
      request.input("role", DB.sql.VarChar, role);
      request.input("createdAt", DB.sql.DateTime, new Date());
      request.input("updatedAt", DB.sql.DateTime, new Date());
      await request.query(
        "INSERT INTO [User] (UserEmail, UserPassword, UserName, UserRole, UserCreatedAt, UserUpdatedAt) VALUES (@email, @hash, @name, @role, @createdAt, @updatedAt)"
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  UpdateUserById = async (userId: number, name: string, email: string, role: string, password: string, statusPassword: any) => {
    try {
      let query;
      if (statusPassword) {
        query = `
          UPDATE [User]
          SET UserEmail = @email,
              UserPassword = @password,
              UserName = @name,
              UserRole = @role,
              UserUpdatedAt = @updatedAt
          WHERE UserId = @userId
        `;
      } else {
        query = `
          UPDATE [User]
          SET UserEmail = @email,
              UserName = @name,
              UserRole = @role,
              UserUpdatedAt = @updatedAt
          WHERE UserId = @userId
        `;
      }      

      const updatedAt = new Date();

      const request = this.#pool.request();
      request.input("userId", DB.sql.Int, userId);
      request.input("email", DB.sql.VarChar, email);
      request.input("password", DB.sql.VarChar, password);
      request.input("name", DB.sql.VarChar, name);
      request.input("role", DB.sql.VarChar, role);
      request.input("updatedAt", DB.sql.DateTime, updatedAt);

      await request.query(query);

    } catch (err) {
      console.log("Error updating user:", err);
      throw err;  // Throw the error to be caught by the controller
    }
  };

  GetUserList = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(
        `SELECT UserId, UserEmail, UserName, UserRole, UserCreatedAt FROM [User]`
      );
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };
}
