import { emailSubjects } from "../../constants/subjects";
import { AppNotificationAccessI } from "../../models/mails/stmp_email_interface";
import MailClient from "../mail.client";
// import { config } from "dotenv";

// import { saveEmailLog } from "../couch";
// config();
// const EMAIL_VIEWS_PATH = process.env.EMAIL_TEMPLATES_FOLDER ?? "views";

export const AppNotificationAccessHandler = (userInfo: AppNotificationAccessI) => {
  let obj;
  const mailClient = new MailClient();
    obj = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      date: userInfo.date,
      message: userInfo.message,
      // clientIp: userInfo.clientIp,
      //attachments: userInfo.attachments
    //   user_name: userInfo.user_name,
    //   email: userInfo.email,
    //   password: userInfo.password,
    }
  // userInfo.attachments.push(
  //   {
  //     filename: 'prueba.pdf',
  //     path: `${EMAIL_VIEWS_PATH}/default/pdf/prueba.pdf`,
  //     contentType: 'application/pdf',
  //   },
  //   // {
  //   //   filename: "header_guardias.jpeg",
  //   //   cid: "header_img",
  //   // },
  //   // {
  //   //   filename: "play_store.png",
  //   //   cid: "play_store",
  //   // },
  //   // {
  //   //   filename: "app_store.png",
  //   //   cid: "app_store",
  //   // },
  //   // {
  //   //   filename: "business.png",
  //   //   cid: "business_img",
  //   // }
  // );
  
  mailClient
    .sendEmailWithTemplate(
      {
        from: '"VIAPP" <notification@viapp.com>',
        to: [userInfo.email],
        subject: userInfo.subject,
        //attachments: userInfo.attachments,     
      },
      {
        name: "app_notification_access",
        contexts: obj
      }
    )
    .then(async (data) => {
        console.log('el correo se envio, revisa tu bandeja...');
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
