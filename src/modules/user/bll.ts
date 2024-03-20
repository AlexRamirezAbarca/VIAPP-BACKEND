import { messages } from "../../constants/messages";
import { HttpStatusCode } from "../../constants/status_code";
import DataBase from "../../database/connection/connection";
import { instanceBll } from "../../helpers/bll_instance";
import { ErrorI } from "../../models/service_response_interface";
import { UpdateStatusUserI } from "./models";
import UserRepository from "./repository";

class UserBll {
  private readonly _database: DataBase;
  private readonly _userRepository: UserRepository;

  public constructor(database: DataBase) {
    this._database = database;
    this._userRepository = new UserRepository(this._database);
  }

  public static fromContext(): Promise<UserBll | null> {
    return instanceBll<UserBll>(UserBll);
  }

  public async getUsers() {
    const requests = await this._userRepository.getUsers();
    this._database.closeConnection();
    return requests;
  }

  public async updateStatus(body: UpdateStatusUserI): Promise<ErrorI> {

    try {
      if(global.token.super_user == process.env.SUPER_USER){
    
        const response = await this._userRepository.updateStatus(body);

        if(response){
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
}


export default UserBll;
