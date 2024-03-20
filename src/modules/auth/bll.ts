import DataBase from "../../database/connection/connection";
import { instanceBll } from "../../helpers/bll_instance";
import { ErrorI, MysqlErrorI } from "../../models/service_response_interface";
import {
  ChangePassI,
  GetRecoverPasswordI,
  RecoverPasswordI,
  RecoverResponseI,
  RecoveryPasswordI,
  UserPostBodyI,
  UserPostLoginI,
  UserResponseLoginI,
} from "./models";
import bcryptjs from "bcryptjs";
import AuthRepository from "./repository";
import { JwtHelper } from "../../helpers/jwt";
import { randomCharacters } from "../../helpers/random";
import * as generalHelper from "../../helpers/general";
import { Allowed } from "../../constants/config";
import { recoveryPassword } from "../../helpers/handlers/recovery.handler";
import { welcomeHandler } from "../../helpers/handlers/welcome.handler";
import { emailSubjects } from "../../constants/subjects";
import { AppNotificationAccessHandler } from "../../helpers/handlers/app_notification_access.handler";
import { HttpStatusCode } from "../../constants/status_code";
import { CreatePhoto } from "../../helpers/create_photo";

class AuthBll {
  private readonly _database: DataBase;
  private readonly _authRepository: AuthRepository;

  public constructor(database: DataBase) {
    this._database = database;
    this._authRepository = new AuthRepository(this._database);
  }

  public static fromContext(): Promise<AuthBll | null> {
    return instanceBll<AuthBll>(AuthBll);
  }

  public async register(body: UserPostBodyI): Promise<MysqlErrorI> {
    let passwordSend = body.password;
    try {
      const username = await this._authRepository.getEmailUserName(body.user_name, body.email);
      if (username.error != 0 ) {
        this._database.closeConnection();
        return { error: 1, message: "El usuario o correo ya se encuentran registrados." };
      } else {
        const sal = bcryptjs.genSaltSync(10);
        const createPhoto = new CreatePhoto();
        body.url_photo = createPhoto.create(body.first_name, body.last_name);
        body.password = bcryptjs.hashSync(body.password, sal);
        const respSaveUSer: MysqlErrorI | null | number = await this._authRepository.register(body);
        if (typeof respSaveUSer === "object") {
          const resp = respSaveUSer as MysqlErrorI;
          const couldRollback = await this._database.rollback();
          if (!couldRollback) throw new Error();
          this._database.closeConnection();
          return resp;
        }

        welcomeHandler({
          first_name: body.first_name,
          last_name: body.last_name,
          password: passwordSend,
          email: body.email,
          user_name: body.user_name,
        });

        await this._database.commit();
        this._database.closeConnection();
        return {error: 0};
      }
    } catch (error) {
      await this._database.rollback();
      this._database.closeConnection();
      return { error: 1, message:error };
    }
  }

  public async login(body: UserPostLoginI): Promise<UserResponseLoginI | null> {
    try {
      //const userId = await this._authRepository.getUsername(body.user_name);
      // body.id = userId!;
      const userLogin = await this._authRepository.login(body.user_name);
      const jwtHelper = new JwtHelper();
      let date = generalHelper.transformDate(new Date().toISOString(), "DD/MM/YYYY HH:mm");

      if (userLogin) {
        if (bcryptjs.compareSync(body.password, userLogin.password!)) {
          delete userLogin.password;

          AppNotificationAccessHandler({
            email: userLogin.email,
            first_name: userLogin.first_name,
            last_name: userLogin.last_name,
            date: date,
            subject: emailSubjects["success_access"],
            message: emailSubjects["message_success"],
          });

          this._database.closeConnection();
          return {
            user: userLogin,
            token: jwtHelper.create({ ...userLogin }),
          };
        }
      }

      AppNotificationAccessHandler({
        email: userLogin.email,
        first_name: userLogin.first_name,
        last_name: userLogin.last_name,
        date: date,
        subject: emailSubjects["error_access"],
        message: emailSubjects["message_error"],
      });
      
      this._database.closeConnection();
      return null;
    } catch (error) {
      this._database.closeConnection();
      return null;
    }
  }

