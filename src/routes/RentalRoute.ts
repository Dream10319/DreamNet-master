import express from "express";
import { RentalController } from "@controllers/RentalController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const rentalController = new RentalController();

router.get("/initial", Auth as any, rentalController.GetRentalInitialData as any);
router.get("/list", Auth as any, rentalController.GetList as any);

export default router;