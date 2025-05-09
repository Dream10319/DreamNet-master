import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";

dotenv.config();

import AuthRouter from "@routes/AuthRoute";
import RentalRouter from "@routes/RentalRoute";
import ProjectRouter from "@routes/ProjectRoute";
import OrganisationRouter from "@routes/OrganisationRoute";
import EventRouter from "@routes/EventRoute";
import UserRouter from "@routes/UserRoute";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/rentals", RentalRouter);
app.use("/api/v1/projects", ProjectRouter);
app.use("/api/v1/organisations", OrganisationRouter);
app.use("/api/v1/events", EventRouter);

const server = http.createServer(app);

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("/{*any}", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
);

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
