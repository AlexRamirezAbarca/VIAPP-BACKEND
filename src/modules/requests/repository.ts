import DataBase from "../../database/connection/connection";
import { actionRepository } from "../../helpers/action_repository";
import { MysqlErrorI } from "../../models/service_response_interface";
import {
  DoorAccessRequestRegisterI,
  GetRequestI,
  GetRequestNotificationI,
  ListRequestI,
  RegisterRequestI,
  ReportPDFI,
  RequestI,
  UpdateRequestI,
  UpdateTypeRequestI,
} from "./models";

class RequestsRepository {
  private readonly _context: DataBase;

  public constructor(context: DataBase) {
    this._context = context;
  }

  public async requestTypeRegistration(
    body: RequestI
  ): Promise<MysqlErrorI | number | null> {
    const query = `CALL SP_TYPE_REQUEST("SAVE",'${body.name_request}','${
      body.description_request
    }','${body.request_code}', 1, ${null});`;
    return await actionRepository(query, this._context);
  }

  public async registerRequest(
    body: RegisterRequestI
  ): Promise<MysqlErrorI | number> {
    const query = `CALL SP_REQUEST('SAVE', '${body.code ?? null}', '${
      body.reason ?? null
    }', ${global.token.id}, ${
      body.type_request_id
    }, ${null}, '${null}', ${null});`;
    return await actionRepository(query, this._context);
  }

  public async code(code: string) {
    const query = `SELECT * FROM type_request WHERE request_code = '${code}';`;

    const results = await this._context.executeQuery(query);
    if (results?.length > 0) return results[0][0].id as number;
  }

  public async get() {
    let query: string;
    let response = null;

    if (global.token.super_user == process.env.SUPER_USER) {
      query = `CALL SP_TYPE_REQUEST("FIND",${null},${null},${null},${null}, ${null});`;
    } else {
      query = `CALL SP_TYPE_REQUEST("FIND_USER",${null},${null},${null},${null}, ${null});`;
    }

    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0] as RequestI[];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async getListRequest(status_request: number) {
    const query = `CALL SP_REQUEST('SELECT', '${null}', '${null}', ${null}, ${null}, ${null}, '${null}', ${status_request});`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0] as ListRequestI[];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async getListRequestUser() {
    const query = `SELECT r.id, CONCAT(u.first_name,' ', u.last_name) as 'full_name', tr.name_request, r.code, sr.name as 'name_status', sr.color as 'color_status' FROM request r INNER JOIN type_request tr 
                      ON r.type_request_id  = tr.id INNER JOIN status_request sr on sr.id = r.status_request_id 
                      inner join users u on r.user_id_creation = u.id where u.id = ${global.token.id} order by r.id;`;
    let response = [] as ListRequestI[];

    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results as ListRequestI[];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async listRequestUser(user_id: number) {
    const query = `SELECT r.id, CONCAT(u.first_name,' ', u.last_name) as 'full_name', tr.name_request, r.code, sr.name as 'name_status', sr.color as 'color_status' FROM request r INNER JOIN type_request tr 
                      ON r.type_request_id  = tr.id INNER JOIN status_request sr on sr.id = r.status_request_id 
                      inner join users u on r.user_id_creation = u.id where u.id = ${user_id} and r.status_request_id = 1 order by r.id;`;
    let response = [] as ListRequestI[];

    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results as ListRequestI[];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async codeRequest(code: string) {
    const query = `SELECT * FROM request WHERE code = '${code}';`;

    const results = await this._context.executeQuery(query);
    if (results?.length > 0) return results[0][0].id as number;
  }

  // public async doorAccessRequestRegister(body: DoorAccessRequestRegisterI): Promise<MysqlErrorI | number | null> {
  //   const query = ` CALL SP_TYPE_REQUEST('SAVE-DOOR-ACCESS-REQUEST', '${body.code}', '${body.reason}', ${body.office_number}, '${body.area}', '${body.position}', ${global.token.id});`;
  //   return await actionRepository(query, this._context);
  // }

  public async getRequestUser(id: number) {
    //   const query = `CALL SP_REQUEST('SELECT', '${null}', '${null}', ${null}, ${null}, ${id});`;
    //   // const query = `select r.id, r.code, r.reason, DATE_FORMAT(r.date_creation , '%d/%m/%Y') as date_creation, u.first_name, u.last_name, c.name as 'position',
    //   // a.name as 'area', u.identification, u.email, tr.name_request from request r inner join users u on r.user_id_creation = u.id
    //   // inner join type_request tr on r.type_request_id = tr.id
    //   // inner join charge c on u.charge_id = c.id
    //   // inner join area a on u.area_id = a.id where r.id = ${id};`;

    //  const results = await this._context.executeQuery(query);
    //   if (results?.length > 0) return results[0] as GetRequestI;
    const query = `CALL SP_REQUEST('FIND_REQUEST', '${null}', '${null}', ${null}, ${null}, ${id}, '${null}', ${null});`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0] as GetRequestI;
      }
      return response?.map((item: { user_data_admin: any; request: any }) => {
        return {
          ...item,
          user_data_admin: JSON.parse(String(item.user_data_admin)),
          request: JSON.parse(String(item.request)),
        };
      })[0];
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public async update(body: UpdateRequestI): Promise<MysqlErrorI | number> {
    const query = `CALL SP_REQUEST('UPDATE', '${null}', '${null}', ${
      global.token.id
    }, ${null}, ${body.request_id}, ${
      body.description != null ? `'${body.description}'` : null
    }, ${body.status_id_request});`;
    return await actionRepository(query, this._context);
  }

  public async getRequest(id: number) {
    const query = `select count(*) as count from request where id = ${id} and edit = 1`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async getRequestNotification(id: number) {
    const query = `CALL SP_REQUEST('NOTIFICATION_USER', '${null}', '${null}', ${null}, ${null}, ${id}, '${null}', ${null});`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0][0] as GetRequestNotificationI;
      }

      return response;
      //   return response?.map((item: { user_data_admin: any; request: any; }) => {
      //     return {
      //         ...item,
      //         user_data_admin: JSON.parse(String(item.user_data_admin)),
      //         request: JSON.parse(String(item.request)),
      //     }
      // })[0];
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public async reportPdf() {
    const query = `CALL SP_DATA_REQUESTS();`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0] as ReportPDFI;
      }
      return response?.map((item: { admin: any; report: any }) => {
        return {
          ...item,
          admin: JSON.parse(String(item.admin)),
          report: JSON.parse(String(item.report)),
        };
      })[0];
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public async updateTypeRequest(
    body: UpdateTypeRequestI
  ): Promise<MysqlErrorI | number> {
    const query = `CALL SP_TYPE_REQUEST("UPDATE",${null},${null},${null},${
      body.status
    }, ${body.request_type_id});`;
    return await actionRepository(query, this._context);
  }
}

export default RequestsRepository;
