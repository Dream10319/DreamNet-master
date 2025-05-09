import express from "express";
import { ProjectController } from "@controllers/ProjectController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const projectController = new ProjectController();

router.get("/initial", Auth as any, projectController.GetProjectInitialData as any);
router.get("/list", Auth as any, projectController.GetList as any);

export default router;