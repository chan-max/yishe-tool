import redis from 'redis'

export const createRedisClient = () => new Promise(async (resolve, reject) => {
    try{
        const client = await redis.createClient( 6379, '127.0.0.1').connect();
        resolve(client)
    }catch(e){
        reject(e);
    }
})
