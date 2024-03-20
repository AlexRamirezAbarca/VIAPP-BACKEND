import { DatabaseCredential } from "../models/config.db";
import mysql, { PoolCluster, PoolConnection } from "mysql2";
import { asyncWrapper } from "../../helpers/async.wrapper";

const DEFAULT_CONNECTION_LIMIT = 8;

class MySql {
  private readonly _cluster: PoolCluster;
  private readonly _groupIds: string[] = [];
  private static _instance: MySql | null = null;

  private constructor() {
    
    this._cluster = mysql.createPoolCluster(
      
    );
  }

  public static getDatabase(config?: DatabaseCredential): MySql {
    if (!this._instance) this._instance = new MySql();
    if (!config) return this._instance;
    this._instance._addGroup(config);
    return this._instance;
  }

  private _addGroup(config: DatabaseCredential) {
    const { host, database } = config;
    const groupIncluded = this._groupIds.includes(host + database);
    if (groupIncluded) return;

    const poolConnectionLimit = parseInt(process.env.CONNECTION_LIMIT!);
    this._cluster.add(host + database, {
      host: config.host,
      port: parseInt(config.port),
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: isNaN(poolConnectionLimit) ? DEFAULT_CONNECTION_LIMIT : poolConnectionLimit,
    });

    this._groupIds.push(host + database);
  }

  private async _createConnection(groupId: string) {
    const connection = await asyncWrapper<PoolConnection>(() =>
      this._getPoolConnection(groupId)
    );

    return connection;
  }

  private _getPoolConnection(groupId: string) {

    return new Promise<PoolConnection>((resolve, reject) => {
      this._cluster.getConnection(groupId, (err, con) => {
        if (err) reject(err);
        else resolve(con);
      });
    });
  }

  public getConnection(groupId: string): Promise<PoolConnection | null> {
    return this._createConnection(groupId);
  }

  public executeQuery(queryString: string, connection: PoolConnection): Promise<any> {
    if (!connection) return Promise.reject(null);

    return new Promise<any>((resolve, reject) => {
      connection.query(queryString, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  public beginTransaction(connection: PoolConnection): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public rollback(connection: PoolConnection): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      connection.rollback((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public commit(connection: PoolConnection): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      connection.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public closeConnection(connection: PoolConnection) {
    connection.release();
    console.log("¡¡CONEXION LIBERADA!!");
  }
}

export default MySql;
