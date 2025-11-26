import mongoose from "mongoose";

// Try to read from env, but fall back to a hard-coded string in dev
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ruthapp:admin@mongodb.f1vdfrr.mongodb.net/ruthsapp?retryWrites=true&w=majority&appName=mongoDB";

// TEMP: log so we can see what’s going on
console.log("MONGODB_URI being used by dbConnect:", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing even after fallback");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// @ts-ignore
if (!global.mongoose) {
  // @ts-ignore
  global.mongoose = cached;
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
