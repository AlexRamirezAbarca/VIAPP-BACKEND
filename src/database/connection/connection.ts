import MySql from "../models/mysql";
import { ConfigDataBaseI } from "../models/config.db";
import dotenv from "dotenv";

dotenv.config();

class DataBase {
  private readonly _config: ConfigDataBaseI;
  private _connection: any;

  private constructor(config: ConfigDataBaseI) {
    this._config = config;
  }

  public static async fromKeyAuth(): Promise<DataBase | null> {
    const config = await this._getConfig();
    if (!config) return null;
    return new DataBase(config);
  }

  private static async _getConfig(): Promise<ConfigDataBaseI | null> {
    const config: ConfigDataBaseI = {
      db: {
        driver: 'MYSQL',
        auth: {
          host: process.env.HOST_MYSQL || '',
          port: process.env.PORT_MYSQL || '',
          user: process.env.USER_MYSQL || '' ,
          password: process.env.PASS_MYSQL || '',
          database: process.env.DB_MYSQL || '',
        },
      },
    };
    return config;
  }

  public async createConnection(): Promise<boolean> {
    switch (this._config.db.driver) {
      case "MYSQL":
        const { host, database } = this._config.db.auth;
        //console.log(host);
        const mysql = MySql.getDatabase(this._config.db.auth);
        const connection = await mysql.getConnection(host + database);
        if (!connection) return false;
        this._connection = connection;
        return true;
      default:
        return false;
    }
  }

  public async executeQuery(query: string) {
    try {
      switch (this._config.db.driver) {
        case "MYSQL":
          // console.log(this._config.db.auth.host, this._config.db.auth.database);
          const mysql = MySql.getDatabase();
          await mysql.executeQuery(`set session sql_mode = '';`,this._connection);
          await mysql.executeQuery(`SET time_zone = '-05:00';`,this._connection);
          return await mysql.executeQuery(query, this._connection);
        default:
          return null;
      }
    } catch (e) {
      console.log(e);
    //   couch.saveLog({
    //     module: "helper",
    //     method: "executeQuery",
    //     error:e,
    //     data: query,
    //   });
      return null;
    }
  }

  public async beginTransaction() {
    try {
      switch (this._config.db.driver) {
        case "MYSQL":
          const mysql = MySql.getDatabase();
          await mysql.beginTransaction(this._connection);
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async rollback() {
    try {
      switch (this._config.db.driver) {
        case "MYSQL":
          const mysql = MySql.getDatabase();
          await mysql.rollback(this._connection);
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async commit() {
    try {
      switch (this._config.db.driver) {
        case "MYSQL":
          const mysql = MySql.getDatabase();
          await mysql.commit(this._connection);
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public closeConnection() {
    switch (this._config.db.driver) {
      case "MYSQL":
        const mysql = MySql.getDatabase();
        mysql.closeConnection(this._connection);
        break;
    }
  }
}

export default DataBase;
