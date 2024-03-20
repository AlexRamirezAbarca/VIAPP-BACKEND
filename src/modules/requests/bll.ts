import DataBase from "../../database/connection/connection";
import { instanceBll } from "../../helpers/bll_instance";
import { randomCharacters } from "../../helpers/random";
import { ErrorI, MysqlErrorI } from "../../models/service_response_interface";
import { DoorAccessRequestRegisterI, GetPdf, GetRequestI, GetRequestNotificationI, RegisterRequestI, ReportPDFI, RequestI, UpdateRequestI, UpdateTypeRequestI } from "./models";
import RequestsRepository from "./repository";
import * as generalHelper from "../../helpers/general";
import { Request, Response } from "express";
import { pdfRequest } from "../../helpers/pdf/pdf_request";
// import fs from "fs";
// import path from "path";
import { AdminNotificationRequestHandler } from "../../helpers/handlers/admin_notification_request.handler";
import { UserNotificationRequestHandler } from "../../helpers/handlers/user_notification_request.handler";
import { HttpStatusCode } from "../../constants/status_code";
import { messages } from "../../constants/messages";
import { NotificationRequestStatusHandler } from "../../helpers/handlers/notification_request_status.handler";
import { reportRequest } from "../../helpers/pdf/report_request";
import { NotificationReportRequestHandler } from "../../helpers/handlers/notification_report_request.handler";
// import { config } from "dotenv";
// config();

class RequestsBll {
  private readonly _database: DataBase;
  private readonly _requestsRepository: RequestsRepository;

  public constructor(database: DataBase) {
    this._database = database;
    this._requestsRepository = new RequestsRepository(this._database);
  }

  public static fromContext(): Promise<RequestsBll | null> {
    return instanceBll<RequestsBll>(RequestsBll);
  }

  public async registerRequest(body: RegisterRequestI, res:Response, req:Request): Promise<ErrorI> {

    try {
      let code = generalHelper.generateUniqueCode();

      let codeUnique = await this._requestsRepository.codeRequest(code);

      while (codeUnique != undefined) {
        code = generalHelper.generateUniqueCode();
        codeUnique = await this._requestsRepository.codeRequest(code);
      }

      body.code = code;

      const resp = await this._requestsRepository.registerRequest(body);
      
      if(resp){
        const request =  await this._requestsRepository.getRequestUser(resp as number) as GetRequestI;
        
        //return {error:1, message:request.user_data_admin.email_admim};
        // console.log('request', request);
        //return {error:1, message:request.code};

        const templateReport = 'requests.hbs' 
        const pdf = await pdfRequest(request!, templateReport, res, req);
  
       if(pdf !== undefined){
        
        const bufferPdf = Buffer.from(pdf as any, 'base64');
        const base64String = bufferPdf.toString('base64');

        AdminNotificationRequestHandler({
          first_name: request.request.first_name,
          last_name: request.request.last_name,
          identification: request.request.identification,
          name_request: request.request.name_request,
          code: request.request.code,
          email: request.request.email,
          date_creation: request.request.date_creation,
          user_data_admin: request.user_data_admin,
          attachments: [
            {
              filename: `${request.request.identification}-${request.request.name_request}.pdf`,
              content: base64String,
              encoding: 'base64',
            },
          ],
        });

        UserNotificationRequestHandler({
          first_name: request.request.first_name,
          last_name: request.request.last_name,
          name_request: request.request.name_request,
          email: request.request.email,
          date_creation: request.request.date_creation,
          attachments: [
            {
              filename: `${request.request.identification}-${request.request.name_request}.pdf`,
              content: base64String,
              encoding: 'base64',
            },
          ],
        });
      
        this._database.closeConnection();
        return {error:0}
        //eturn pdf();
      }else{
        this._database.closeConnection();
        return { error: 1 };
      }
      }else{
        this._database.closeConnection();
        return {error:1};
      }

    } catch (error) {
      console.log(error);
      this._database.closeConnection();
      return  {error: 1, message: error.toString()};
    }
    
  }

