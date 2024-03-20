import { ServiceResponseI } from "../models/service_response_interface";
import moment from "moment";
import { randomCharacters } from "./random";

export const FORMATS = {
  mobile: "DD/MM/YYYY", // 10 de mar 2022
  web: "DD/MM/YYYY",
  ONLY_DATE: "L",
  GENERAL: "DD/MM/YYYY - HH:mm:ss",
  // GENERAL:"YYYY-DD-MM  HH:mm:ss",
  MONTH_NAME: "DD MMMM YYYY",
  TIME_WITH_SECONDS: "LTS",
  TIME_WITHOUT_SECONDS: "LT",
};

export const serviceResponse = (objServiceResponse: ServiceResponseI) => {
  if (objServiceResponse.res !== null) {
    objServiceResponse.res.statusCode = objServiceResponse.statusCode ?? 200;
    return objServiceResponse.res.json({
      data: objServiceResponse.data ?? null,
      message: objServiceResponse.message ?? "",
    });
  }
};

export const addMinute = (date: string, minute: number, allowed: number) => {
  try {
    let ndate = moment(date)
      .add(minute, "minute")
      .add(allowed, "minute")
      .format("YYYY-MM-DD HH:mm");
    return ndate;
  } catch (error) {
    return date;
  }
};

export const transformDate = (
  date: string,
  format: string = FORMATS.GENERAL
) => {
  try {
    return moment(date).format(format);
  } catch (error) {
    return date;
  }
};

export const compareDateAfter = (dateStart: string, dateCreation: string) => {
  let formato = "YYYY-MM-DD HH:mm";
  let start = moment(dateStart, formato);
  let dateCreation1 = moment(dateCreation, formato);
  let x = dateCreation1.isAfter(start);
  return x;
};

export const addDay = (date: string, minute: number) => {
  try {
    return moment(date).add(minute, "day").format("YYYY-MM-DD");
  } catch (error) {
    return date;
  }
};

export const formatDate = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.toLocaleString("es-ES", { month: "long" });
  let year = date.getFullYear();
  let hour = transformDate(new Date().toISOString(), "HH:mm:ss");
  let dateFormated = day + " de " + month + " de " + year;

  return dateFormated;
};

export const generateUniqueCode = () => {
  let code = randomCharacters("num", 6);
  let date = transformDate(new Date().toISOString(), "YYYYMMDDHHmmssSSS");
  let codeUnique = `${date}${code}`;
  return codeUnique;
  // const sections = Array.from({ length: length }, () =>
  //   generateNumericSection()
  // );
  //return sections.join("-");
};

// export const generateNumericSection = () => {
//   const min = 1000;
//   const max = 9999;
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
