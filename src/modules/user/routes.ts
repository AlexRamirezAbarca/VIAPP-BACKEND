import { Router } from "express";
import { UserController } from "./controller";
import { validateJwtHeader } from "../../middlewares/jwt_middleware";
import { validate } from "express-validation";
import { updateUser } from "./validation";

const routes = Router();

const userController = new UserController();

routes.get("/list", validateJwtHeader, userController.getUsers);
routes.post("/update-status", [validateJwtHeader, validate(updateUser)], userController.updateStatus);

export default routes;