  public async requestTypeRegistration(body: RequestI): Promise<MysqlErrorI> {
    let code = randomCharacters("num", 10);
    let codeUnique = await this._requestsRepository.code(code);

    while (codeUnique != undefined) {
      code = randomCharacters("num", 10);
      codeUnique = await this._requestsRepository.code(code);
    }

    body.request_code = code;
    const resp = await this._requestsRepository.requestTypeRegistration(body);
    this._database.closeConnection();

    if (typeof resp === "object") return resp as MysqlErrorI;
    return { error: 0 };
  }

  public async get() {
    const requests = await this._requestsRepository.get();
    this._database.closeConnection();
    return requests;
  }

  public async getListRequest(status_request: number) {
    const requests = await this._requestsRepository.getListRequest(status_request);
    this._database.closeConnection();
    return requests;
  }

  public async getListRequestUser() {
    const requests = await this._requestsRepository.getListRequestUser();
    this._database.closeConnection();
    return requests;
  }

  public async getRequestUser(user_id:number) {
    const requests = await this._requestsRepository.listRequestUser(user_id);
    this._database.closeConnection();
    return requests;
  }

  public async update(body: UpdateRequestI): Promise<ErrorI> {

    try {
      if(global.token.super_user == process.env.SUPER_USER){
        const request = await this._requestsRepository.getRequest(body.request_id);
        //console.log('request', request)
        this._database.closeConnection();
        if(request.count == 1) return {error:1, message: messages["updateRequestError"]};
        //console.log(request.count == 1);

        const request_id = await this._requestsRepository.update(body);

        if(request_id){
          const request_notification =  await this._requestsRepository.getRequestNotification(request_id as number) as GetRequestNotificationI;
          
          //console.log('request_notification', request_notification);

          NotificationRequestStatusHandler({
            code: request_notification.code,
            description: request_notification.description,
            full_name: request_notification.full_name,
            name_status: request_notification.name_status,
            email: request_notification.email,
            // id: request_notification.id,
          });
          
          this._database.closeConnection();
          return {error:0}
        }else{
          this._database.closeConnection();
          return {error: 1};
        }
      }else{
        this._database.closeConnection();
        return {error:1, message: messages["401"], statusCode: HttpStatusCode.UNAUTHORIZED}
      }
    } catch (error) {
      this._database.closeConnection();
      return {error:1, message: error,};
    }
    
  }
  public async reportPdf(res:Response, req:Request): Promise<ErrorI>{

    try {
      if(global.token.super_user == process.env.SUPER_USER){
        const report = await this._requestsRepository.reportPdf() as ReportPDFI;

        if(report){
          const templateReportpdf = 'report_request.hbs' 
          const reportPdf = await reportRequest(report!, templateReportpdf, res, req);
          if(reportPdf !== undefined){
        
            const bufferPdf = Buffer.from(reportPdf as any, 'base64');
            const base64String = bufferPdf.toString('base64');
    
            NotificationReportRequestHandler({
              full_name: report.admin.full_name,
              email: report.admin.email,
              attachments: [
                {
                  filename: `reporte.pdf`,
                  content: base64String,
                  encoding: 'base64',
                },
              ],
            });
            
            this._database.closeConnection();
            return {error:0}
          }else{

            this._database.closeConnection();
            return {error:1};
          }
        }else{

          this._database.closeConnection();
          return {error: 1};
        }
      }else{
        
        this._database.closeConnection();
        return {error:1, message: messages["401"], statusCode: HttpStatusCode.UNAUTHORIZED}
      }
    } catch (error) {
      this._database.closeConnection();
      return {error:1, message: error,};
    }
  }

