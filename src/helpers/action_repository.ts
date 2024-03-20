import DataBase from "../database/connection/connection";
import { MysqlErrorI } from "../models/service_response_interface";

export const actionRepository = async (
    query: string,
    context: DataBase
  ): Promise<MysqlErrorI | number> => {
    try {
      const results = await context.executeQuery(query);
      if (!results) return { error: 1, message: "Error executing the query" };
      
      const responseMysql = results[0];
      
      const objMysql = responseMysql.map(({ ...rest }) => {
        return { ...rest };
      });
      if (objMysql.length > 0) {
        if (objMysql[0].error == 1) {
          return objMysql[0] as MysqlErrorI;
        } else {
          const id = objMysql[0]?.id as number;
          return id;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return { error: 1 };
  };