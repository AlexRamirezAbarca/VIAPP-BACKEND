import { Router } from "express";
import { ProfileController } from "./controller";
import { validateJwtHeader } from "../../middlewares/jwt_middleware";

const routes = Router();

const profileController = new ProfileController();

routes.get("/", validateJwtHeader, profileController.get);

export default routes;