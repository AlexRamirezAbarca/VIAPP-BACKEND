import { Request, Response } from "express";
import { messages } from "../../constants/messages";
import * as generalHelper from "../../helpers/general";
import AuthBLL from "./bll";
import { ResponseBuilder } from "../../helpers/response_builder";
import { HttpStatusCode } from "../../constants/status_code";
import {
  ChangePassI,
  GetRecoverPasswordI,
  RecoverPasswordI,
  TokenRecorePassI,
  UserPostLoginI,
} from "./models";
import { JwtHelper } from "../../helpers/jwt";
// import { ClientIp } from "../../helpers/client_ip";

export class AuthController {
  public async register(req: Request, res: Response) {
    const authBLL = await AuthBLL.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!authBLL) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }

    const resp = await authBLL.register(req.body);

    if (resp.error != 0){
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );
      }else{
        response = responseBuilder.build(
          HttpStatusCode.OK,
          messages["createAccount"]
        );
      }
    return generalHelper.serviceResponse(response);
  }

  public async login(req: Request<{}, {}, UserPostLoginI>, res: Response) {
    const authBll = await AuthBLL.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build();
    // let clientIp = new ClientIp();
    // req.body.clientIp = await clientIp.getIp();
    // const ip = "https://ipinfo.io/json";
    // fetch(ip).then((res) => res.json()).then((json) => {
    //     console.log(json.ip);
    //     req.body.clientIp = json.ip;
    //   }
    // );
    //const clientIp = ip.address();
    
    //req.body.clientIp = clientIp;

    if (!authBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    const respLogin = await authBll.login(req.body);

    if (respLogin) {
      if (respLogin.user.status == false) {
        response = responseBuilder.build(
          HttpStatusCode.UNAUTHORIZED,
          messages["userInactive"],
          null
        );
        return generalHelper.serviceResponse(response);
      }
      responseBuilder.setData(response, respLogin);
    } else {
      response = responseBuilder.build(
        HttpStatusCode.UNAUTHORIZED,
        messages["loginFail"],
        null
      );
    }

    return generalHelper.serviceResponse(response);
  }

  public async recoveryPassword(
    req: Request<{}, {}, RecoverPasswordI>,
    res: Response
  ) {
    const recoverPasswordBll = await AuthBLL.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.CREATED);

    if (!recoverPasswordBll) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    const resp = await recoverPasswordBll.recoveryPassword(req.body);

    if (resp.error != 0) {
      response = responseBuilder.build(
        resp.statusCode ?? HttpStatusCode.BAD_REQUEST,
        resp.message ? resp.message : messages["400"]
      );
    } else {
      response = responseBuilder.build(
        HttpStatusCode.OK,
        messages["forgetPasswordRecover"]
      );
    }
    return generalHelper.serviceResponse(response);
  }

  public async get(req: Request<{}, {}, GetRecoverPasswordI>, res: Response) {
    //global.keyAuth = String(req.query.keyAuth);

    const authBLL = await AuthBLL.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.OK);

    if (!authBLL) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    const query = req.body as unknown as GetRecoverPasswordI;
    const resp = await authBLL.getId(query);

    if (resp != undefined) {
      const timeElapsed =
        (new Date().valueOf() - resp.date_creation.valueOf()) / 1000 / 60;

      // console.log('tiempo transcurrido', timeElapsed);
      // console.log('ENV', Number(process.env.TIME_LIMIT_RECOVER));

      if (timeElapsed <= Number(process.env.TIME_LIMIT_RECOVER)) {
        const dataUser = { ...resp } as unknown as TokenRecorePassI;

        const jwtHelper = new JwtHelper();
        const data = {
          token: jwtHelper.createTokenRecorePassword(dataUser),
        };

        //responseBuilder.setData(response, data);
        response = responseBuilder.build(
          HttpStatusCode.OK,
          messages["validcode"],
          data
        );

      } else {
        response = responseBuilder.build(
          HttpStatusCode.UNAUTHORIZED,
          messages["codeExpired"]
        );
      }
    } else
      response = responseBuilder.build(
        HttpStatusCode.UNAUTHORIZED,
        messages["invalidCode"]
      );
    return generalHelper.serviceResponse(response);
  }

  public async changePassword(
    req: Request<{}, {}, ChangePassI>,
    res: Response
  ) {
    const authBLL = await AuthBLL.fromContext();
    const responseBuilder = new ResponseBuilder(res);
    let response = responseBuilder.build(HttpStatusCode.OK);

    if (!authBLL) {
      response = responseBuilder.build(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        messages["500"]
      );
      return generalHelper.serviceResponse(response);
    }
    const query = req.body as unknown as ChangePassI;
    const resp = await authBLL.changePassword(query);

    if (resp.error != 0) {
      response = responseBuilder.build(
        HttpStatusCode.BAD_REQUEST,
        resp.message ?? messages["400"]
      );
    } else {
      response = responseBuilder.build(
        HttpStatusCode.OK,
        messages["changePassword"]
      );
    }
    return generalHelper.serviceResponse(response);
  }

  // public async get(req: Request<{}, {}, GetRecoverPasswordI>, res: Response) {

  //   const authBll = await AuthBLL.fromContext();
  //   const responseBuilder = new ResponseBuilder(res);
  //   let response = responseBuilder.build(HttpStatusCode.OK);

  //   if (!authBll) {
  //     response = responseBuilder.build(
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       messages["500"]
  //     );
  //     return generalHelper.serviceResponse(response);
  //   }
  //   const query = req.body as unknown as GetRecoverPasswordI;

  //   const resp = await authBll.getId(query);

  //   if(resp){
  //     responseBuilder.setData(response, resp);
  //   }else{
  //     response = responseBuilder.build(
  //       HttpStatusCode.NOT_FOUND,
  //       messages["userNotFound"],
  //     );
  //   }

  //   // if(resp != undefined){

  //   //   const min = (new Date().valueOf()-resp.date_creation.valueOf())/1000/60
  //   //   console.log(min);
  //   //   console.log(process.env.TIME_LIMIT_RECOVER);
  //   //   if(min <= Number(process.env.TIME_LIMIT_RECOVER)){
  //   //     const dataUser={...resp} as unknown as TokenRecorePassI

  //   //       const jwtHelper = new JwtHelper();
  //   //       const data = { token: jwtHelper.createTokenRecorePassword(dataUser)
  //   //       }

  //   //       responseBuilder.setData(response, data);
  //   //   }else{
  //   //     response = responseBuilder.build(
  //   //       HttpStatusCode.UNAUTHORIZED,
  //   //       messages["codeExpired"]
  //   //     );
  //   //   }
  //   // }else
  //   //   response = responseBuilder.build(
  //   //     HttpStatusCode.UNAUTHORIZED,
  //   //     messages["invalidCode"]
  //   //   );
  //   return generalHelper.serviceResponse(response);
  // }
}
