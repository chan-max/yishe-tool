import { USER_TABLE } from "./base/user.js";

export function initTables(sequelizeInstance) {
    sequelizeInstance.define('users', USER_TABLE);
    return new Promise(async (resolve, reject) => {
        await sequelizeInstance.sync({ force: true })
        resolve(sequelizeInstance)
    })
}

