import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ruthapp:admin@mongodb.f1vdfrr.mongodb.net/ruthsapp?retryWrites=true&w=majority&appName=mongoDB";

// TypeScript global cache type
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

/**
 * Global cache to avoid creating many connections in dev
 */
let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    console.log(
      "Connecting to MongoDB, URI starts with:",
      MONGODB_URI.slice(0, 35) + "..."
    );

    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