  public async updateTypeRequest(body: UpdateTypeRequestI): Promise<MysqlErrorI> {
  
    try {
        const response = await this._requestsRepository.updateTypeRequest(body);

        console.log(response)

        if(response){
          await this._database.commit();
          this._database.closeConnection();
          return {error: 0};
        }else{
          await this._database.rollback();
          this._database.closeConnection();
          return { error: 1 };
        }
    } catch (error) {
      await this._database.rollback();
      this._database.closeConnection();
      return { error: 1, message:error };
    }
  }
  // public async doorAccessRequestRegister(body: DoorAccessRequestRegisterI, res:Response, req:Request): Promise<ErrorI> {
  //   //  let date = generalHelper.transformDate(new Date().toISOString(), "YYYYMMDD");
  //   //  let hour = generalHelper.transformDate(new Date().toISOString(), "HHmmssSSS");
  //   //  let code = randomCharacters("num", 4);
  //   //let date = generalHelper.transformDate(new Date().toISOString(), "YYYYMMDDHHmmss");
  //   //let codeUnique = `${date}-${hour}-${code}`;
  //   //console.log()
  //   try {
  //     let code = generalHelper.generateUniqueCode();
  //     let codeUnique = await this._requestsRepository.codedoorAccessRequest(code);

  //     while (codeUnique != undefined) {
  //       code = randomCharacters("num", 10);
  //       codeUnique = await this._requestsRepository.codedoorAccessRequest(code);
  //     }

  //     body.code = code;
  //     const resp = await this._requestsRepository.doorAccessRequestRegister(body);

  //     if(resp){
  //       const request =  await this._requestsRepository.getDoorAccessRequest(resp as number);
  //       //request.formatted_date = generalHelper.formatDate();
  //       // console.log('fecha', request.formatted_date)
  //       const templateReport = 'requests.hbs' 
  //       const pdf = await pdfRequest(request!, templateReport, res, req);
  //       // console.log('pdf', base64String)
  //       // return {error:1, message:base64String}
  //      if(pdf !== undefined){
        
  //       const bufferPdf = Buffer.from(pdf as any, 'base64');
  //       const base64String = bufferPdf.toString('base64');
  //       console.log(base64String);

  //       requestNotificationHandler({
  //         first_name: request.first_name,
  //         last_name: request.last_name,
  //         identification: request.identification,
  //         name_request: 'Solicitud de acceso a puertas',
  //         code: request.code,
  //         email: request.email,
  //         date_creation: request.date_creation,
  //         attachments: [
  //           {
  //             filename: `${request.identification}-${request.code}.pdf`,
  //             content: base64String,
  //             encoding: 'base64',
  //           },
  //         ],
  //       });
  //       this._database.closeConnection();
  //       return {error:0}
  //       //eturn pdf();
  //     }else{
  //       this._database.closeConnection();
  //       return { error: 1 };
  //       // return res.status(400).json({
  //       //   error:true,
  //       //   message: `La ${null} no se encuentra registrada o no está inactiva.`
  //       // });
  //     }
  //       // this._database.closeConnection();
  //       // return { error: 0 };
  //     }else{
  //       this._database.closeConnection();
  //       return {error:1, message:'knfvfkbk'}
  //     }
      
  //     // this._database.closeConnection();
  //     // if (typeof resp === "object") return resp as MysqlErrorI;
  //     // return { error: 0 };
  //   } catch (error) {
  //     this._database.closeConnection();
  //     return { error: 1, message: error.message};
  //   }
  // }

  // async getPdf(body:GetPdf, res:Response, req:Request){
  //   //const subject = type_page === process.env.PAGE_NOVELTY ? 'novedad' : 'bitácora';
  //   const templateReport = 'requests.hbs' 
  //   const pdfReport = await this._requestsRepository.getDoorAccessRequest(body.requests_id);
    
  //   this._database.closeConnection();

  //   //  console.log("------ noveltyPdfReport", noveltyPdfReport);
     
     
  //   const pdf = await pdfRequest(pdfReport!, templateReport, res, req);

  //   if(pdf !== undefined){
  //     //return pdf();
  //   }else{
  //     return res.status(400).json({
  //       error:true,
  //       message: `La ${null} no se encuentra registrada o no está inactiva.`
  //     });
  //   }
    
  // }
}

export default RequestsBll;
