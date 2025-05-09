import { Request, Response } from "express";
import { OrganisationModel } from "@models/Organisation";

export class OrganisationController {
  #organisationModel: OrganisationModel;

  constructor() {
    this.#organisationModel = new OrganisationModel();
  }

  GetList = async (req: Request, res: Response) => {
    try {
      const organisations = await this.#organisationModel.GetOrganisations();
      return res.status(200).json({
        status: true,
        payload: {
          organisations: organisations,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetOrganisationInitialData = async (req: Request, res: Response) => {
    try {
      const funcs: Array<any> = [];
      return res.status(200).json({
        status: true,
        payload: {},
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };
}
