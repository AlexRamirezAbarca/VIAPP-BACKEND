import { emailSubjects } from "../../constants/subjects";
import { NotificationReportPdfI } from "../../models/mails/stmp_email_interface";
import MailClient from "../mail.client";
// import { config } from "dotenv";

// // import { saveEmailLog } from "../couch";
// config();
// const EMAIL_SUPER_ADMIN = process.env.EMAIL_SUPER_ADMIN;
// const FULL_NAME_ADMIN = process.env.FULL_NAME_ADMIN;

export const NotificationReportRequestHandler = (userInfo: NotificationReportPdfI) => {
  let obj;
  const mailClient = new MailClient();

    obj = {
      full_name: userInfo.full_name,
    }
  
  mailClient
    .sendEmailWithTemplate(
      {
        from: '"VIAPP" <notification@viapp.com>',
        to: [userInfo.email],
        subject: emailSubjects["report"],
        attachments: userInfo.attachments,     
      },
      {
        name: "notification_report_request",
        contexts: obj
      }
    )
    .then(async (data) => {
        console.log(`reporte enviado revisa tu bandeja`);
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
