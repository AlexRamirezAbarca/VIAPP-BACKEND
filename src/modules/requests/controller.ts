import { Request, Response } from "express";
import { messages } from "../../constants/messages";
import * as generalHelper from "../../helpers/general";
import { ResponseBuilder } from "../../helpers/response_builder";
import { HttpStatusCode } from "../../constants/status_code";
import RequestsBll from "./bll";
import { RequestI } from "./models";
// import { config } from "dotenv";
// config();

export class RequestsController {

  public async registerRequest(req:Request, res:Response){
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const resp = await requestsBll.registerRequest(req.body, res, req);

    if (resp.error != 0) {
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );

    }else{
        response = responseBuilder.build(
          HttpStatusCode.OK,
          messages["createRequest"]
        );
    }

    return generalHelper.serviceResponse(response);
  }

  public async requestTypeRegistration(req: Request<{}, {}, RequestI>, res: Response) {
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const resp = await requestsBll.requestTypeRegistration(req.body);

    if (resp.error != 0)
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );

    return generalHelper.serviceResponse(response);
  }

  // public async doorAccessRequestRegister(req: Request, res: Response) {
  //   const requestsBll = await RequestsBll.fromContext();
  //   const responseBuilder = new ResponseBuilder(res);
  //   let response = responseBuilder.build(HttpStatusCode.CREATED);

  //   if (!requestsBll) {
  //     response = responseBuilder.build(
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       messages["500"]
  //     );
  //     return generalHelper.serviceResponse(response);
  //   }

  //   const resp = {error:1, message:'m'}
  //   //await requestsBll.doorAccessRequestRegister(req.body,res, req);

  //   if (resp.error != 0)
  //     response = responseBuilder.build(
  //       HttpStatusCode.BAD_REQUEST,
  //       resp.message ?? messages["400"]
  //     );

  //   return generalHelper.serviceResponse(response);
  // }

  public async get(req: Request, res: Response) {
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const requests = await requestsBll.get();
    if (requests) responseBuilder.setData(response, { requests });
    else
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        messages["400"]
      );
    return generalHelper.serviceResponse(response);
  }

  public async getListRequest(req: Request, res: Response) {
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    let status_request = req.query.status_request? parseInt(req.query.status_request as string) : null;

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    
    const requests = await requestsBll.getListRequest(status_request);
    if(global.token.super_user == process.env.SUPER_USER){
    if (requests) {
      responseBuilder.setData(response, { requests });
    }
    else{ 
      response = responseBuilder.build(HttpStatusCode.BAD_REQUEST, messages["400"]);
    }
    }else{
      response = responseBuilder.build(HttpStatusCode.UNAUTHORIZED, messages["401"]);
    }
    return generalHelper.serviceResponse(response);
  }
  public async getListRequestUser(req: Request, res: Response) {
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    
    const requests = await requestsBll.getListRequestUser();
    if (requests) {
      responseBuilder.setData(response, { requests });
    }
    else{ 
     
      response = responseBuilder.build(HttpStatusCode.BAD_REQUEST, messages["400"]);
    }
    
    return generalHelper.serviceResponse(response);
  }

  public async getRequestUser(req: Request, res: Response) {
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();

    let { user_id } = req.body;

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    
    const requests = await requestsBll.getRequestUser(user_id);
    if (requests) {
      responseBuilder.setData(response, { requests });
    }
    else{ 
     
      response = responseBuilder.build(HttpStatusCode.BAD_REQUEST, messages["400"]);
    }
    
    return generalHelper.serviceResponse(response);
  }

  public async updateTypeRequest(req:Request, res:Response){
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    let body = req.body;

    const resp = await requestsBll.updateTypeRequest(body);

    if (resp.error != 0) {
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
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

  public async update(req:Request, res:Response){
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const resp = await requestsBll.update(req.body);

    if (resp.error != 0) {
      response = responseBuilder.build(
        resp.statusCode ?? HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );

    }else{
        response = responseBuilder.build(
          HttpStatusCode.OK,
          messages["updateRequest"]
        );
    }

    return generalHelper.serviceResponse(response);
  }

  public async reportPdf(req:Request, res:Response){
    const requestsBll = await RequestsBll.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();
    if (!requestsBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const resp = await requestsBll.reportPdf(res, req);

    if (resp.error != 0) {
      response = responseBuilder.build(
        resp.statusCode ?? HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );

    }else{
        response = responseBuilder.build(
          HttpStatusCode.OK,
          messages["reportPdf"]
        );
    }
    return generalHelper.serviceResponse(response);
  }
  // public async pdf(req: Request, res: Response) {
  //   const requestsBll = await RequestsBll.fromContext();
  //   const responseBuilder = new ResponseBuilder(res);
  //   let response = responseBuilder.build();

  //   if (!requestsBll) {
  //     response = responseBuilder.build(
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       messages["500"]
  //     );
  //     return generalHelper.serviceResponse(response);
  //   }
  //   // let novelty_id = parseInt(req.body as string);
  //   // let type_page = req.query.type_page ? String(req.query.type_page) : null;

  //   const report = await requestsBll.getPdf(req.body, res, req);

  //   return report;
  // }
}
