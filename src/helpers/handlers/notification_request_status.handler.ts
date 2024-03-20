import { emailSubjects } from "../../constants/subjects";
import { GetRequestNotificationI } from "../../modules/requests/models";
import MailClient from "../mail.client";
// import { config } from "dotenv";

// import { saveEmailLog } from "../couch";
// config();
// const EMAIL_VIEWS_PATH = process.env.EMAIL_TEMPLATES_FOLDER ?? "views";



export const NotificationRequestStatusHandler = (userInfo: GetRequestNotificationI) => {

  if(userInfo.description == null){
    userInfo.description = '';
  }else{
    userInfo.description = userInfo.description;
  }

  let obj;
  const mailClient = new MailClient();
    obj = {
      code: userInfo.code,
      description: userInfo.description,
      full_name: userInfo.full_name,
      name_status: userInfo.name_status,
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
        subject:  emailSubjects["status_request"] + ' #'+ userInfo.code,
        //attachments: userInfo.attachments,     
      },
      {
        name: "notification_request_status",
        contexts: obj,
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
