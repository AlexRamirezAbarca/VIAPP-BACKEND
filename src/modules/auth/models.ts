import { EmailAttachmentI } from "../../models/mails/email.interface";

export interface UserPostBodyI {
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  identification: string;
  url_photo?: string;
  phone:string;
  birth_date:string;
  charge_id:number;
  area_id:number;
}

export interface TokenPayloadI {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  super_user: boolean;
  password?: string;
  identification: string;
  status: boolean;
}

export interface UserResponseLoginI {
  user: TokenPayloadI;
  token: string;
}

export interface RecoverResponseI {
  token: string;
}

export interface UserPostLoginI {
  id?: number;
  user_name: string;
  password: string;
  // clientIp?: string;
}

export interface UserLoginI {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password?: string;
  status: boolean;
  super_user: boolean;
  identification: string;
}

export interface RecoverPasswordI {
  user_name: string;
  random: string;
}

export interface RecoveryPasswordI {
  first_name: string;
  last_name: string;
  code?: string;
  email: string;
  attachments: EmailAttachmentI[];
  estado?: string;
}

export interface GetRecoverPasswordI {
  id?: number;
  user_id?: number;
  user_name: string;
  random: string;
  code: string;
  date_creation: Date;
}

export interface TokenRecorePassI {
  id: number;
  user_id: number;
  user_name: string;
  code: string;
  status: string;
}

export interface ChangePassI {
  password: string;
}
