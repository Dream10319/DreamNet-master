import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "@models/User";
import { EXPIRE_IN } from "@constants/index";

export class AuthController {
  #userModel: UserModel;

  constructor() {
    this.#userModel = new UserModel();
  }

  SignIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user: any = await this.#userModel.GetUserByEmail(
        email.toLowerCase()
      );
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found!" });
      }

      const isMatch = await bcrypt.compare(password, user.UserPassword || "");
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials!" });
      }

      const payload = {
        id: user.UserId,
        role: user.UserRole,
        name: user.UserName,
        exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY || "", {
        algorithm: "HS256",
      });

      return res.status(200).json({
        status: true,
        payload: {
          token: token,
        },
        message: "Login successful!",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetCurrentUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const user: any = await this.#userModel.GetUserById(Number(userId));

      if (user) {
        return res.status(200).json({
          status: true,
          message: "Authenticated User fetched successful",
          payload: {
            user: {
              id: user.UserId,
              name: user.UserName,
              email: user.UserEmail,
              role: user.UserRole,
            },
          },
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not Found" });
      }
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };
}
