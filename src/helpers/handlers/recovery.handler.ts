import { emailSubjects } from "../../constants/subjects";
import { RecoveryPasswordI } from "../../models/mails/stmp_email_interface";
import MailClient from "../mail.client";
// import { saveEmailLog } from "../couch";

export const recoveryPassword = (userInfo: RecoveryPasswordI) => {
  const mailClient = new MailClient();
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
//       filename: "business.png",
//       cid: "business_img",
//     }
//   );

  mailClient
    .sendEmailWithTemplate(
      {
        from: '"VIAPP" <recoverypassword@viapp.com>',
        to: [userInfo.email],
        subject: emailSubjects["password_recovery"],
        //attachments: userInfo.attachments,
      },
      {
        name: "password_recovery",
        contexts: {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          code: userInfo.code,
        },
      }
    )
    .then(async (data) => {
        console.log('el correo se envio, revisa tu bandeja...')
        //console.log(data);
    //   await saveEmailLog({
    //     subject: emailSubjects["password_recovery"] + global.keyAuth,
    //     content: `Code: ${userInfo.code}`,
    //     from: data.envelope.from,
    //     to: [userInfo.email],
    //     success: true,
    //   });
    })
    .catch(async (err) => {
      console.log(err);
      
    //   await saveEmailLog({
    //     subject: emailSubjects["password_recovery"] + global.keyAuth,
    //     content: `Code: ${userInfo.code}`,
    //     from: global.configCompany.mail.auth.sender,
    //     to: [userInfo.email],
    //     error:err,
    //     success: false,

    //   });
    });
};
