import express from "express";
import { AuthController } from "@controllers/AuthController";
import { Auth } from "@middlewares/index";

const router = express.Router();
const authController = new AuthController();

router.post("/signin", authController.SignIn as any);
// router.post("/signup", authController.SignUp as any);
router.get("/current-user", Auth as any, authController.GetCurrentUser as any);

export default router;