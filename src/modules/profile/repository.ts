import DataBase from "../../database/connection/connection";
import { RequestI } from "../requests/models";
import { UserProfileI } from "./models";

class ProfileRepository {
  private readonly _context: DataBase;

  public constructor(context: DataBase) {
    this._context = context;
  }

  public async get() {
    const query = `CALL SP_PROFILE_USER("SELECT", ${global.token.id});`;
    let response = null;
    try {
      const results = await this._context.executeQuery(query);
      if (results?.length > 0) {
        response = results[0][0] as UserProfileI;
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }
}

export default ProfileRepository;
