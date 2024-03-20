import { NextFunction, Request, Response } from "express";
import { JwtHelper } from "../helpers/jwt";
import { ServiceResponseI } from "../models/service_response_interface";
import * as generalHelper from "../helpers/general";
import { messages } from "../constants/messages";
import { TokenPayloadI, TokenRecorePassI } from "../modules/auth/models";

export const validateJwtHeader = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    let objServiceResponse: ServiceResponseI = {
        res,
        statusCode: 401,
        message: messages["invalidToken"]
    };
    if (token) {
        const jwtHelper = new JwtHelper();
        const payload = jwtHelper.validate(token) as TokenPayloadI;

        if (payload) {
            global.token = payload;
            next();
        } else {
            return generalHelper.serviceResponse(objServiceResponse);
        }
    } else {
        let objServiceResponse: ServiceResponseI = { 
            res,
            statusCode: 401,
            message: messages["authorizationHeader"]
        };
        return generalHelper.serviceResponse(objServiceResponse);
    }
};

export const validateJwtBody = async (req: Request, res: Response, next: NextFunction) => {
    const token = String(req.body.token);
    let objServiceResponse: ServiceResponseI = {
        res,
        statusCode: 401,
        message: messages["tokenChangePassword"]
    };
    if (token) {
        const jwtHelper = new JwtHelper();
        const payload = jwtHelper.validate(token) as TokenRecorePassI;
        //console.log(payload);
        if (payload) {
            //global.keyAuth = payload.keyAuth!;
            global.user = {
                id: payload.id,
                user_id: payload.user_id,
                user_name: payload.user_name,
                code: payload.code,
                status: payload.status,
            }

            next();
        } else {
            return generalHelper.serviceResponse(objServiceResponse);
        }
    } else {

        return generalHelper.serviceResponse(objServiceResponse);
    }
};