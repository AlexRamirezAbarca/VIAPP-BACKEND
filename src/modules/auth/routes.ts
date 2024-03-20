import { Router } from "express";
import { validate } from "express-validation";
import { AuthController } from "./controller";
import { validateJwtBody, validateJwtHeader } from "../../middlewares/jwt_middleware";
import { getRecoverValidation, login, postChangePassValidation, register } from "./validation";

const routes = Router();

const authController = new AuthController();

routes.post("/register",[validate(register)], authController.register);
routes.post("/login", [validate(login)], authController.login);
routes.post("/recovery-password", authController.recoveryPassword);
routes.post("/recovery-password/get-code", [validate(getRecoverValidation)], authController.get);
routes.post("/recovery-password/change-password", [validateJwtBody,validate(postChangePassValidation)], authController.changePassword);

export default routes;
