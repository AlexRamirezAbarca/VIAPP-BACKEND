export interface SecurityCompanyConfig {
  keyAuth: string;
  nombre: string;
  appConfig: null;
  webConfig: null;
  database: DatabaseSC;
  mail: DatabaseSC;
  files: FilesSC;
  qr: QRSC;
}

export interface DatabaseSC {
  driver: string;
  folder: string;
  auth: AuthSC;
}

export interface FilesSC {
  driver: string;
  auth: null;
  config: ConfigFilesSC;
}

export interface QRSC {
  driver: string;
}
export interface AuthSC {
  host: string;
  port: string;
  user: string;
  database: string;
  pass: string;
  password: string;
  sender: string;
}

export interface ConfigFilesSC {
  pathToSave: string;
}
