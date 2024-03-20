import nodemailer, { Transporter } from "nodemailer";
import { EmailContentI, EmailTemplateI} from "../../models/mails/email.interface";
import hbs from "nodemailer-express-handlebars";
import { config } from "dotenv";
import { DatabaseSC } from "../../models/config.interface";

config();
//const SECURE_PORT = 465;
const EMAIL_VIEWS_PATH = process.env.EMAIL_TEMPLATES_FOLDER ?? "views";

class SmtpClient {
  private readonly _transporter: Transporter;

  public constructor() {
   // const { auth, folder } = mailConfig;
    const port = parseInt(process.env.PORT_SMTP);
    //process.env[""] = "1";
    this._transporter = nodemailer.createTransport({
      host: process.env.HOST_SMTP,
      port: port,
      auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASS_SMTP
      },
      //sender : auth.sender
    });
    this._transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          defaultLayout: "main",
          layoutsDir: `${EMAIL_VIEWS_PATH}/default/layouts`,
          partialsDir: `${EMAIL_VIEWS_PATH}/default/partials`,
        },
        extName: ".hbs",
        viewPath: `./${EMAIL_VIEWS_PATH}/default`,
      })
    );
  }

  public sendEmail(emailContent: EmailContentI): Promise<any> {
    const isContentValid = this.checkEmailContent(emailContent);
    console.log(isContentValid);
    if (isContentValid) return this._transporter.sendMail(emailContent);
    return Promise.reject();
  }

  public async sendEmailWithTemplate(
    emailContent: EmailContentI,
    emailTemplate: EmailTemplateI
  ): Promise<any> {
    const isContentValid = this.checkEmailContent(emailContent, true);
    if (!isContentValid) await Promise.reject();
    const { name, contexts } = emailTemplate;
    
    return await this._transporter.sendMail({
      ...emailContent,
      template: name,
      context: contexts,
    } as any);
  }

  public closeTransport() {
    this._transporter.close();
  }

  private checkEmailContent(
    mailContent: EmailContentI,
    withTemplate: boolean = false
  ): boolean {
    const { from, subject, to, text, html} = mailContent;
    const optionConentMail = from && subject && to ? true : false;
    if (withTemplate) return optionConentMail;
    const bodyContentMail = text || html ? true : false;
    return optionConentMail && bodyContentMail;
  }
}

export default SmtpClient;