import express from "express";
import { OrganisationController } from "@controllers/OrganisationController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const organisationController = new OrganisationController();

router.get("/initial", Auth as any, organisationController.GetOrganisationInitialData as any);
router.get("/list", Auth as any, organisationController.GetList as any);

export default router;