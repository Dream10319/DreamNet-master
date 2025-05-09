import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "@models/User";

export class UserController {
  #userModel: UserModel;

  constructor() {
    this.#userModel = new UserModel();
  }

  CreateUser = async (req: Request, res: Response) => {
    try {
      const { UserName, UserEmail, UserPassword, UserRole } = req.body;
      const existingUser = await this.#userModel.GetUserByEmail(
        UserEmail.toLowerCase()
      );
      if (existingUser) {
        return res
          .status(401)
          .json({ status: false, message: "Email already in use!" });
      }

      const hashedPassword = await bcrypt.hash(UserPassword, 10);
      await this.#userModel.AddUser(
        UserEmail,
        hashedPassword,
        UserName,
        UserRole
      );

      return res
        .status(200)
        .json({ status: true, message: "User registered successfully!" });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.#userModel.GetUserById(Number(id));
      return res.status(200).json({
        status: true,
        message: "User fetched successful",
        data: {
          user: user,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  }

  UpdateUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { UserName, UserEmail, UserPassword, statusPassword } = req.body;

      const existingUser = await this.#userModel.GetUserById(Number(id));
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: false, message: "User not found!" });
      }

      // if (existingUser.UserEmail !== UserEmail.toLowerCase()) {
      //   const emailExists = await this.#userModel.GetUserByEmail(UserEmail.toLowerCase());
      //   if (emailExists) {
      //     return res
      //       .status(401)
      //       .json({ status: false, message: "Email already in use!" });
      //   }
      // }
      let hashedPassword = existingUser.UserPassword;
      if (UserPassword) {
        hashedPassword = await bcrypt.hash(UserPassword, 10);
      }

      await this.#userModel.UpdateUserById(
        Number(id),
        UserName,
        UserEmail,
        hashedPassword,
        statusPassword
      );

      return res
        .status(200)
        .json({ status: true, message: "User updated successfully!" });

    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
        error: String(err),
      });
    }
  };

  GetUserList = async (req: Request, res: Response) => {
    try {
      const users = await this.#userModel.GetUserList();
      return res.status(200).json({
        status: true,
        message: "User List fetched successful",
        payload: {
          users: users,
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

  DeleteUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.#userModel.DeleteUserById(Number(id));
      return res.status(200).json({
        status: true,
        message: "User deleted successful",
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
