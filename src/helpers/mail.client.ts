import SMTPClient from "./mails/smtp";
import {EmailAttachmentI, EmailContentI, EmailTemplateI} from "../models/mails/email.interface";
// import { Redis } from "./redis";
import { SecurityCompanyConfig } from "../models/config.interface";
import path from "path";
import { config } from "dotenv";

config();
const EMAIL_VIEWS_PATH = process.env.EMAIL_TEMPLATES_FOLDER ?? "views";

class MailClient {
  // private async _getConfigs(): Promise<SecurityCompanyConfig | null> {
  //   //const redis = new Redis();
  //   //await redis.getConfigRedis(global.keyAuth);

  //   if (global.configCompany) {
  //     if (global.configCompany.keyAuth === global.keyAuth) {
  //       return global.configCompany;
  //     }
  //     return null;
  //   } else {
  //     return null;
  //   }
  // }

  public async sendEmail(emailContent: EmailContentI): Promise<any> {
    //const configs = await this._getConfigs();
    
    //if (!configs) return Promise.reject("CAN'T GET CONFIGS");

    switch ("SMTP") {
      case "SMTP":
        console.log('hola sendEmail');
        const smtp = new SMTPClient();
        return smtp.sendEmail(emailContent);
    }
    return Promise.reject();
  }

  public async sendEmailWithTemplate(
    emailContent: EmailContentI,
    emailTemplate: EmailTemplateI
  ): Promise<any> {
    //const configs = await this._getConfigs();
    
   // if (!configs) return await Promise.reject("CAN'T GET CONFIGddS"); ESTA LINEA SE TIENE QUE OMITIR
    // if (emailContent.attachments)
    // this._loadEmbebedImages(emailContent.attachments);

    switch ("SMTP") {
      case "SMTP":
       // console.log('hola sendEmailWithTemplate');
        const smtp = new SMTPClient();
        const response = await smtp.sendEmailWithTemplate(
          emailContent,
          emailTemplate
        );
        //smtp.closeTransport();
        return response;
    }
    return await Promise.reject("DRIVER INVALID");
  }

  // private _loadEmbebedImages(
  //   attachments: EmailAttachmentI[]) {
  //     //console.log(',dnvkedbgkbfkgbvrkgbkr');
  //   attachments.forEach((attachment) => {
  //     attachment.path = path.resolve(
  //       `${EMAIL_VIEWS_PATH}/default/img/${attachment.filename}`
  //     );
  //   });
  // }
}

export default MailClient;
