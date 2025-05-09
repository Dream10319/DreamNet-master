import { DB } from "@config/db";

export class ProjectModel {
  #pool: any;

  constructor() {
    this.#InitializeDB();
  }

  #InitializeDB = async () => {
    const poolPromise = await DB.readPoolPromise;
    this.#pool = poolPromise;
  };

  GetProjects = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`SELECT * FROM [ProjectDetailsView]`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  GetProjectDeveloperOrg = async () => {
    try {
        const request = this.#pool.request();
        request.input("orgRole", DB.sql.VarChar, "D");
        const result = await request.query(
          `SELECT OrgName FROM [ProjectOrganisationsView] WHERE OrgRole = @orgRole GROUP BY OrgName`
        );
  
        return result.recordset.map((org: any) => org.OrgName);
    } catch (err) {
      throw err;
    }
  };

  GetProjectStatus = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(
        `SELECT ProjectStatusName FROM [ProjectStatus ]`
      );

      return result.recordset.map((status: any) => status.ProjectStatusName);
    } catch (err) {
      throw err;
    }
  };

  GetProjectContractorOrg = async () => {
    try {
      const request = this.#pool.request();
      request.input("orgRole", DB.sql.VarChar, "C");
      const result = await request.query(
        `SELECT OrgName FROM [ProjectOrganisationsView] WHERE OrgRole = @orgRole GROUP BY OrgName`
      );

      return result.recordset.map((org: any) => org.OrgName);
    } catch (err) {
      throw err;
    }
  };

  GetProjectDetailById = async (id: number) => {
    try {
      const request = this.#pool.request();
      request.input("id", DB.sql.Int, id);
      const result = await request.query(
        `SELECT * FROM [ProjectDetailsView] WHERE [ProjectId] = @id`
      );

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };
}
