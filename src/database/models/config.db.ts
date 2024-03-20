export type DatabaseCredential = {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  };
  
  export interface ConfigDataBaseI {
    db: {
      driver: "MYSQL";
      auth: DatabaseCredential;
      connection?: any;
    };
  }
  