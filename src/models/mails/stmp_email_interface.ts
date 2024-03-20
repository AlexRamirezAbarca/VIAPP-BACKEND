import { UserDataAdmin } from "../../modules/requests/models";
import { EmailAttachmentI } from "./email.interface";

export interface RecoveryPasswordI {
  first_name: string;
  last_name: string;
  code?: string;
  email: string;
  //attachments: EmailAttachmentI[];
  estado?: string;
}

export interface PasswordEmailI {
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  // attachments: EmailAttachmentI[];
  // urlAppIos?: string | "null";
  // urlWeb?: string | "null";
  // urlAppAndroid?: string | "null";
}

export interface AppNotificationAccessI{
    first_name: string,
    last_name: string,
    email: string,
    date: string;
    subject: string;
    message: string;
    // clientIp?: string;
}

export interface AdminNotificationI{
  first_name: string,
  last_name: string,
  identification: string;
  name_request: string;
  code: string;
  email: string,
  date_creation: string;
  user_data_admin: UserDataAdmin;
  attachments: EmailAttachmentI[];
}

export interface UserNotificationI{
  first_name: string,
  last_name: string,
  //identification: string;
  name_request: string;
  //code: string;
  email: string,
  date_creation: string;
  attachments: EmailAttachmentI[];
}

export interface NotificationReportPdfI{
  full_name: string,
  email: string,
  attachments: EmailAttachmentI[];
}
