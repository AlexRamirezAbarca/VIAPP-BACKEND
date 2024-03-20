import DataBase from "../../database/connection/connection";
import { instanceBll } from "../../helpers/bll_instance";
import ProfileRepository from "./repository";

class ProfileBll {
  private readonly _database: DataBase;
  private readonly _profileRepository: ProfileRepository;

  public constructor(database: DataBase) {
    this._database = database;
    this._profileRepository = new ProfileRepository(this._database);
  }

  public static fromContext(): Promise<ProfileBll | null> {
    return instanceBll<ProfileBll>(ProfileBll);
  }

  public async get() {
    const profile = await this._profileRepository.get();
    this._database.closeConnection();
    return profile;
  }
}

export default ProfileBll;
