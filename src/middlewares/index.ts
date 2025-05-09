import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = req.body || {};
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedData: any = jwt.verify(token, process.env.SECRET_KEY || "");
      req.body.userId = decodedData.id;
      req.body.role = decodedData.role;
      next();
    } else {
      return res.status(401).json({
        message: "Authentication failed: No token provided",
        auth: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token", auth: true });
  }
};

export const OnlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = req.body || {};
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedData: any = jwt.verify(token, process.env.SECRET_KEY || "");
      req.body.userId = decodedData.id;
      req.body.role = decodedData.role;
      if (decodedData.role === "ADMIN") next();
    } else {
      return res.status(401).json({
        message: "Authentication failed: No token provided",
        auth: true,
      });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token", auth: true });
  }
};
