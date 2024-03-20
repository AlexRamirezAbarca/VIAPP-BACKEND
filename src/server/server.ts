import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ValidationError } from "express-validation";
import morgan from "morgan";
import bodyParser from "body-parser";
import { messages } from "../constants/messages";
import * as auth from "../modules/auth/routes";
import * as requests from "../modules/requests/routes";
import * as profile from "../modules/profile/routes";
import * as catalogue from "../modules/catalogue/routes";
import * as user from "../modules/user/routes"
import { serviceResponse } from "../helpers/general";
import { ServiceResponseI } from "../models/service_response_interface";

class Server {
  private app!: Application;
  private port!: string;

  private apiPaths = {
    auth: "/auth",
    requests: "/requests",
    profile: "/profile",
    catalogue: "/catalogue",
    user: "/user",
  };

  constructor() {
    dotenv.config();
    this.port = process.env.PORT;
    this.app = express();
    this.middlewares();
    this.routes();
    //this.connect();
  }

  routes() {
    this.app.use(this.apiPaths.auth, auth.default);
    this.app.use(this.apiPaths.requests, requests.default);
    this.app.use(this.apiPaths.profile, profile.default);
    this.app.use(this.apiPaths.catalogue, catalogue.default);
    this.app.use(this.apiPaths.user, user.default);
    this.app.get("/", (req, res) => {
      return res.json({ data: null, message: messages["data"] });
    });
    this.app.use(function (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      if (err instanceof ValidationError) {
        let objServiceResponse: ServiceResponseI = {
          statusCode: err.statusCode,
          res,
          message: "",
          data: null,
        };
        let messages: string[] = [];

        if (err.details.body) {
          messages = err.details.body?.map((e) => e.message);
        }
        if (err.details.query) {
          messages = err.details.query?.map((e) => e.message);
        }
        messages?.forEach((element) => {
          objServiceResponse.message += element;
        });

        return serviceResponse(objServiceResponse);
      }

      return res.status(500).json(err);
    });
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(Date());
      console.log(`Server on port: ${this.port}`);
    });
  }
}

export default Server;
