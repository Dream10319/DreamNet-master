import { DB } from "@config/db";

export class RentalModel {
  #pool: any;

  constructor() {
    this.#InitializeDB();
  }

  #InitializeDB = async () => {
    const poolPromise = await DB.readPoolPromise;
    this.#pool = poolPromise;
  };

  GetRentals = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [RentalDetailsView] WHERE [RentalStatusName] <> 'Retired'`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetRentalGroup = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(
        `SELECT RentalGroupName FROM [RentalGroup]`
      );

      return result.recordset.map((group: any) => group.RentalGroupName);
    } catch (err) {
      throw err;
    }
  };

  GetRentalStatus = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(
        `SELECT RentalStatusName FROM [RentalStatus]`
      );

      return result.recordset.map((status: any) => status.RentalStatusName);
    } catch (err) {
      throw err;
    }
  };

  GetRentalMAOrg = async () => {
    try {
      const request = this.#pool.request();
      request.input("orgRole", DB.sql.VarChar, "MA");
      const result = await request.query(
        `SELECT OrgName FROM [RentalOrganisationsView] WHERE OrgRole = @orgRole GROUP BY OrgName`
      );

      return result.recordset.map((org: any) => org.OrgName);
    } catch (err) {
      throw err;
    }
  };

  GetRentalDetailById = async (id: number) => {
    try {
      const request = this.#pool.request();
      request.input("id", DB.sql.Int, id);
      const result = await request.query(
        `SELECT * FROM [RentalDetailsView] WHERE [RentalId] = @id`
      );

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };
}
