import { USER_TABLE } from "./base/user.js";
import { BASEMODEL_TABLE } from "./base/baseModel.js";


export function initTables(sequelizeInstance) {
    sequelizeInstance.define('users', USER_TABLE);
    sequelizeInstance.define('base_model', BASEMODEL_TABLE);
    return new Promise(async (resolve, reject) => {
        await sequelizeInstance.sync({force:false})
        resolve(sequelizeInstance)
    })
}

