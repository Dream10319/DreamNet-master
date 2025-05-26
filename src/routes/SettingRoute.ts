import express from "express";
import { SettingController } from "@controllers/SettingController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const settingController = new SettingController();

router.get("/priority", Auth as any, settingController.GetPriorities as any);
router.post("/priority", Auth as any, settingController.AddPriority as any);
router.delete("/priority/:id", Auth as any, settingController.RemovePriority as any);

router.get("/status", Auth as any, settingController.GetStatuses as any);
router.post("/status", Auth as any, settingController.AddStatus as any);
router.delete("/status/:id", Auth as any, settingController.RemoveStatus as any);

router.get("/type", Auth as any, settingController.GetTypes as any);
router.post("/type", Auth as any, settingController.AddType as any);
router.delete("/type/:id", Auth as any, settingController.RemoveType as any);

export default router;
