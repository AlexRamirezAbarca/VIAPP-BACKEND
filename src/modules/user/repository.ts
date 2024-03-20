import DataBase from "../../database/connection/connection";
import { actionRepository } from "../../helpers/action_repository";
import { MysqlErrorI } from "../../models/service_response_interface";
import { GetUsers, UpdateStatusUserI } from "./models";

class UserRepository {
  private readonly _context: DataBase;

  public constructor(context: DataBase) {
    this._context = context;
  }


  public async getUsers() {
    const query = `CALL SP_USER('SELECT', ${null}, ${null});`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0] as GetUsers[];
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  public async updateStatus(body:UpdateStatusUserI): Promise<MysqlErrorI | number> {
    const query = `CALL SP_USER('UPDATE', ${body.status}, ${body.user_id});`;
    return await actionRepository(query, this._context);
  }

}

export default UserRepository;
