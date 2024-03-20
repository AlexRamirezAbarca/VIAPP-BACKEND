import DataBase from "../../database/connection/connection";
import { instanceBll } from "../../helpers/bll_instance";
import { CatalogueRepository } from "./repository";

class CatalogueBll {
  private readonly _database: DataBase;
  private readonly _repository: CatalogueRepository;

  private constructor(database: DataBase) {
    this._database = database;
    this._repository = new CatalogueRepository(this._database);
  }

  public static fromContext(): Promise<CatalogueBll | null> {
    return instanceBll<CatalogueBll>(CatalogueBll);
  }

  public async get() {
    const catalogue = await this._repository.get();
    // const media_type: MediaType[] = [
    //   {
    //     label: MediaTypeC.TYPE_PHOTO,
    //     code: MediaTypeC.CODE_PHOTO
    //   },
    //   {
    //     label: MediaTypeC.TYPE_AUDIO,
    //     code: MediaTypeC.CODE_AUDIO
    //   }
    // ]
    // const contact_type: MediaType[] = [
    //   {
    //     label: ContactTypeC.TYPE_CONTACT_NUMERO,
    //     code: ContactTypeC.CODE_CONTACT_NUMERO
    //   },
    //   {
    //     label: ContactTypeC.TYPE_CONTACT_CORREO,
    //     code: ContactTypeC.CODE_CONTACT_CORREO
    //   }
    // ];

    // const markings = [
    //   {
    //     code: ContactTypeC.PLACE_MARKING_ZONE,
    //     label: ContactTypeC.CODE_PLACE_MARKING_ZONE,
    //     types: [
    //       {
    //         label: ContactTypeC.CODE_MARKING_TYPE_INGRESO,
    //         code: ContactTypeC.MARKING_TYPE_INGRESO
    //       },
    //       {
    //         label: ContactTypeC.CODE_MARKING_TYPE_SALIDA,
    //         code: ContactTypeC.MARKING_TYPE_SALIDA
    //       }
    //     ]
    //   },
    //   {
    //     code: ContactTypeC.PLACE_MARKING_PC,
    //     label: ContactTypeC.CODE_PLACE_MARKING_PC,
    //     types: [
    //       {
    //         label: ContactTypeC.CODE_MARKING_TYPE_INGRESO,
    //         code: ContactTypeC.MARKING_TYPE_INGRESO
    //       },
    //       {
    //         label: ContactTypeC.CODE_MARKING_TYPE_SALIDA,
    //         code: ContactTypeC.MARKING_TYPE_SALIDA
    //       }
    //     ]
    //   }
    // ];
    // const place_marking_type: MediaType[] = [
    //   {
    //     label: ContactTypeC.CODE_PLACE_MARKING_ZONE,
    //     code: ContactTypeC.PLACE_MARKING_ZONE
    //   },
    //   {
    //     label: ContactTypeC.CODE_PLACE_MARKING_PC,
    //     code: ContactTypeC.PLACE_MARKING_PC
    //   }
    // ]
    // const marking_type_round: MediaType[] = [
    //   {
    //     label: ContactTypeC.CODE_MARKING_TYPE_INGRESO,
    //     code: ContactTypeC.MARKING_TYPE_INGRESO
    //   },
    //   {
    //     label: ContactTypeC.CODE_MARKING_TYPE_SALIDA,
    //     code: ContactTypeC.MARKING_TYPE_SALIDA
    //   }
    // ]
    this._database.closeConnection();

    if (catalogue) {

      return catalogue.map(element => {
        return {
          charge: JSON.parse(element.charge),
          area: JSON.parse(element.area),
        }
      })
    }
    return null;
  }
}

export default CatalogueBll;
