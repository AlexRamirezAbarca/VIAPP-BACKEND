import { Readable } from "stream";

type AttachmentContent = string | Buffer | Readable;

export interface EmailAttachmentI {
  filename: string;
  content?: AttachmentContent;
  contentType?: string;
  encoding?: string;
  path?: string;
  cid?: string;
}

/**
 * @interface EmailContentI
 * Interface that represent the mail content
 * @property from: sender's email address
 * @property port: recipient email addresses
 * @property subject: email subject
 * @property text: email text (optional)
 * @property html: email html template (optional)
 * @important You need to pass text or html to send the email
 */
export interface EmailContentI {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachmentI[];
}

export interface EmailTemplateI {
  name: string;
  contexts: any;
}
