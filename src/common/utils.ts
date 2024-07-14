


function sleep(ms) {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            resolve(void 0)
        }, ms);
    })
}


class Utils {
    sleep = sleep
}


export default new Utils()
