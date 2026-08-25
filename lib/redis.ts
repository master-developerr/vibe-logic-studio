import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url !== undefined && token !== undefined ? new Redis({ url, token }) : null;

export function isDynamicServerError(err: any): boolean {
  if (!err) return false;
  if (err.digest === "DYNAMIC_SERVER_USAGE") return true;
  if (typeof err.message === "string" && err.message.includes("Dynamic server usage")) return true;
  return false;
}

