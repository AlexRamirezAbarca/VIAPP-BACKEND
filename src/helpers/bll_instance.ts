import DataBase from "../database/connection/connection";


export const instanceBll = async <BllType>(
  bllClass: any
): Promise<BllType | null> => {
  const database = await DataBase.fromKeyAuth();
  
  
  if (!database) return null;
  const couldCreateConnection = await database.createConnection();
  //console.log(couldCreateConnection);
  
  // console.log("Debo crear Connnection:",couldCreateConnection);
  if (!couldCreateConnection) return null;
  // console.log(new bllClass(database));
  return new bllClass(database);
};
