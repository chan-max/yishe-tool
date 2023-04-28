import { TABLE_USER } from "./base/user.js";

export function initTables(sequelizeInstance) {
    sequelizeInstance.define('users', TABLE_USER);
    return new Promise(async (resolve, reject) => {
        await sequelizeInstance.sync({ force: true })
        resolve(sequelizeInstance)
    })
}

