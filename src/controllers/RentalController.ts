import { Request, Response } from "express";
import { RentalModel } from "@models/Rental";

export class RentalController {
  #rentalModel: RentalModel;

  constructor() {
    this.#rentalModel = new RentalModel();
  }

  GetList = async (req: Request, res: Response) => {
    try {
      const rentals = await this.#rentalModel.GetRentals();
      return res.status(200).json({
        status: true,
        payload: {
          rentals: rentals,
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

  GetRentalInitialData = async (req: Request, res: Response) => {
    try {
      const funcs: Array<any> = [];
      funcs.push(this.#rentalModel.GetRentalStatus());
      funcs.push(this.#rentalModel.GetRentalGroup());
      funcs.push(this.#rentalModel.GetRentalMAOrg());
      const results = await Promise.all(funcs);

      return res.status(200).json({
        status: true,
        payload: {
          rentalStatus: results[0],
          rentalGroup: results[1],
          rentalMA: results[2],
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
}
