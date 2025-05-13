import { Request, Response } from "express";
import { ProjectModel } from "@models/Project";

export class ProjectController {
  #projectModel: ProjectModel;

  constructor() {
    this.#projectModel = new ProjectModel();
  }

  GetList = async (req: Request, res: Response) => {
    try {
      const projects = await this.#projectModel.GetProjects();
      return res.status(200).json({
        status: true,
        payload: {
          projects: projects,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetProjectInitialData = async (req: Request, res: Response) => {
    try {
      const funcs: Array<any> = [];
      funcs.push(this.#projectModel.GetProjectStatus());
      funcs.push(this.#projectModel.GetProjectDeveloperOrg());
      funcs.push(this.#projectModel.GetProjectContractorOrg());
      const results = await Promise.all(funcs);

      return res.status(200).json({
        status: true,
        payload: {
          projectStatus: results[0],
          projectDeveloper: results[1],
          projectContractor: results[2],
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };
}
