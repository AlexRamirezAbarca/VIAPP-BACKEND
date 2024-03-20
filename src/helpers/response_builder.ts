import { Response } from "express";
import { HttpStatusCode } from "../constants/status_code";
import { messages } from "../constants/messages";
import { ServiceResponseI } from "../models/service_response_interface";

export class ResponseBuilder {
  private readonly _res?: Response;

  public constructor(res?: Response) {
    this._res = res;
  }

  public build(
    statusCode: number = HttpStatusCode.OK,
    message?: string,
    data?: any
  ) {
    const objServiceResponse: ServiceResponseI = {
      res: (this._res !== undefined ) ? this._res : null,
      data,
      message: message ?? messages["200"],
      statusCode: statusCode ?? HttpStatusCode.OK,
    };
    return objServiceResponse;
  }

  public setData(objServiceResponsedata: ServiceResponseI, data: any) {
    objServiceResponsedata.data = data;
  }
}
