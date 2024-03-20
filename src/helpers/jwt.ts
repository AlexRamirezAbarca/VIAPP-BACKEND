import jwt from "jsonwebtoken";
import { TokenPayloadI, TokenRecorePassI } from "../modules/auth/models";
require("dotenv").config();

export class JwtHelper {

    _expired: string;
    _expiredRecoverPassword: string;

    constructor() {
        this._expired = process.env.EXPIRED!;
        this._expiredRecoverPassword = process.env.EXPIRED_RECOVER_PASS!;
    }

    create(payload: TokenPayloadI): string {
        return jwt.sign({ ...payload }, process.env.KEY_JWT!, {
            expiresIn: this._expired!
        });
    }

    createTokenRecorePassword(payload: TokenRecorePassI): string {
        return jwt.sign({ ...payload }, process.env.KEY_JWT!, {
            expiresIn: this._expiredRecoverPassword!
        });
    }
    
    validate(token: string): Object | null {
        try {
            return jwt.verify(token, process.env.KEY_JWT!) as TokenPayloadI;
        } catch (error) {
            console.log('TOKEN INVÁLIDO');
            return null;
        }
    }
}