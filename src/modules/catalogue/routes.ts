import { Router } from "express";
import { CatalgueController } from "./controller";
import { validateJwtHeader } from "../../middlewares/jwt_middleware";

const routes = Router();

const catalogueController = new CatalgueController();

routes.get("/", catalogueController.get);

export default routes;