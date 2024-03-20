import { Router } from "express";
import { validate } from "express-validation";
import { RequestsController } from "./controller";
import { validateJwtHeader } from "../../middlewares/jwt_middleware";
import { newRequests, updateRequest, updateTypeRequest } from "./validation";

const routes = Router();

const requestsController = new RequestsController();

routes.post("/type-registration", [validateJwtHeader, validate(newRequests)], requestsController.requestTypeRegistration);
routes.get("/list", [validateJwtHeader], requestsController.get);
routes.get("/list-requests", [validateJwtHeader], requestsController.getListRequest);
routes.get("/list-requests-user", [validateJwtHeader], requestsController.getListRequestUser);
routes.post("/requests-user", [validateJwtHeader], requestsController.getRequestUser);
routes.post("/update-type-requests", [validateJwtHeader, validate(updateTypeRequest)], requestsController.updateTypeRequest);
// routes.post("/door-access-request-register", [validateJwtHeader], requestsController.doorAccessRequestRegister);
routes.post("/register", [validateJwtHeader], requestsController.registerRequest);
routes.post("/update", [validate(updateRequest), validateJwtHeader], requestsController.update);
routes.get('/report-pdf',[validateJwtHeader], requestsController.reportPdf)
// routes.get("/pdf", [validateJwtHeader], requestsController.pdf);

export default routes;
