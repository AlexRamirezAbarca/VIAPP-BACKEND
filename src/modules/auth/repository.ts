import DataBase from "../../database/connection/connection";
import { actionRepository } from "../../helpers/action_repository";
import { MysqlErrorI } from "../../models/service_response_interface";
import { GetRecoverPasswordI, RecoverPasswordI, UserLoginI, UserPostBodyI } from "./models";
import * as generalHelper from "../../helpers/general";

class AuthRepository{
    private readonly _context: DataBase;

  public constructor(context: DataBase) {
    this._context = context;
  }

  public async register(body: UserPostBodyI): Promise<MysqlErrorI | number | null>{
    const query = `CALL SP_AUTH("SAVE",'${body.first_name}','${body.last_name}','${body.email}','${body.user_name}','${body.password}','${body.identification}','${body.url_photo}', '${body.phone}', '${body.birth_date}', ${null}, ${body.charge_id}, ${body.area_id});`;
    return await actionRepository(query, this._context);
  }

  public async getEmailUserName(user_name: string, email:string):Promise<MysqlErrorI> { 
    const query = `CALL SP_AUTH("EMAIL_USER_EXISTS",${null},${null},'${email}','${user_name}',${null},${null},${null},${null},${null},${null},${null},${null})`;
    const results = await this._context.executeQuery(query);
    if (results[0]?.length > 0) {
      return {error: 1}; 
    }else{
      return {error: 0};
    }
  }

  // public async getUsername(user_name:string): Promise<number | null> {
  //   //const query = `SELECT id FROM users WHERE user_name = '${user_name.trim()}'; `;
  //   const query = `CALL SP_AUTH("LOGIN_USER_NAME",${null},${null},${null},'${user_name}',${null},${null},${null},${null},${null},${null},${null},${null})`;
  //   const results = await this._context.executeQuery(query);
  //   if (results?.length > 0) return results[0].id as number;
  //   return null;
  // }

  public async login(user_name: string): Promise<UserLoginI | null> {
    const query = `CALL SP_AUTH("LOGIN",${null},${null},${null},'${user_name}',${null},${null},${null},${null},${null},${null},${null},${null})`;
    //console.log(query);
    //const query = `SELECT id, first_name, last_name, email, user_name, password, super_user, identification, status FROM users WHERE user_name = '${user_name.trim()}'; `;
    //const query = `CALL SP_USER("LOGIN",${null},${null},${null},${null},'${null}','${null}','${username}','${null}','${null}','${null}',${null},${null});`;
    const results = await this._context.executeQuery(query);
    const objMysql = results[0].map(({ ...rest }) => {
      return { ...rest };
    });

    if (objMysql.length > 0) return objMysql[0] as UserLoginI;
    return null;
  }

  public async getUser(data: RecoverPasswordI) {
    const query = `CALL SP_RECOVER_PASSWORD("GET_USERNAME",'${data.user_name}',${null},${null},${null},${null},${null},${null},${null},${null});`;
    //const query = `select id, user_name from users where user_name = '${data.user_name}' and status = 1;`;
       
    const results = await this._context.executeQuery(query);
    //(results[0]?.length > 0
    if (results?.length > 0) return results[0][0];
    return null;
  }

  public async quantityRequests(id:number) {
    let date_creation_start = generalHelper.transformDate((new Date()).toISOString(),'YYYY-MM-DD')
    let date_creation_end = generalHelper.addDay((new Date()).toISOString(),1) 
    // console.log(date);
    // console.log(date2);
    // const query = `Select count(*) as user_id from recover_password where user_id=${id} and status = 'A' 
    // and date_creation BETWEEN '${date}' and '${date2}'`;
    const query = `CALL SP_RECOVER_PASSWORD("QUANTITY_REQUESTS",${null},${null},${null},${null},${id},${null},${null},'${date_creation_start}','${date_creation_end}');`;

    //console.log(query);
    const results = await this._context.executeQuery(query);
    if (results?.length > 0) return results[0][0];
    return null;
  }

  public async getId(data: GetRecoverPasswordI) {
    const query = `CALL SP_RECOVER_PASSWORD("SELECTID",'${data.user_name}',${null},${null},${null},${null},${null},${null},${null},${null});`;
        
    const results = await this._context.executeQuery(query);
    
    if (results?.length > 0) return results[0] as GetRecoverPasswordI[];
    return null;
    //SELECTID_RECOVER
  }

  public async getIdRecover(data: GetRecoverPasswordI) {
    const query = `CALL SP_RECOVER_PASSWORD("SELECTID_RECOVER",'${data.user_name}',${null},${null},${null},${null},${null},${null},${null},${null});`;
        
    const results = await this._context.executeQuery(query);
    
    if (results?.length > 0) return results[0] as GetRecoverPasswordI[];
    return null;
    //SELECTID_RECOVER
  }


  public async updateStatus(id:number) {
    let date_creation_start = generalHelper.transformDate((new Date()).toISOString(),'YYYY-MM-DD')
    let date_creation_end = generalHelper.addDay((new Date()).toISOString(),1) 
    // console.log(date,date2) UPDATE_STATUS
    //const query = `update recover_password set status = 'I' where user_id=${id} and date_creation BETWEEN '${date}' and '${date2}'`;
    const query = `CALL SP_RECOVER_PASSWORD("UPDATE_STATUS",${null},${null},${null},${null},${id},${null},${null},'${date_creation_start}','${date_creation_end}');`;
    //console.log(query)
    return await actionRepository(query, this._context);
  }

  public async save(body: RecoverPasswordI): Promise<MysqlErrorI | number> {
    const option = "SAVE";
    const query = `CALL SP_RECOVER_PASSWORD('${option}', '${body.user_name}', '${body.random}',${null},${null},${null},${null},${null},${null},${null});`;
    return await actionRepository(query, this._context);
  }

  public async getCode(data: RecoverPasswordI) {
    const query = `CALL SP_RECOVER_PASSWORD('SELECT_CODE', '${data.user_name}', '${data.random}',${null},${null},${null},${null},${null},${null},${null});`
       
    const results = await this._context.executeQuery(query);
    
    if (results?.length > 0) return results[0] as RecoverPasswordI[];
    return null;
  }

  public async updateCodeUsed(body:GetRecoverPasswordI) {
    const query = `CALL SP_RECOVER_PASSWORD("UPDATE_CODE_USED",${null},${null},${null},${null},${body.user_id},${null},${body.id},${null},${null});`;
        
    return await actionRepository(query, this._context);
  }

  public async changePassword(pass:string) {
    // console.log(global.user.user_id);
    const query = `CALL SP_RECOVER_PASSWORD("UPDATEUSER",${null},${null},${null},${null},${global.user.user_id},'${pass}',${null},${null},${null});`;
    return await actionRepository(query, this._context);
  }
}

export default AuthRepository;