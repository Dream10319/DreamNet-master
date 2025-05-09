import { DB } from "@config/db";

export class OrganisationModel {
  #pool: any;

  constructor() {
    this.#InitializeDB();
  }

  #InitializeDB = async () => {
    const poolPromise = await DB.readPoolPromise;
    this.#pool = poolPromise;
  };

  GetOrganisations = async () => {
    try {
      const request = this.#pool.request();
      const result = await request.query(`
          SELECT org.*, contact_list.ContactNames
          FROM [OrganisationDetailsView] AS org
          OUTER APPLY
          (
              SELECT 
                  STUFF((
                      SELECT ',' + ContactName
                      FROM [Contact] c
                      WHERE c.[OrgId] = org.[OrgId]
                      FOR XML PATH(''), TYPE
                  ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS ContactNames
          ) AS contact_list
        `);

        // GROUP BY org.[OrgId]

      return result.recordset;
    } catch (err) {
      console.log(err)
      throw err;
    }
  };

  GetOrganisationDetailById = async (id: number) => {
    try {
      const request = this.#pool.request();
      request.input("id", DB.sql.Int, id);
      const result = await request.query(
        `SELECT * FROM [OrganisationDetailsView] WHERE [OrgId] = @id`
      );

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
      throw err;
    }
  };
}
