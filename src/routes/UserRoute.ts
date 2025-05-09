import express from "express";
import { UserController } from "@controllers/UserController";
import { OnlyAdmin } from "@middlewares/index";

const router = express.Router();
const userController = new UserController();

router.post("/create", OnlyAdmin as any, userController.CreateUser as any);
router.get("/user/:id", OnlyAdmin as any, userController.GetUserById as any);
router.get("/list", OnlyAdmin as any, userController.GetUserList as any);
router.delete("/:id", OnlyAdmin as any, userController.DeleteUserById as any);
router.put("/:id", OnlyAdmin as any, userController.UpdateUserById as any);

export default router;
