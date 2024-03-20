import { emailSubjects } from "../../constants/subjects";
import { PasswordEmailI } from "../../models/mails/stmp_email_interface";
import MailClient from "../mail.client";
// import { saveEmailLog } from "../couch";

export const welcomeHandler = (userInfo: PasswordEmailI) => {
  let obj;
  const mailClient = new MailClient();
    obj = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      user_name: userInfo.user_name,
      email: userInfo.email,
      password: userInfo.password,

    }
//   userInfo.attachments.push(
//     {
//       filename: "footer_guardias.jpg",
//       cid: "footer_img",
//     },
//     {
//       filename: "header_guardias.jpeg",
//       cid: "header_img",
//     },
//     {
//       filename: "play_store.png",
//       cid: "play_store",
//     },
//     {
//       filename: "app_store.png",
//       cid: "app_store",
//     },
//     {
//       filename: "business.png",
//       cid: "business_img",
//     }
//   );
  
  mailClient
    .sendEmailWithTemplate(
      {
        from: '"VIAPP" <notification@viapp.com>',
        to: [userInfo.email],
        subject: emailSubjects["welcome"]
        //attachments: userInfo.attachments
      },
      {
        name: "welcome_email",
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
