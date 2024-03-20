import { Request, Response } from "express";
import hbs from "handlebars";
import fs from "fs";
import path from "path";
import pdf from "html-pdf";
// import { uid } from "uid";
// import { STRING_VALID } from "./dates";
import bind from "lodash/bind";
import { GetRequestI, ReportPDFI } from "../../modules/requests/models";
import * as generalHelper from "../general";
// import { config } from "dotenv";
// // const imageToBase64 = require('image-to-base64');
// config();
// const FULL_NAME_ADMIN = process.env.FULL_NAME_ADMIN;


export const reportRequest = async (payload: ReportPDFI, templateReport: string, res: Response, req: Request) => {

  if (!payload) return undefined
  payload.formatted_date = generalHelper.formatDate();
  payload.hour =   generalHelper.transformDate(new Date().toISOString(), "HH:mm:ss");
  //payload.user_data_admin = FULL_NAME_ADMIN;

  // let body = '';
  // if(payload.code == '1112'){
  //    body = `<p>${payload.reason}<p/>`
  // }
  //let location = payload.location as LocationJsonRowI;
  //let novelty = payload.novelty as NoveltyJsonRowI;
//   const headboard = {
//     nameCompany: location.company,/* 
//                 time: CONVERSION_DATE(new Date().toISOString().split('T')[0]), */
//     title: `${STRING_VALID(location.company!)}${new Date().toISOString().split('T')[0]}`
//     // title: `${STRING_VALID(location.company!)}${novelty.sequentiell}`
//   }


  //let logoAlertify = `https://admin.alertify360.com/assets/company/Alertify-logo-color.png`;

  //let responsible = "Sin responsables asignados";
//   if (payload.user_assigned != null) {
//     let users = payload.user_assigned as UserNoveltyJsonRowI[];
//     if (users.length > 1) {
//       responsible = users.map((u) => u.name).join(", ");
//     } else {
//       responsible = `${users[0].name}.`;
//     }
//   }

//   var novel = payload.novelty as NoveltyJsonRowI
//   var date_resolution = (novel.status != "Resuelta") ? "----/--/-- --:--:--" : novel.date_edition;

  //var media = payload.novelty_media as NoveltyMediaJsonRowI[];

//   var multimedia = "";
//   if (media != null) {

//     for await (const m of media) {
//       try {
//         var bs64 = await imageToBase64(m.url);
//         var structure = "data:" + "content-type:image/png" + ";base64," + bs64;
//         var image = `<img class="logoGeneral" src="${structure}"/>`
//         multimedia = multimedia + " " + image;
//       } catch (error) {
//         console.log("eeeeeeeeeee,", error)
//       }
//     }
//   }
  let template = await getTemplate(path.resolve('views', 'template', templateReport), { payload });
  const pdf = await makePdf(template, {
    format: "A4",
    orientation: "portrait",
    border: {
      top: "0px",
      right: "0px",
      left: "0px",
      bottom: "0px",
    }
  })
  return pdf;
  //console.log("----", pdf)
  return bind(sendPdf, null, res, pdf, 'global.configCompany.nombre', 'headboard.title');
}

const getTemplate = (filename: any, props: any) =>
  new Promise((done, fail) => {
    const template = fs.readFileSync(filename, 'utf-8');
    const handlebars = hbs.compile(template)
    const resp = handlebars(props)
    done(resp)
  });

const makePdf = (template: any, config: any) =>
  new Promise((done, fail) => {
    pdf.create(template, config).toBuffer((err: any, buffer: any) => {
      if (err) fail(err);
      done(buffer);
    });
  });

  // const makePdf = (template: any, config: any) =>
  // new Promise((done, fail) => {
  //   pdf.create(template, config).toBuffer((err: any, buffer: any) => {
  //     if (err) {
  //       fail(err);
  //     } else {
  //       const base64 = buffer.toString('base64');
  //       done(base64);
  //     }
  //   });
  // });


  // const sendPdf = (doc: any, query: any, name: any) => {
  //   const response = {
  //     type: 'application/pdf',
  //     headers: {
  //       "Cache-Control": "no-cache",
  //       "Content-Length": Buffer.from(doc, "base64").byteLength,
  //       "Content-Disposition": `${(query !== undefined) ? query : 'attachment'}; filename=` + `${name || generalHelper.generateUniqueCode()}.pdf`,
  //     },
  //     content: doc,  // Contenido en base64
  //   };
  //   console.log('response', response)
  //   return response;
  // };
const sendPdf = (res: any, doc: any, query: any, name: any) => {
  // res.status(200);
  // res.type('application/pdf');
  // res.set({
  //   "Cache-Control": "no-cache",
  //   "Content-Length": doc.byteLength,
  //   "Content-Disposition": `${(query !== undefined) ? query : 'attachment'}; filename=` + `${name || generalHelper.generateUniqueCode()}.pdf`,
  // });
  // res.end(Buffer.from(doc, "base64"));
  //res.json({base:Buffer.from(doc, "base64")})
  const base64String = doc.toString('base64');
  // const responseObj = {
  //   base: base64String,
  //   fileName: 'miArchivo.pdf',  // Agrega el nombre que desees
  // };
  //res.setHeader('Content-Type', 'application/json');  
  return base64String;
};