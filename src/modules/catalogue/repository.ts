import DataBase from "../../database/connection/connection";
import { CatalogueRowI } from "./models";

export class CatalogueRepository {

    private readonly _context: DataBase;

    public constructor(context: DataBase) {
        this._context = context;
    }

    public async get() {
        const query = `CALL SP_CATALOGUE("SELECT");`;
    
        const results = await this._context.executeQuery(query);
        if (results?.length > 0) return results[0] as CatalogueRowI[];
        return null;
    }
}

