import { createClient } from 'redis';
import { config } from './settings';


export const redis = createClient({
    username: config.get("REDIS_USERNAME"),
    password: config.get("REDIS_PASSWORD"),
    socket: {
        host: config.get("REDIS_HOST"),
        port: Number(config.get("REDIS_PORT")),
    }
});

redis.on('error', err => console.log('Redis Client Error', err));



