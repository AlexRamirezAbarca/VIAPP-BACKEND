import { Request, Response } from "express";
import * as generalHelper from "../../helpers/general";
import { messages } from "../../constants/messages";
import { ResponseBuilder } from "../../helpers/response_builder";
import { HttpStatusCode } from "../../constants/status_code";
import CatalogueBll from "./bll";


export class CatalgueController {
    
public async get(req: Request, res: Response) {
    const catalogueBll = await CatalogueBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    if (!catalogueBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    const catalogue = await catalogueBll.get();
    
    if (catalogue) responseBuilder.setData(response, catalogue[0]);
    else
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        messages["400"]
      );
    return generalHelper.serviceResponse(response);
  }
}
