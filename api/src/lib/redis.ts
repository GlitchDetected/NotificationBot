import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_STRING as string);

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("close", () => {
    console.log("Redis connection closed");
});

export default redis;