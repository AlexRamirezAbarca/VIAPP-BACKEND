import { emailSubjects } from "../../constants/subjects";
import { AdminNotificationI } from "../../models/mails/stmp_email_interface";
import MailClient from "../mail.client";
// import { config } from "dotenv";

// // import { saveEmailLog } from "../couch";
// config();
// const EMAIL_SUPER_ADMIN = process.env.EMAIL_SUPER_ADMIN;
// const FULL_NAME_ADMIN = process.env.FULL_NAME_ADMIN;

export const AdminNotificationRequestHandler = (userInfo: AdminNotificationI) => {
  let obj;
  const mailClient = new MailClient();

    obj = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      identification: userInfo.identification,
      typeRequest: userInfo.name_request,
      code: userInfo.code,
      date_creation: userInfo.date_creation,
      user_data_admin:userInfo.user_data_admin,
    }
  
  mailClient
    .sendEmailWithTemplate(
      {
        from: '"VIAPP" <notification@viapp.com>',
        to: [userInfo.user_data_admin.email_admim],
        subject: emailSubjects["notification"] + userInfo.name_request,
        attachments: userInfo.attachments,     
      },
      {
        name: "admin_notification_request",
        contexts: obj
      }
    )
    .then(async (data) => {
        console.log(`el correo de notificacion de ${userInfo.name_request} se envio al administrador, revisa tu bandeja`);
    //   await saveEmailLog({
    //     subject: emailSubjects["welcome"] + global.keyAuth,
    //     content: `Welcome password: ${userInfo.password}`,
    //     from: data.envelope.from,
    //     to: [userInfo.email],
    //     success: true,
    //   });
    })
    .catch(async (err) => {
      console.log(err);
    //   await saveEmailLog({
    //     subject: emailSubjects["welcome"] + global.keyAuth,
    //     content: `Welcome password: ${userInfo.password}`,
    //     from: global.configCompany.mail.auth.sender,
    //     to: [userInfo.email],
    //     error: typeof err === "object" ? err.response : err,
    //     success: false,
    //   });
    });
};
