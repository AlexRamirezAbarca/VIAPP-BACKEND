import { Request, Response } from "express";
import { messages } from "../../constants/messages";
import * as generalHelper from "../../helpers/general";
import { ResponseBuilder } from "../../helpers/response_builder";
import { HttpStatusCode } from "../../constants/status_code";
import ProfileBll from "./bll";



export class ProfileController {

  public async get(req: Request, res: Response) {
    const profileBll = await ProfileBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    if (!profileBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const profile = await profileBll.get();
    if (profile) responseBuilder.setData(response, profile);
    else
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        messages["400"]
      );
    return generalHelper.serviceResponse(response);
  }
}