  public async recoveryPassword(body: RecoverPasswordI): Promise<ErrorI> {
    let hour: string = "";

    const data: RecoverPasswordI = {...body, random: randomCharacters("num", 6)};

    let validUser = await this._authRepository.getUser(body);

    if (validUser) {
      //this._database.closeConnection();
      //return {error: 0 , message: "usuario encontrado"}
      let quantityRequests = await this._authRepository.quantityRequests(validUser.id);
      //console.log(p);
      if (quantityRequests.user_id >= Allowed.NUMBER_ALLOWED) {
        let findUser = await this._authRepository.getIdRecover(validUser);
        hour = generalHelper.addMinute(findUser![0].date_creation.toISOString(), Allowed.TIME_ALLOWED, 0);
        let date = generalHelper.transformDate(new Date().toISOString(), "YYYY-MM-DD HH:mm");
        //console.log(hour, date);
        let x = generalHelper.compareDateAfter(hour, date);
        //console.log(x);
        if (x) {
          await this._authRepository.updateStatus(validUser.id);
        }
        this._database.closeConnection();
        return { error: 1, message: "Vuelva a intentarlo dentro de 15 minutos." };
      }
      const resp = await this._authRepository.save(data);
      const dataUser = (await this._authRepository.getCode(data)) as unknown as RecoveryPasswordI[];

      this._database.closeConnection();

      let dataEmail: RecoveryPasswordI = {
        code: dataUser[0].code,
        first_name: dataUser[0].first_name,
        last_name: dataUser[0].last_name,
        email: dataUser[0].email,
        attachments: [],
      };

      recoveryPassword(dataEmail);
      if (typeof resp === "object") return resp as MysqlErrorI;
      return { error: 0 };
    } else {
      this._database.closeConnection();
      return { error: 1, message: "Usuario no encontrado o inactivo." , statusCode: HttpStatusCode.NOT_FOUND,};
    }
  }

  public async getId(body: GetRecoverPasswordI) {

    try {
      const recoverPassword = await this._authRepository.getId(body);
    
      if(recoverPassword[0]){
        //console.log('entro al if');
        if(recoverPassword[0].code !== body.code){
          //console.log('entro al if de validacion de codigo');
          this._database.closeConnection();
          return null;
        }else{
          let up = await this._authRepository.updateCodeUsed(recoverPassword[0])
          this._database.closeConnection();
          return recoverPassword[0]
        }
      }else{
        this._database.closeConnection();
        return null;
      }
    } catch (error) {
      this._database.closeConnection();
      return null;
    }
  }

  public async changePassword(body: ChangePassI): Promise<MysqlErrorI> {
    //const cryptoHelper = new CryptoHelper();
    //const pass = cryptoHelper.encrypt(query.password)
    const sal = bcryptjs.genSaltSync(10);
    body.password = bcryptjs.hashSync(body.password, sal);
    const recoverPassword = await this._authRepository.changePassword(body.password);
    this._database.closeConnection();
    if (typeof recoverPassword === "object") return recoverPassword as MysqlErrorI;
    return { error: 0 };
  }

  // public async getId(body: GetRecoverPasswordI): Promise<RecoverResponseI | null> {

  //   try { 
  //     let validUser = await this._authRepository.getUser(body);
  //     if(validUser){
  //         this._database.closeConnection();
  //         return {
  //           token:'dmbkdbfjbfrekhdjhbfkjnvf'
  //         };
  //     }else{
  //       this._database.closeConnection();
  //       return null;
  //     }

  //   } catch (error) {
  //     this._database.closeConnection();
  //     return null;
  //   }

    
  //   // const recoverPassword = await this._authRepository.getId(body) as GetRecoverPasswordI;

  //   // console.log(recoverPassword.code);

  //   // if (!recoverPassword){
  //   //   this._database.closeConnection();
  //   //   return null
  //   // } 
    
  //   // if(recoverPassword.code !== body.code) {
  //   //   this._database.closeConnection();
  //   //   return null
  //   // }
    
  //   // let up = await this._authRepository.updateCodeUsed(recoverPassword);
    
  //   // this._database.closeConnection();

  //   // return recoverPassword[0]
  // }
}

export default AuthBll;
