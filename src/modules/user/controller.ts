import { Request, Response } from "express";
import { messages } from "../../constants/messages";
import * as generalHelper from "../../helpers/general";
import { ResponseBuilder } from "../../helpers/response_builder";
import { HttpStatusCode } from "../../constants/status_code";
import UserBll from "./bll";


export class UserController{
    public async getUsers(req: Request, res: Response){
        const userBll = await UserBll.fromContext();
        const responseBuilder = new ResponseBuilder(res);
        let response = responseBuilder.build();

        if (!userBll) {
          response = responseBuilder.build(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            messages["500"]
          );
          return generalHelper.serviceResponse(response);
        }
        
        const users = await userBll.getUsers();
        
        if(global.token.super_user == process.env.SUPER_USER){

        if (users) {
          responseBuilder.setData(response, { users });
        }

        else{ 
          response = responseBuilder.build(HttpStatusCode.BAD_REQUEST, messages["400"]);
        }
        }else{
          response = responseBuilder.build(HttpStatusCode.UNAUTHORIZED, messages["401"]);
        }
        return generalHelper.serviceResponse(response);
    }

    public async updateStatus(req:Request, res:Response){
        const userBll = await UserBll.fromContext();
        const responseBuilder = new ResponseBuilder(res);
        let response = responseBuilder.build(HttpStatusCode.CREATED);
    
        if (!userBll) {
          response = responseBuilder.build(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            messages["500"]
          );
          return generalHelper.serviceResponse(response);
        }
    
        const resp = await userBll.updateStatus(req.body);
    
        if (resp.error != 0) {
          response = responseBuilder.build(
            resp.statusCode ?? HttpStatusCode.BAD_REQUEST,
            resp.message ?? messages["400"]
          );
    
        }else{
            response = responseBuilder.build(
              HttpStatusCode.OK,
              messages["200"]
            );
        }
    
        return generalHelper.serviceResponse(response);
      }

}